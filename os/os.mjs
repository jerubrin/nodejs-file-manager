import os from 'os';
import { stdout } from 'process';
import { COL_BLUE, COL_GREEN, COL_RED, COL_RESET } from '../base/color.mjs';

export const getStartPath = () => os.homedir();

const osEOL = () => stdout.write( JSON.stringify(os.EOL) );

const osCpus = () => {
  stdout.write(COL_RESET);
  console.table( 
  os.cpus()
    .map((cpu, i) => ({
      index: (i + 1),
      "Model": cpu.model,
      "Clock Rate": cpu.speed / 1000 + ' GHz',
    }))
    .reduce((obj, {index, ...data}) => { obj[index] = data; return obj; }, {})
  );
}

const osHomeDir = () => stdout.write( getStartPath() );

const osUserName = () => stdout.write( os.userInfo().username );

const osArchitecture = () => stdout.write( os.arch() );

export const osCmd = async (args) => {
  stdout.write(COL_BLUE)
  switch (args.trim()) {
    case '--EOL': osEOL(); break;
    case '--cpus': osCpus(); break;
    case '--homedir': osHomeDir(); break;
    case '--username': osUserName(); break;
    case '--architecture': osArchitecture(); break;
    default: stdout.write(`${COL_RED}Invalid input: Wrong argument.${COL_RESET}`);
  }
  stdout.write(os.EOL + COL_RESET);
}