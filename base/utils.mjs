import fs from 'fs'
import { EOL } from 'os';
import { COL_RED, COL_RESET } from './color.mjs';

export const removeBrakets = (toPath) => toPath.replaceAll('"', '').replaceAll(`'`, '');

export const exists = async (currentPath, fullPath) => new Promise((resolve) => { 
  fs.stat(fullPath, (err, stat) => {
    if (err || !stat.isDirectory()) {
      resolve([ currentPath, `${COL_RED}Wrong path!${COL_RESET}${EOL}` ]) 
    }
    resolve([ fullPath, '' ])
  });
});