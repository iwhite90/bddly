import * as model from './model';
import * as indexTemplate from './index-template';
import * as fileutils from './file-utils';

const workingFile = 'bddly-temp';
const rootName = 'bddly-tests';

let root: model.Node = {
  name: rootName,
  children: [],
};

export const load = (): void => {
  const data = fileutils.loadStructureFromFile(['./', workingFile].join(''));
  if (data.name === root.name) root = data;
};

export const save = (): void => {
  fileutils.writeFile('./', workingFile, JSON.stringify(root));
};

export const getBreadcrumbFromPath = (path: string): string[] => {
  const pathTokens = path.split('/');
  const tailIndex = pathTokens.indexOf(rootName) + 1;
  return pathTokens.splice(tailIndex);
};

export const getSuiteNameFromTestName = (testName: string): string => {
  const suiteNameTokens = testName.split(':');
  suiteNameTokens.pop();
  return suiteNameTokens.join(':');
};

export const add = (breadcrumb: string[]): void => {
  addToStructure(root, breadcrumb);
};

export const writeContentsPage = (projectName: string, outputDestination: string) => {
  const index = indexTemplate.toHTML(projectName, root);
  fileutils.writeFile(outputDestination, 'index.html', index);
};

const addToStructure = (node: model.Node, breadcrumb: string[]) => {
  if (breadcrumb.length === 0) return;

  const [_, ...rest] = breadcrumb;
  const existingNode = node.children.filter((n) => n.name === breadcrumb[0])[0];

  if (existingNode) {
    addToStructure(existingNode, rest);
  } else {
    const newNode = { name: breadcrumb[0], children: [] };
    node.children.push(newNode);
    addToStructure(newNode, rest);
  }
};
