import path from 'path'
import fs from 'fs'
import { readdir, stat } from 'fs/promises'
import { COL_RED, COL_RESET } from '../base/color.mjs';
import { removeBrakets } from '../utils/utils.mjs';

export const cdUp = (currentPath) => path.parse(currentPath).dir;

export const cd = async (currentPath, toPath) => {
  toPath = removeBrakets(toPath)
  const newPath = path.isAbsolute(toPath)
    ? toPath
    : path.join(currentPath, toPath);
  return await new Promise((resolve) => { 
    fs.stat(newPath, (err, stat) => {
      if (err || !stat.isDirectory()) {
        resolve([ currentPath, `${COL_RED}Wrong path!${COL_RESET}\n` ]) 
      }
      resolve([ newPath, '' ])
    });
  });
}

export const ls = async (currentPath) => {
  const files = await readdir(currentPath)
  console.log('readdir')
  const fileList = [];
  const dirList = [];
  const otherList = [];
  for(let file of files) {
    const pathToFile = path.join(currentPath, file)
    try {
      const stats = await stat(pathToFile)
      if (file.length > 59) {
        file = file.substring(0, 58) + '…';
      }
    
      if(stats.isDirectory()) {
        dirList.push(file);
      } else {
        fileList.push(file);
      }
    } catch (_) {
      otherList.push(file);
    }
  }
  console.log();
  console.table( [
    ...dirList
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      .map((file) => ({Name: file, Type: 'directory'})),
    ...fileList
      .sort()
      .map((file) => ({Name: file, Type: 'file'})),
    ...otherList
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      .map((file) => ({Name: file, Type: 'unknown'})),
  ] );
  return '';
}