import { execCommand } from './exec';

type File = {
  status: 'tracked' | 'staged' | 'untracked';
  path: string;
};

async function runCommand(command: string, files: Array<string>, stdio = false) {
  const gitCommand = `${command} ${files.join(' ')}`;
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
    .reduce((prev, line) => {
      const [index, ...params] = line.split(/ +/g);
      const path = params[params.length - 1];

      if (index === '1') {
        const [stagedIndication, changedIndication] = params[0].split('');
        if (stagedIndication !== '.') {
          prev.push({
            status: 'staged',
            path,
          });
        }
        if (changedIndication !== '.') {
          prev.push({
            status: 'tracked',
            path,
          });
        }
      } else if (index === '?') {
        prev.push({
          status: 'untracked',
          path,
        });
      }
      return prev;
    }, []);

  return files;
}

export async function getAllChanges() {
  const status = (await gitStatus());
  if (!status.length) {
    console.log('\x1b[33m', 'There are no changes here. Get back to work 🤓');
    return;
  }
  return status.map((file) => file.path);
}

export async function gitAdd(files: Array<string>) {
  await runCommand('add', files);
}

export async function gitReset(files: Array<string>) {
  await runCommand('reset HEAD --', files);
}

export async function gitStash(files: Array<string>, message?: string) {
  await gitAdd(files);
  await runCommand(`stash push${message ? ` -m ${message}` : ''}`, files);
}

export function gitDiff(files: Array<string>) {
  return runCommand('diff', files, true);
}
