#! /usr/bin/env node

const simpleGit = require('simple-git');
const inquirer = require('inquirer');
const cp = require('child_process');

const git = simpleGit();

async function showFilesChooser(choices) {
  const answer = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'files',
      message: 'What to add?',
      choices,
      validate: function (answer) {
        if (answer.length < 1) {
          return 'Are you tricking me 🤨? Please choose files to add';
        }
        return true;
      },
    },
  ]);

  return answer.files;
}

(async () => {
  const status = await git.status();
  const choices = status.files.map((file) => file.path);

  const files = await showFilesChooser(choices);
  const command = `git add ${files.join(' ')}`;

  try {
    cp.execSync(command, {
      cwd: process.cwd(),
      encoding: 'utf-8',
      stdio: 'inherit',
    });
    console.log('\x1b[0m', `"${command}"`, '\x1b[32m', 'did great 🤟');
  } catch (err) {
    console.log('\x1b[31m', 'Oops, something went wrong', err);
  }
})();
