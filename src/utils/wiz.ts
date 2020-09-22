import { Command } from 'commander';
import { showFilesChooser, showFilesChooserAnd } from './cli';
import { gitStatus, gitAdd, gitReset, gitStash, gitDiff } from './git';

export const add = withErrorHandler(async () => {
  const status = (await gitStatus()).filter((file) => file.status !== 'staged');
  if (!status.length) {
    console.log('\x1b[33m', 'There are no changes here. Get back to work 🤓');
    return;
  }
  const choices = status.map((file) => file.path);
  const files = await showFilesChooser('Files to add', choices);
  await gitAdd(files);
});

export const reset = withErrorHandler(async () => {
  const status = (await gitStatus()).filter((file) => file.status === 'staged');
  if (!status.length) {
    console.log(
      '\x1b[33m',
      'There are no files in stage. You have nothing to regret about 🦾'
    );
    return;
  }
  const choices = status.map((file) => file.path);
  const files = await showFilesChooser('Files to reset?', choices);
  await gitReset(files);
});

export const stash = withErrorHandler(async () => {
  const status = (await gitStatus()).filter(file => !file.deleted);
  if (!status.length) {
    console.log('\x1b[33m', 'Stash what exactly 🤥?');
    return;
  }
  const choices = status.map((file) => file.path);
  const { files, message } = await showFilesChooserAnd(
    'Files to stash',
    choices,
    {
      message: {
        type: 'input',
        message:
          'Leave a message to your future self ("-m").. or not, whatever',
      },
    }
  );

  await gitStash(files, message);
});

export const diff = withErrorHandler(async (comObj: Command) => {
  const cached = comObj.args.includes('--cached');
  const status = (await gitStatus()).filter(
    (file) =>
      !file.deleted &&
      (cached ? file.status === 'staged' : file.status !== 'staged')
  );

  if (!status.length) {
    console.log('\x1b[33m', `You can't view diff of.. nothing 🧐`);
    return;
  }
  const choices = status.map((file) => file.path);
  const files = await showFilesChooser('Files to diff', choices);

  await gitDiff(files, comObj.args);
});

function withErrorHandler(fn: Function) {
  return (...args: Array<unknown>): Promise<void> => {
    try {
      return fn(...args);
    } catch (error) {
      console.log('\x1b[31m', 'Oops, something went wrong', error);
    }
  };
}
