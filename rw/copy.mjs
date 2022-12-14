import { createReadStream, createWriteStream } from 'fs';
import fsPromises from 'fs/promises'
import path from 'path';
import { BG_RED, COL_GREEN, COL_RED, COL_RESET } from '../base/color.mjs';
import { exists, existsDir, getAbsolutePath, getPathesFromArgs, isSubDir } from '../base/utils.mjs';

export const cp = async (currentPath, args) => {
  try {
    const {fromPath: fromPathArg, toPath: toPathArg} = getPathesFromArgs(args);
    const fromPath = getAbsolutePath(currentPath, fromPathArg);
    const toPath = getAbsolutePath(currentPath, toPathArg);
    
    const hasFromFile = await exists(fromPath);
    
    if(!hasFromFile) throw new Error('File not found!');
    
    const hasSubDir = isSubDir(path.resolve(fromPath), path.resolve(toPath))
    if (hasSubDir) throw new Error(`Denied moving or copying directories into subdirectories`)
  
    await copyByPath(fromPath, toPath);
    console.log(`${COL_GREEN}Done!${COL_RESET}`);
    return {fromPath, toPath};
  } catch (e) {
    console.error(`${COL_RED}Can't copy file: ${BG_RED}${e.message}${COL_RESET}`);
    return false;
  }
};

const checkForInfinityCopy = (fromPath, toPath) =>
  fromPath == path.parse(toPath).dir
  && path.parse(fromPath).base == path.parse(toPath).base

const checkForExists = async (toPath) => {
  const isDirectoryExists = await existsDir(toPath)
  if (isDirectoryExists) return
  try {
    await fsPromises.mkdir(toPath, {recursive: true})
  } catch {
    throw Error(`Can't create new directory`)
  }
}

const copyFile  = async (pathFromFile, pathToFile) => {
  try {
    await new Promise((resolve, reject) => {
      const rs = createReadStream(pathFromFile);
      const ws = createWriteStream(pathToFile)
      rs.on('error', err => { reject(err) });
      ws.on('error', err => { reject(err) });
      rs.pipe(ws);
      ws.on('unpipe', () => resolve());
    })
  } catch(err) {
    throw new Error(err) ;
  };
}

const copyDir = async (fromPath, toPath) => {
  const ls = await fsPromises.readdir(fromPath)
  await checkForExists(toPath);
  if (checkForInfinityCopy(fromPath, toPath)) return;
  for(let file of ls) {
    const pathFromFile = path.join(fromPath, file)
    const pathToFile = path.join(toPath, file)
    const fileStat = await fsPromises.stat(pathFromFile)
    if(fileStat.isFile()) {
      await copyFile(pathFromFile, pathToFile)
    }
    if(fileStat.isDirectory()) {
      await checkForExists(pathToFile);
      await copyDir(pathFromFile, pathToFile);
    }
  }
}

const copyByPath = async (fromPath, toPath) => {
  const isDirectory = (await fsPromises.stat(fromPath)).isDirectory()
  
  await checkForExists(toPath);
  const fileName = path.parse(fromPath).base;
  const toPathFile = path.join(toPath, fileName);
  
  if(isDirectory) {
    await copyDir(fromPath, toPathFile);
  } else {
    await copyFile(fromPath, toPathFile);
  }
}