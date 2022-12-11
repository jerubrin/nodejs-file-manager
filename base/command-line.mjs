import { stdin, stdout } from 'process';
import readline from 'readline';
import { cd, cdUp, ls } from "../fs/chdir.mjs";
import { getStartPath } from "../os/os.mjs";
import { COL_MAGENTA, COL_RED, COL_RESET } from "./color.mjs";

let currentPath = null
const INVALID_IN = `${COL_RED}Invalid input${COL_RESET}\n`;
const rl = readline.createInterface(stdin, stdout)

const getResult = async (command) => {
  const argsArr = command.trim().split(' ').filter(param => param);

  if (!argsArr.length) return '';
  if (argsArr[0] == '.exit' && (argsArr.length == 1)) process.exit(0);
  if (argsArr[0] == 'ls' && (argsArr.length == 1)) {
    return await ls(currentPath);
  }
  if (argsArr[0] == 'up' && (argsArr.length == 1)) {
    currentPath = cdUp(currentPath);
    return '';
  }
  if (argsArr[0] == 'cd') {
    const [ newPath, message ] = await cd(currentPath, argsArr.slice(1).join(' '));
    currentPath = newPath;
    return message;
  }
  if (argsArr[0] == 'cat') {
    currentPath = await cat(currentPath, argsArr.slice(1).join(' '));
    return '';
  }

  return INVALID_IN;
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
    process.stdout.write(
      await getResult(command)
    )
    showPath();
  } catch (e) {
    process.stdout.write(INVALID_IN);
  }
}

showPath()
rl.on('line', readCommands);
