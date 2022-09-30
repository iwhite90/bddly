import * as path from 'path';
import * as model from './model';
import * as indexTemplate from './index-template';
import * as fileutils from './file-utils';

const rootName = 'bddly';

export const getBreadcrumbFromPath = (filePath: string): string[] => {
  const pathTokens = filePath.split(path.sep);
  const tailIndex = pathTokens.indexOf(rootName) + 1;
  return pathTokens.splice(tailIndex);
};

export const getSuiteNameFromTestName = (testName: string): string => {
  const suiteNameTokens = testName.split(':');
  suiteNameTokens.pop();
  return suiteNameTokens.join(':');
};

export const writeContentsPage = (projectName: string, outputDestination: string) => {
  const index = indexTemplate.toHTML(projectName, fileutils.buildTree());
  fileutils.writeFile(outputDestination, 'index.html', index);
};
