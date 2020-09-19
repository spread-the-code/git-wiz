import { program } from 'commander';
import { add, reset, stash } from './wiz';
import { version } from '../../package.json';

export function init() {
  try {
    program.version(version);

    program
      .command('add')
      .description('do "git add" with more fun 📥')
      .action(add);

    program
      .command('reset')
      .description('do "git reset" with more fun 🔙')
      .action(reset);

    program
      .command('stash')
      .description('do "git stash" with more fun 👜')
      .action(stash);

    program.parse(process.argv);
  } catch (error) {
    console.log(error);
  }
}
