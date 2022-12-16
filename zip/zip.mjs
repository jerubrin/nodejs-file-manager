import path, { resolve } from 'path'
import fs from 'fs'
import zlib from 'zlib'
import { BG_GREEN, BG_RED, COL_GREEN, COL_RED, COL_RESET } from "../base/color.mjs";
import { existsFile, getAbsolutePath, getPathesFromArgs, isSubDir } from "../base/utils.mjs";

const compressDecompress = async (fromPath, toPath, isCompressing = true) =>
  new Promise(resolve => {
    const rs = fs.createReadStream(fromPath);
    const ws = fs.createWriteStream(toPath);
    const zipStream = isCompressing ? zlib.createBrotliCompress() :zlib.createBrotliDecompress()
    try {
        rs.pipe(zipStream).pipe(ws).on('error', err => {
          resolve(console.error(`${COL_RED}Operation failed: ${err.message}${COL_RESET}`));
        }).on('finish', () => {
          const message = isCompressing ? 'Compressed' : 'Decompressed'
          resolve(console.log(`${COL_GREEN}${message} to ${BG_GREEN}${toPath}${COL_RESET}`));
        });
    } catch (err) {
      resolve(console.error(`${COL_RED}Operation failed: ${err.message}${COL_RESET}`));
    }
  })

export const compress = async (currentPath, args) => {
  try {
    const {fromPath: fromPathArg, toPath: toPathArg} = getPathesFromArgs(args);
    const fromPath = getAbsolutePath(currentPath, fromPathArg);
    const toPath = path.join(
      getAbsolutePath(currentPath, toPathArg),
      path.parse(fromPath).base + '.bz'
    );
    
    const hasFromFile = await existsFile(fromPath);
    
    if(!hasFromFile) throw new Error('File not found!');
    
    const hasSubDir = isSubDir(path.resolve(fromPath), path.resolve(toPath))
    if (hasSubDir) throw new Error(`Denied compressing directories into subdirectories`)
  
    //compress
    await compressDecompress(fromPath, toPath, true)

    return {fromPath, toPath};
  } catch (e) {
    console.error(`${COL_RED}Operation failed: Can't compress file ${BG_RED}${e.message}${COL_RESET}`);
    return false;
  }
}

export const decompress = async (currentPath, args) => {
  try {
    const {fromPath: fromPathArg, toPath: toPathArg} = getPathesFromArgs(args);
    const fromPath = getAbsolutePath(currentPath, fromPathArg);
    const toPath = path.join(
      getAbsolutePath(currentPath, toPathArg),
      path.parse(fromPath).name
    );

    const hasFromFile = await existsFile(fromPath);
    
    if(!hasFromFile) throw new Error('File not found!');
    
    //decompress
    await compressDecompress(fromPath, toPath, false)

    return {fromPath, toPath};
  } catch (e) {
    console.error(`${COL_RED}Operation failed: Can't decompress file ${BG_RED}${e.message}${COL_RESET}`);
    return false;
  }
}