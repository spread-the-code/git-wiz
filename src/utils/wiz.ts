import { showFilesChooser, showFilesChooserAnd } from './cli';
import { gitStatus, gitAdd, gitReset, gitStash } from './git';

export const add = withErrorHandler(async () => {
  try {
    const status = (await gitStatus()).filter(
      (file) => file.status !== 'staged'
    );
    if (!status.length) {
      console.log('\x1b[33m', 'There are no changes here. Get back to work 🤓');
      return;
    }
    const choices = status.map((file) => file.path);
    const files = await showFilesChooser('Files to add', choices);
    await gitAdd(files);
  } catch (err) {
    console.log('\x1b[31m', 'Oops, something went wrong', err);
  }
});

export const reset = withErrorHandler(async () => {
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
    const files = await showFilesChooser('Files to reset?', choices);
    await gitReset(files);
  } catch (err) {
    console.log('\x1b[31m', 'Oops, something went wrong', err);
  }
});

export const stash = withErrorHandler(async () => {
  const status = (await gitStatus());
  if (!status.length) {
    console.log('\x1b[33m', 'There are no changes here. Get back to work 🤓');
    return;
  }
  const choices = status.map((file) => file.path);
  const {files, message} = await showFilesChooserAnd('Files to stash', choices, {
    message: {
      type: 'input',
      message: 'Leave a message to your future self ("-m").. or not, whatever',
    }
  });

  await gitStash(files, message);
});

function withErrorHandler(fn: Function) {
  return (...args: any[]): Promise<void> => {
    try {
      return fn(...args);
    } catch (error) {
      console.log('\x1b[31m', 'Oops, something went wrong', error);
    }
  }
}