import { program } from 'commander';
import { add, reset } from './wiz';
// import { version } from '../../package.json';

export function init() {
  try {
    program.version('1.2.4');

    program
      .command('add')
      .description('do "git add" with more fun 🌈')
      .action(add);

    program
      .command('reset')
      .description('do "git reset" with more fun 🦄')
      .action(reset);

    program.parse(process.argv);
  } catch (error) {
    console.log(error);
  }
}
