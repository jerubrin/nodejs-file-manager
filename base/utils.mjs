import fs from 'fs'
import path from 'path';

export const removeBrakets = (toPath) => toPath.replaceAll('"', '').replaceAll(`'`, '');

export const existsDir = async (fullPath) => await exists(fullPath, true);

export const existsFile = async (fullPath) => await exists(fullPath, false, true);

export const exists = async (fullPath, checkDir = false, checkFile = false) => new Promise((resolve) => { 
  fs.stat(fullPath, (err, stat) => {
    if ( err || (checkDir && !stat.isDirectory()) || (checkFile && !stat.isFile()) ) {
      resolve(false);
    }
    resolve(true);
  });
});

export const isQuote = (char) => (/['"`]/).test(char)

export const getPathesFromArgs = (args) => {
  const argsSplit = args.trim().split(' ')
  if (argsSplit.length < 2) throw Error('wrong params');
  if (argsSplit.length == 2) {
    return {fromPath: argsSplit[0].replaceAll(/['"`]/g, ''), toPath: argsSplit[1].replaceAll(/['"`]/g, '')}
  }
  let fromPath = '';
  let toPath = '';
  let isFirst = true;
  args.split(/['"`]/).forEach(str => {
    if (str[0] == ' ') {
      isFirst = false;
    }
    if (isFirst) {
      fromPath += str.trim();
    } else {
      toPath += str.trim();
    }
    if (str.at(-1) == ' ') {
      isFirst = false;
    }
  });
  return {fromPath, toPath};
}

export const getAbsolutePath = (curentPath, toPath) => path.isAbsolute(toPath) ? toPath : path.join(curentPath, toPath);

export const isSubDir = (dir, subDir) => {
  if (path.dirname(subDir) == dir) return subDir;
  if (path.dirname(subDir) == path.parse(subDir).root) return false;
  return isSubDir(dir, path.dirname(subDir))
}