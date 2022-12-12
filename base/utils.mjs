import fs from 'fs'
import { EOL } from 'os';
import { COL_RED, COL_RESET } from './color.mjs';

export const removeBrakets = (toPath) => toPath.replaceAll('"', '').replaceAll(`'`, '');

export const existsDir = async (fullPath) => await exists(fullPath, true);

export const exists = async (fullPath, checkDir = false) => new Promise((resolve) => { 
  fs.stat(fullPath, (err, stat) => {
    if (err || (checkDir && !stat.isDirectory())) {
      resolve(false);
    }
    resolve(true);
  });
});