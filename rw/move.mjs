import fsPromises from 'fs/promises';
import { BG_RED, COL_RED, COL_RESET } from '../base/color.mjs';
import { cp } from "./copy.mjs";

const mv = async (currentPath, args) => {
  try {
    const res = await cp(currentPath, args);
    if (res) {
      fsPromises.rm(res.fromPath, {force: true, recursive: true});
    }
  } catch(err) {
    console.error(`${COL_RED}Can't move file or directory: ${BG_RED}${err.message}${COL_RESET}`);
  }
}