import { cd, cdUp } from "../fs/chdir.mjs";
import { getStartPath } from "../os/os.mjs";
import { COL_MAGENTA, COL_RED, COL_RESET } from "./color.mjs";

let currentPath = null

const getResult = async (command) => {
  const argsArr = command.trim().split(' ').filter(param => param);

  if (!argsArr.length) return '';
  if (argsArr[0] == '.exit' && (argsArr.length == 1)) process.exit(0);
  if (argsArr[0] == 'up' && (argsArr.length == 1)) {
    currentPath = cdUp(currentPath);
    return '';
  }
  if (argsArr[0] == 'cd' && (argsArr.length == 2)) {
    const [ newPath, message ] = await cd(currentPath, argsArr.slice(1).join(' '));
    currentPath = newPath;
    return message;
  }

  return `${COL_RED}Invalid input${COL_RESET}\n`;
}

const showPath = () => {
  if (!currentPath) {
    currentPath = getStartPath();
  }
  process.stdout.write(`You are currently in ${COL_MAGENTA}${currentPath}${COL_RESET} > `);
}

const readCommands = async (chunk) => {
  const command = chunk.toString();
  process.stdout.write(
    await getResult(command)
  )
  showPath()
}

showPath()
process.stdin.on('data', readCommands);