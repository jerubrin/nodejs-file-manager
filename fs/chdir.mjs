import path from 'path'
import { existsDir, getAbsolutePath, removeBrakets } from '../base/utils.mjs';

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
