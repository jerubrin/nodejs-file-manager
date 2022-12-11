import { parseArgs } from "./base/args.mjs"
import { COL_BLUE, COL_RESET, COL_YELLOW } from "./base/color.mjs";

const data = {}

const start = async () => {
  data.username = parseArgs().username;
  console.log(`${COL_BLUE}Welcome to the File Manager, ${COL_YELLOW}${data.username}${COL_BLUE}!${COL_RESET}`);
}

start()