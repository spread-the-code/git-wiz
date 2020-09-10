const { showFilesChooser } = require('./cli');
const { gitStatus, gitAdd, gitReset } = require('./git');

async function add() {
  try {
    const status = (await gitStatus()).filter(
      (file) => file.status !== 'staged'
    );
    if (!status.length) {
      console.log('\x1b[33m', 'There are no changes here. Get back to work 🤓');
      return;
    }
    const choices = status.map((file) => file.path);
    const files = await showFilesChooser(choices);
    await gitAdd(files);
  } catch (err) {
    console.log('\x1b[31m', 'Oops, something went wrong', err);
  }
}

async function reset() {
  try {
    const status = (await gitStatus()).filter(
      (file) => file.status === 'staged'
    );
    if (!status.length) {
      console.log(
        '\x1b[33m',
        'There are no files in stage. You have nothing to regret about 🦾'
      );
      return;
    }
    const choices = status.map((file) => file.path);
    const files = await showFilesChooser(choices);
    await gitReset(files);
  } catch (err) {
    console.log('\x1b[31m', 'Oops, something went wrong', err);
  }
}

exports.add = add;
exports.reset = reset;
