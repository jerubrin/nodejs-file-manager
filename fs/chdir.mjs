import path, { resolve } from 'path'
import fs from 'fs'
import { COL_RED, COL_RESET } from '../base/color.mjs';
import { rejects } from 'assert';

export const cdUp = (currentPath) => path.parse(currentPath).dir;

export const cd = async (currentPath, toPath) => {
  toPath.replaceAll('"', '');
  const newPath = path.join(currentPath, toPath);
  return await new Promise((resolve) => { 
    fs.stat(newPath, (err, stat) => {
      if (err || !stat.isDirectory()) {
        resolve([ currentPath, `${COL_RED}wrong path!${COL_RESET}\n` ]) 
      }
      resolve([ newPath, '' ])
    });
  });
}