import { Command } from 'commander';
import inquirer from 'inquirer';
import {
  chooseFileFromFileSystemAnd,
  showFilesChooser,
  showFilesChooserAnd,
} from './cli';
import {
  gitStatus,
  gitAdd,
  gitReset,
  gitStash,
  gitDiff,
  gitMv,
  gitWorktreeList,
  gitWorktreeAdd,
  gitWorktreeRemove,
} from './git';
import { openInEditor } from './exec';

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
  const status = (await gitStatus()).filter((file) => !file.deleted);
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

export const rename = withErrorHandler(async () => {
  const { path, newName } = await chooseFileFromFileSystemAnd({
    type: 'input',
    name: 'newName',
    message: 'New name (Can has a different extension)',
    validate: (name) => (name.length ? true : 'Hello.. new name? 🙄'),
  });
  await gitMv(path, newName);
});

export const worktreeAdd = withErrorHandler(async () => {
  const { worktreePath, branch } = await inquirer.prompt<{
    worktreePath: string;
    branch: string;
  }>([
    {
      type: 'input',
      name: 'worktreePath',
      message: 'Path for the new worktree',
      validate: (input: string) =>
        input.trim().length ? true : 'Please enter a valid path 🙄',
    },
    {
      type: 'input',
      name: 'branch',
      message: 'New branch name',
      validate: (input: string) =>
        input.trim().length ? true : 'Please enter a branch name 🙄',
    },
  ]);
  await gitWorktreeAdd(worktreePath, branch);
});

export const worktreeOpen = withErrorHandler(async () => {
  const worktrees = await gitWorktreeList();
  if (!worktrees.length) {
    console.log('\x1b[33m', 'No worktrees found 🤔');
    return;
  }
  const choices = worktrees.map((wt) => ({
    name: `${wt.branch} → ${wt.path}${wt.isMain ? ' (main)' : ''}`,
    value: wt.path,
  }));
  const { selectedPath } = await inquirer.prompt<{ selectedPath: string }>([
    {
      type: 'list',
      name: 'selectedPath',
      message: 'Select a worktree to open',
      choices,
    },
  ]);
  openInEditor(selectedPath);
});

export const worktreeDelete = withErrorHandler(async () => {
  const worktrees = (await gitWorktreeList()).filter((wt) => !wt.isMain);
  if (!worktrees.length) {
    console.log(
      '\x1b[33m',
      'No worktrees to delete (the main worktree cannot be deleted) 🤔'
    );
    return;
  }
  const choices = worktrees.map((wt) => ({
    name: `${wt.branch} → ${wt.path}`,
    value: wt.path,
  }));
  const { selectedPaths } = await inquirer.prompt<{ selectedPaths: string[] }>(
    [
      {
        type: 'checkbox',
        name: 'selectedPaths',
        message: 'Select worktrees to delete',
        choices,
        validate: (answer: string[]) =>
          answer.length >= 1
            ? true
            : 'Please select at least one worktree 🙄',
      },
    ]
  );
  for (const worktreePath of selectedPaths) {
    await gitWorktreeRemove(worktreePath);
  }
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
