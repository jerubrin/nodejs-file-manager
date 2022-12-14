import path from 'path'
import { readdir, stat } from 'fs/promises'
import { existsDir, getAbsolutePath, removeBrakets } from '../base/utils.mjs';
import { stdout } from 'process';
import { EOL } from 'os';
import { COL_RED, COL_RESET } from '../base/color.mjs';

export const cdUp = (currentPath) => path.parse(currentPath).dir;

export const cd = async (currentPath, toPath) => {
  toPath = removeBrakets(toPath)
  const newPath = getAbsolutePath(currentPath, toPath);
  
  const isCorrect = await existsDir(newPath)
  if(!isCorrect) {
    console.error(`${COL_RED}Wrong path!${COL_RESET}`);
    return currentPath;
  }
  return newPath;
}

export const ls = async (currentPath) => {
  const files = await readdir(currentPath)
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
  stdout.write(EOL)
}