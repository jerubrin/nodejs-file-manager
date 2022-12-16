import fsPromises from 'fs/promises'
import path from 'path';
import { BG_RED, COL_GREEN, COL_RED, COL_RESET } from '../base/color.mjs';
import { exists, getAbsolutePath, getPathesFromArgs } from "../base/utils.mjs";

export const rn = async (currentPath, args) => {
  try {
    const {fromPath: fromPathArg, toPath: toPathArg} = getPathesFromArgs(args);
    const fromPath = getAbsolutePath(currentPath, fromPathArg);
    const toPath = getAbsolutePath(path.parse(fromPath).dir, toPathArg);
    
    const hasFromFile = await exists(fromPath);
    const hasToFile = await exists(toPath);
    
    if(!hasFromFile) throw new Error('File not found!');
    if(hasToFile) throw new Error('File name is alredy exists!');
  
    await fsPromises.rename(fromPath, toPath);
    console.log(`${COL_GREEN}Done!${COL_RESET}`)
  } catch (e) {
    console.error(`${COL_RED}Can't rename file: ${BG_RED}${e.message}${COL_RESET}`);
  }
};