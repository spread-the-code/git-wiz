import { program } from 'commander';
import { add, diff, reset, stash } from './wiz';
import { version } from '../../package.json';

export function init() {
  try {
    program.version(version);

    program
      .command('add')
      .description('do "git add" with style 📥')
      .action(add);

    program
      .command('reset')
      .description('do "git reset" with style 🔙')
      .action(reset);

    program
      .command('stash')
      .description('do "git stash" with style 👜')
      .action(stash);

    program
      .command('diff')
      .description('do "git diff" with style 🤔')
      .action(diff);

    program.parse(process.argv);
  } catch (error) {
    console.log(error);
  }
}
