// @ts-check
const inquirer = require('inquirer');
/**
 * @param {Array<string>} choices
 */
async function showFilesChooser(choices) {
  const answer = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'files',
      message: 'What to add?',
      choices,
      /**
       * @param {string} answer
       */
      validate: (answer) => {
        if (answer.length < 1) {
          return 'Are you tricking me 🤨? Please choose files to add';
        }
        return true;
      },
    },
  ]);

  return answer.files;
}

exports.showFilesChooser = showFilesChooser;