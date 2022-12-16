import path from 'path';
import { getAbsolutePath, removeBrakets } from '../base/utils.mjs';
import { createWriteStream } from 'fs';
import { BG_GREEN, BG_RED, COL_GREEN, COL_RED, COL_RESET } from '../base/color.mjs';

export const add = async (currentPath, file) => new Promise((res) => {
  file = removeBrakets(file);
  const pathToFile = getAbsolutePath(currentPath, file);
  
  try {
    const ws = createWriteStream(pathToFile, {flags: 'ax'});
    ws.on('error', () => {
      console.log(`${COL_RED}Operation failed: Can't create file ${BG_RED}"${pathToFile}"${COL_RESET}${COL_RED}!${COL_RESET}`);
      res();
    });
    ws.write('', 'utf-8', (err) => {
      if(!err) {
        console.log(`${COL_GREEN}File ${BG_GREEN}"${pathToFile}"${COL_RESET}${COL_GREEN} has been created${COL_RESET}`);
        res();
      }
    });
  } catch {
    console.log(`${COL_RED}Operation failed: Can't create file ${BG_RED}"${pathToFile}"${COL_RESET}${COL_RED}!${COL_RESET}`);
    res();
  }
})