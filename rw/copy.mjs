import { createReadStream, createWriteStream } from 'fs';
import fsPromises from 'fs/promises'
import path from 'path';
import { BG_RED, COL_GREEN, COL_RED, COL_RESET } from '../base/color.mjs';
import { exists, existsDir, getAbsolutePath, getPathesFromArgs } from '../base/utils.mjs';

export const cp = async (currentPath, args) => {
  try {
    const {fromPath: fromPathArg, toPath: toPathArg} = getPathesFromArgs(args);
    const fromPath = getAbsolutePath(currentPath, fromPathArg);
    const toPath = getAbsolutePath(currentPath, toPathArg);
    
    const hasFromFile = await exists(fromPath);
    
    if(!hasFromFile) throw new Error('File not found!');
  
    await copyByPath(fromPath, toPath)
    console.log(`${COL_GREEN}Done!${COL_RESET}`)
  } catch (e) {
    console.error(`${COL_RED}Can't copy file: ${BG_RED}${e.message}${COL_RESET}`);
  }
};

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
  console.log(pathFromFile, pathToFile);
  createReadStream(pathFromFile).pipe(
    createWriteStream(pathToFile)
  )
}

const copyDir = async (fromPath, toPath) => {
  const ls = await fsPromises.readdir(fromPath)
  for(let file of ls) {
    const pathFromFile = path.join(fromPath, file)
    const pathToFile = path.join(toPath, file)
    const fileStat = await fsPromises.stat(pathFromFile)
    if(fileStat.isFile()) {
      copyFile(pathFromFile, pathToFile)
    }
    if(fileStat.isDirectory()) {
      copyDir(pathFromFile, pathToFile)
    }
  }
}

const copyByPath = async (fromPath, toPath) => {
  const isDirectory = (await fsPromises.stat(fromPath)).isDirectory()
  if(isDirectory) {
    await checkForExists(toPath);
    await copyDir(fromPath, toPath);
  } else {
    await checkForExists(toPath);
    const fileName = path.parse(fromPath).base;
    const toPathFile = path.join(toPath, fileName);
    await copyFile(fromPath, toPathFile);
  }
}