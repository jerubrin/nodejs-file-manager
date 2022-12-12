import { createReadStream } from 'fs'
import path, { resolve } from 'path';
import { BG_RED, COL_MAGENTA, COL_RED, COL_RESET } from '../base/color.mjs';
import { removeBrakets } from '../base/utils.mjs'

export const cat = async (currentPath, file) => new Promise(resolve => {
  file = removeBrakets(file);
  const filePath = path.isAbsolute(file)
    ? file
    : path.join(currentPath, file)
  try {
    let data = ''
    const rs = createReadStream(filePath, 'utf-8');

    rs.on('error', () => {
      console.error(`${COL_RED}Can't read file ${BG_RED}"${filePath}"${COL_RESET}${COL_RED}!${COL_RESET}`);
      resolve();
    });
    rs.on('data', chunk => data += chunk );
    rs.on('end', () => {
      console.log(data);
      resolve();
    });
  } catch(e) {
    console.error(`${COL_RED}Can't read file "${COL_MAGENTA}${filePath}${COL_RESET}${COL_RED}"!${COL_RESET}`);
    resolve();
  }
});