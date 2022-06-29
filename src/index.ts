import * as model from './model';
import * as structure from './structure';
import * as suiteTemplate from './suite-template';
import * as fileutils from './file-utils';

const steps: model.Step[] = [];
const reports: model.Report[] = [];
const interestingGivens: model.InterestingGiven[] = [];
const specInfos: model.SpecInfo[] = [];
const outputDestination = './reports/bddly';

let testFailed: boolean;
let appName: string = 'Bddly reports';

export const Step = (target: any, methodName: string, descriptor: PropertyDescriptor) => {
  const stepType = target.constructor.name;
  const stepDescription = methodName.replace(/([a-zA-Z])(?=[A-Z])/g, '$1 ').toLowerCase();
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const rawParam = args[0] ? args[0] : '';
    const parameter = handleParam(rawParam);

    steps.push({ stepType, description: stepDescription, param: parameter });
    const result = originalMethod.apply(this, args);
    return result;
  };
};

export const interestingGiven = (title: string, data: any) => {
  interestingGivens.push({ title, data: handleParam(data) });
};

export const report = (title: string, data: string) => {
  reports.push({ title, data });
};

export const suiteStart = (name: string): void => {
  appName = name;
  structure.load();
};

export const specFinished = (testName: string) => {
  if (!steps.length) return;

  specInfos.push({
    testName: testName.split(':').pop() ?? '',
    steps: steps.slice(0),
    interestingGivens: interestingGivens.slice(0),
    reportLog: reports.slice(0),
    testFailed,
  });
  resetSpec();
};

export const suiteFinished = (testName: string, sourcePath: string) => {
  const suiteName = structure.getSuiteNameFromTestName(testName);
  const breadcrumb = structure.getBreadcrumbFromPath(sourcePath);

  breadcrumb[breadcrumb.length - 1] = breadcrumb[breadcrumb.length - 1].replace('.ts', '');

  structure.add(breadcrumb);
  structure.save();

  const htmlReport = suiteTemplate.toHTML(appName, suiteName, specInfos, breadcrumb);
  const fileName = breadcrumb.pop() + '.html';
  const targetDir = [outputDestination, breadcrumb.join('/')].join('/');

  fileutils.writeFile(targetDir, fileName, htmlReport);
};

type JestAssertionError = {
  matcherResult: {
    actual: string;
    expected: string;
  };
};

export const spec = (name: string, action: () => Promise<void>) => {
  test(name, async () => {
    try {
      await action();
    } catch (error) {
      testFailed = true;
      if ((error as JestAssertionError) && (error as JestAssertionError).matcherResult) {
        const errorReport = {
          expected: (error as JestAssertionError).matcherResult.expected,
          actual: (error as JestAssertionError).matcherResult.actual,
        };
        report('Test error', JSON.stringify(errorReport, null, 2));
      }

      throw error;
    }
  });
};

afterAll(() => {
  structure.writeContentsPage(appName, outputDestination);
});

const resetSpec = () => {
  steps.length = 0;
  reports.length = 0;
  interestingGivens.length = 0;
  testFailed = false;
};

const handleParam = (param: any): string => {
  switch (typeof param) {
    case 'number':
      return param + '';
    case 'boolean':
      return param ? 'true' : 'false';
    case 'object':
      return JSON.stringify(param, null, 4);
    case 'string':
      return param;
    default:
      return '';
  }
};
