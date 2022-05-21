import * as fs from 'fs';
import { Node } from './model';

export const writeFile = (dir: string, filename: string, contents: string): void => {
  mkDirIfNotExists(dir);

  fs.writeFileSync([dir, filename].join('/'), contents);
};

export const loadStructureFromFile = (file: string): Node => {
  try {
    const data = fs.readFileSync(file);
    return JSON.parse(data.toString());
  } catch (e) {
    return { name: '', children: [] };
  }
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
