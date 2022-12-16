import { createHash } from 'crypto';
import { createReadStream } from 'fs'
import { BG_RED, COL_BLUE, COL_GREEN, COL_RED, COL_RESET } from "../base/color.mjs";
import { existsFile, getAbsolutePath, removeBrakets } from "../base/utils.mjs";

const getHash = async (filePath) => new Promise((resolve) => {
  let hashHex = ''
    const rs = createReadStream(filePath);
    const ws = createHash('sha256').setEncoding('hex');
    const hashStream = rs.pipe(ws);
    hashStream.on('data', chunk => hashHex += chunk );
    hashStream.on('end', () => { 
      console.log(`${COL_GREEN}Hash: ${COL_BLUE}${hashHex}${COL_RESET}`);
      resolve();
    });
    hashStream.on('error', err => 
    {
      console.error(`${COL_RED}Operation failed: ${err.message}${COL_RESET}`);
      resolve();
    });
});

export const hash = async (currentPath, args) => {
  try {
    const file = removeBrakets(args);
    const filePath = getAbsolutePath(currentPath, file);

    const isFile = await existsFile(filePath)
    if(!isFile) return console.error(`${COL_RED}Operation failed: Can't find file ${BG_RED}${filePath}${COL_RESET}`)

    await getHash(filePath)
  } catch (err) {
    console.error(`${COL_RED}Operation failed: ${err.message}${COL_RESET}`);
  }
};