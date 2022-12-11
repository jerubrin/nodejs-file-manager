import cp from 'child_process'
import console from 'console';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { EOL } from 'os'

import { parseArgs } from "./base/args.mjs"
import { COL_BLUE, COL_RESET, COL_YELLOW } from "./base/color.mjs";

const data = {};
let isRunning = true;
const cmd = path.join(__dirname, 'base', 'command-line.mjs');

const showExitMessage = () => {
  if(isRunning) {
    console.log(`${EOL}${COL_BLUE}Thank you for using File Manager, ${COL_YELLOW}${data.username}${COL_BLUE}, goodbye!${COL_RESET}`)
    isRunning = false;
  }
}

const start = async () => {
  data.username = parseArgs().username;
  console.log(`${COL_BLUE}Welcome to the File Manager, ${COL_YELLOW}${data.username}${COL_BLUE}!${COL_RESET}`);
  const cmdProcess = cp.fork(cmd);
  // cmdProcess.stdout.pipe(process.stdin);
  // process.stdout.pipe(cmdProcess.stdin);
  cmdProcess.on('close', () => process.exit());
  process.on('exit', showExitMessage);
  process.on('SIGINT', () => showExitMessage(true));
}

start()