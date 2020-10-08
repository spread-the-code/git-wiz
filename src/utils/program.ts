import { program } from 'commander';
import { add, diff, rename, reset, stash } from './wiz';
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
      .allowUnknownOption()
      .description(
        'do "git diff" with style 🤔 (Accept any argument "git diff" accpets)'
      )
      .action(diff);

    program
      .command('rename <path> <newName>')
      .description(
        'do "git mv" (for renaming) with style 🔖'
      )
      .action(rename);

    program.parse(process.argv);
  } catch (error) {
    console.log(error);
  }
}
