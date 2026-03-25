import { execCommand } from './exec';
import { join, parse } from 'path';

type File = {
  status: 'tracked' | 'staged' | 'untracked';
  path: string;
  deleted?: boolean;
};

export type Worktree = {
  path: string;
  branch: string;
  isMain: boolean;
};

async function runCommand(
  command: string,
  files: Array<string>,
  args?: Array<string>,
  stdio = false
) {
  const gitCommand = `${command} ${[...(args || []), ...files].join(' ')}`;
  await execCommand(gitCommand, stdio);
  if (stdio) {
    return;
  }
  console.log('\x1b[0m', `"git ${gitCommand}"`, '\x1b[32m', 'did great 🤟');
}

export async function gitStatus(): Promise<Array<File>> {
  const status = await execCommand('status --porcelain=v2 -uall');
  const files = status
    .split(/\n/g)
    .filter((line) => line)
    .reduce<Array<File>>((prev, line) => {
      try {
        const [index, ...params] = line.split(/ +/g);
        const path = params[params.length - 1];

        if (index === '1') {
          const [stagedIndication, changedIndication] = params[0].split('');
          if (stagedIndication !== '.') {
            prev.push({
              status: 'staged',
              path,
              deleted: stagedIndication === 'D',
            });
          }
          if (changedIndication !== '.') {
            prev.push({
              status: 'tracked',
              path,
              deleted: changedIndication === 'D',
            });
          }
        } else if (index === '?') {
          prev.push({
            status: 'untracked',
            path,
          });
        }
      } catch (err) {
        console.log(line);
      }
      return prev;
    }, []);

  return files;
}

export async function gitAdd(files: Array<string>) {
  await runCommand('add', files);
}

export async function gitReset(files: Array<string>) {
  await runCommand('reset HEAD --', files);
}

export async function gitStash(files: Array<string>, message?: string) {
  await gitAdd(files);
  // sorry for the 'replace', the space conflicts with: https://github.com/spread-the-code/git-wiz/blob/134f7cb9053cc20edcb0b969848d39d836b0ce31/src/utils/exec.ts#L6
  await runCommand(
    `stash push${message ? ` -m ${message.replace(/ /g, '-')}` : ''}`,
    files
  );
}

export function gitDiff(files: Array<string>, flags: Array<string>) {
  return runCommand('diff', files, flags, true);
}

export function gitMv(path: string, newName: string) {
  const {dir, ext} = parse(path);
  const {name, ext: newExt} = parse(newName);
  const newPath = join(dir, `${name}${newExt || ext}`);
  return runCommand('mv', [], [path, newPath]);
}

export async function gitWorktreeList(): Promise<Array<Worktree>> {
  const output = await execCommand('worktree list --porcelain');
  const worktrees: Array<Worktree> = [];
  const blocks = output.trim().split('\n\n').filter((block) => block.trim());
  let isFirst = true;
  for (const block of blocks) {
    const lines = block.split('\n');
    const pathLine = lines.find((l) => l.startsWith('worktree '));
    const branchLine = lines.find((l) => l.startsWith('branch '));
    if (pathLine) {
      const worktreePath = pathLine.replace('worktree ', '');
      const branch = branchLine
        ? branchLine.replace('branch refs/heads/', '')
        : '(detached HEAD)';
      worktrees.push({ path: worktreePath, branch, isMain: isFirst });
      isFirst = false;
    }
  }
  return worktrees;
}

export async function gitWorktreeAdd(worktreePath: string, branch: string) {
  await runCommand('worktree add', [worktreePath], ['-b', branch]);
}

export async function gitWorktreeRemove(worktreePath: string) {
  await runCommand('worktree remove', [worktreePath]);
}
