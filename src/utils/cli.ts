import inquirer, { Question } from 'inquirer';

export async function showFilesChooser(
  message: string,
  choices: Array<string>
) {
  const { files } = await showFilesChooserAnd(message, choices, {});
  return files;
}

export async function showFilesChooserAnd<
  T extends Record<string, Question>,
  U extends { [key in keyof T]: T[key] },
  Z extends { files: Array<string> } & U
>(message: string, choices: Array<string>, additionalQuestions: T): Promise<Z> {
  const additionalQuestionsArray: Array<Question> = Object.entries(
    additionalQuestions
  ).map(([name, question]) => ({
    name,
    ...question,
  }));

  return inquirer.prompt<Z>([
    {
      type: 'checkbox',
      name: 'files',
      message,
      choices,
      validate: (answer: string) => {
        if (answer.length < 1) {
          return 'Are you tricking me 🤨? Please choose files to add';
        }
        return true;
      },
    },
    ...additionalQuestionsArray,
  ]);
}
