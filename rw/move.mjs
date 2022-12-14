import fsPromises from 'fs/promises';
import path from 'path';
import { BG_RED, COL_RED, COL_RESET } from '../base/color.mjs';
import { cp } from "./copy.mjs";

const isSubDir = (dir, subDir) => {
  console.log(`dir: ${dir} subDir: ${path.dirname(subDir)}`)
  if (path.dirname(subDir) == dir) return subDir;
  if (path.dirname(subDir) == path.parse(subDir).root) return false;
  return isSubDir(dir, path.dirname(subDir))
}

export const mv = async (currentPath, args) => {
  try {
    const res = await cp(currentPath, args);
    if (res) {
      if (path.resolve(res.fromPath) == path.resolve(res.toPath)) return;
      const subDir = isSubDir(path.resolve(res.fromPath), path.resolve(res.toPath));
      console.log(subDir);
      if (subDir)  {
        const ls = await fsPromises.readdir(res.fromPath)
        for(let file of ls) {
          const pathFile = path.join(res.fromPath, file)
          if(subDir != pathFile) {
            await fsPromises.rm(pathFile, {force: true, recursive: true});
          }
        }
      } else {
        await fsPromises.rm(res.fromPath, {force: true, recursive: true});
      }
    }
  } catch(err) {
    console.error(`${COL_RED}Can't move file or directory: ${BG_RED}${err.message}${COL_RESET}`);
  }
}