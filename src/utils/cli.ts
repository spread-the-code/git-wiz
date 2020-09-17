import inquirer from 'inquirer';

export async function showFilesChooser(choices: Array<string>) {
  const answer = await inquirer.prompt<{
    files: Array<string>
  }>([
    {
      type: 'checkbox',
      name: 'files',
      message: 'What to add?',
      choices,
      validate: (answer: string) => {
        if (answer.length < 1) {
          return 'Are you tricking me 🤨? Please choose files to add';
        }
        return true;
      },
    },
  ]);

  return answer.files;
}
