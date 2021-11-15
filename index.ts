import * as model from './model';
import * as structure from './structure';
import * as suiteTemplate from './suite-template';
import * as indexTemplate from './index-template';
import * as fileutils from './file-utils';

const steps: model.Step[] = [];
const reports: model.Report[] = [];
const interestingGivens: model.InterestingGiven[] = [];
const specInfos: model.SpecInfo[] = [];
const outputDestination = './bdd-reports';

let testFailed: boolean;

export const Step = (target: any, methodName: string, descriptor: PropertyDescriptor) => {
    const stepType = target.constructor.name;
    const stepDescription = methodName.replace(/([a-zA-Z])(?=[A-Z])/g, '$1 ').toLowerCase();
    const originalMethod = descriptor.value;

    descriptor.value = function (...args) {
        const param = args[0] ? args[0] : '';
        steps.push({ stepType: stepType, description: stepDescription, param: param });
        const result = originalMethod.apply(this, args);
        return result;
    };
};

export const interestingGiven = (title: string, data: any) => {
    interestingGivens.push({ title, data });
};

export const report = (title: string, data: string) => {
    reports.push({ title, data });
};

export const suiteStart = () => {
    structure.load();
};

export const specFinished = (testName: string) => {
    specInfos.push({
        testName: testName.split(':').pop(),
        steps: steps.slice(0),
        interestingGivens: interestingGivens.slice(0),
        reportLog: reports.slice(0),
        testFailed: testFailed,
    });
    resetSpec();
};

export const suiteFinished = (testPath: string, testName: string, sourcePath: string) => {
    const suiteName = structure.getSuiteNameFromTestName(testName);
    const breadcrumb = structure.getBreadcrumbFromPath(sourcePath);
    const tsFileName = breadcrumb[breadcrumb.length - 1];

    breadcrumb[breadcrumb.length - 1] = tsFileName.replace('.ts', '');
    breadcrumb[breadcrumb.length - 1].replace('.ts', '');

    structure.add(breadcrumb);
    structure.save();

    const htmlReport = suiteTemplate.toHTML(suiteName, specInfos, breadcrumb);
    const fileName = breadcrumb.pop() + '.html';
    const targetDir = [outputDestination, breadcrumb.join('/')].join('/');

    fileutils.writeFile(targetDir, fileName, htmlReport);
};

export const spec = (name, action) => {
    test(name, async () => {
        try {
            await action();
        } catch (error) {
            testFailed = true;
            throw error;
        }
    });
};

afterAll(() => {
    writeContentsPage();
});

const resetSpec = () => {
    steps.length = 0;
    reports.length = 0;
    interestingGivens.length = 0;
    testFailed = false;
};

const writeContentsPage = () => {
    const index = indexTemplate.toHTML();
    fileutils.writeFile(outputDestination, 'index.html', index);
    // helper(root);
};

const helper = (node: model.Node) => {
    console.log(node.name);
    node.children.forEach(helper);
};
