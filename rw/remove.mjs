import fsPromises from 'fs/promises'
import { BG_GREEN, BG_RED, COL_GREEN, COL_RED, COL_RESET } from "../base/color.mjs";
import { getAbsolutePath, removeBrakets } from '../base/utils.mjs';


export const rm = async (currentPath, file) => {
  file = removeBrakets(file);
  const filePath = getAbsolutePath(currentPath, file);
  try {
    await fsPromises.rm(filePath, {recursive: true});
    console.log(`${COL_GREEN}"${BG_GREEN}${filePath}${COL_RESET}${COL_GREEN}" has been removed!${COL_RESET}`)
  } catch (err) {
    console.error(err.message);
    console.error(`${COL_RED}Can't remove file or directory ${BG_RED}"${filePath}"${COL_RESET}${COL_RED}!${COL_RESET}`);
  }
}
