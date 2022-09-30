import * as fs from 'fs';
import { Node } from './model';

export const writeFile = (dir: string, filename: string, contents: string): void => {
  mkDirIfNotExists(dir);

  fs.writeFileSync([dir, filename].join('/'), contents);
};

const mkDirIfNotExists = (dir: string) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (err) {
    console.error(err);
  }
};

export const buildTree = (): Node => {
  const root = {
    path: './reports/bddly',
    name: 'bddly',
    children: [],
  };

  const stack: Node[] = [root];

  while (stack.length) {
    const currentNode = stack.pop();

    if (currentNode) {
      const children = fs.readdirSync(currentNode.path);

      for (let child of children) {
        if (child === 'index.html') continue;
        
        const childPath = `${currentNode.path}/${child}`;
        const childNode = {
          path: childPath,
          name: child,
          children: [],
        };
        currentNode.children.push(childNode);

        if (fs.statSync(childNode.path).isDirectory()) {
          stack.push(childNode);
        }
      }
    }
  }

  return root;
};