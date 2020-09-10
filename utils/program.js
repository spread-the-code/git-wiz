const { program } = require('commander');
const { add, reset } = require('./wiz');
const { version } = require('../package.json');

function init() {
  try {
    program.version(version);

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

exports.init = init;
