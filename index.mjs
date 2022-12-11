import cp from 'child_process'
import console from 'console';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { parseArgs } from "./base/args.mjs"
import { COL_BLUE, COL_RESET, COL_YELLOW } from "./base/color.mjs";

const data = {}
const cmd = path.join(__dirname, 'base', 'command-line.mjs');

const start = async () => {
  data.username = parseArgs().username;
  console.log(`${COL_BLUE}Welcome to the File Manager, ${COL_YELLOW}${data.username}${COL_BLUE}!${COL_RESET}`);
  const cmdProcess = cp.spawn('node', [cmd]);
  cmdProcess.stdout.pipe(process.stdin);
  process.stdout.pipe(cmdProcess.stdin);
  cmdProcess.on('close', () => {
    console.log(`${COL_BLUE}Thank you for using File Manager, ${COL_YELLOW}${data.username}${COL_BLUE}, goodbye!${COL_RESET}`)
    process.exit()
  });
}

start()