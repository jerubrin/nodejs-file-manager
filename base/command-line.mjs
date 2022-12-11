import { COL_RED, COL_RESET } from "./color.mjs";

const getResult = (command) => {
  if (command.trim() == '.exit') process.exit(0);

  return `${COL_RED}Invalid input${COL_RESET}`;
}

const readCommands = async (chunk) => {
  const command = chunk.toString();
  console.log(
    getResult(command)
  )
}

process.stdin.on('data', readCommands);