import path from 'path'
import { readdir, stat } from 'fs/promises'
import { exists, removeBrakets } from '../base/utils.mjs';
import { stdout } from 'process';
import { EOL } from 'os';

export const cdUp = (currentPath) => path.parse(currentPath).dir;

export const cd = async (currentPath, toPath) => {
  toPath = removeBrakets(toPath)
  const newPath = path.isAbsolute(toPath)
    ? toPath
    : path.join(currentPath, toPath);
  const [fullPath, message] = await exists(currentPath, newPath)
  if (message) { stdout.write(message); }
  return fullPath;
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