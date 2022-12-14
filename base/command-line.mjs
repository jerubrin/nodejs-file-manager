import { stdin, stdout } from 'process';
import readline from 'readline';
import { cd, cdUp, ls } from "../fs/chdir.mjs";
import { getStartPath, osCmd } from "../os/os.mjs";
import { add } from '../rw/add-file.mjs';
import { cp } from '../rw/copy.mjs';
import { mv } from '../rw/move.mjs';
import { cat } from '../rw/read-file.mjs';
import { rm } from '../rw/remove.mjs';
import { rn } from '../rw/rename.mjs';
import { COL_MAGENTA, COL_RED, COL_RESET } from "./color.mjs";

let currentPath = null
const INVALID_IN = `${COL_RED}Invalid input${COL_RESET}\n`;
const rl = readline.createInterface(stdin, stdout)

const getResult = async (command) => {
  const argsArr = command.trim().split(' ').filter(param => param);

  if (!argsArr.length) return '';
  if((argsArr.length == 1)) {
    if (argsArr[0] == '.exit') { process.exit(0); }
    if (argsArr[0] == 'ls') { return ls(currentPath); }
    if (argsArr[0] == 'up') { return currentPath = cdUp(currentPath); }
  }
  if (argsArr[0] == 'cd') {
    return currentPath = await cd(currentPath, argsArr.slice(1).join(' '));
  }
  if (argsArr[0] == 'cat') {
    return await cat(currentPath, argsArr.slice(1).join(' '));
  }
  if (argsArr[0] == 'add') {
    return await add(currentPath, argsArr.slice(1).join(' '));
  }
  if (argsArr[0] == 'rn') {
    return await rn(currentPath, argsArr.slice(1).join(' '));
  }
  if (argsArr[0] == 'cp') {
    return await cp(currentPath, argsArr.slice(1).join(' '));
  }
  if (argsArr[0] == 'mv') {
    return await mv(currentPath, argsArr.slice(1).join(' '));
  }
  if (argsArr[0] == 'rm') {
    return await rm(currentPath, argsArr.slice(1).join(' '));
  }
  if (argsArr[0] == 'os') {
    return await osCmd(argsArr.slice(1).join(' '));
  }

  return stdout.write(INVALID_IN);
}

const showPath = () => {
  if (!currentPath) {
    currentPath = getStartPath();
  }
  rl.setPrompt(`You are currently in ${COL_MAGENTA}${currentPath}${COL_RESET} > `);
  rl.prompt();
}

const readCommands = async (chunk) => {
  try {
    const command = chunk.toString();
    await getResult(command);
    showPath();
  } catch (e) {
    // process.stdout.write(e.message + EOL);
    console.error(INVALID_IN);
    showPath();
  }
}

showPath()
rl.on('line', readCommands);
