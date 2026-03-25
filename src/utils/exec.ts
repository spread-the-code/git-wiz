import {exec, spawn, spawnSync} from 'child_process';

export function execCommand(command: string, stdio = false): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const result = spawnSync('git', command.split(' '), {
        cwd: process.cwd(),
        stdio: stdio ? 'inherit' : 'pipe',
        encoding: 'utf8'
      });
      resolve(result.stdout);
    } catch (err) {
      reject(err);
    }
  })
}

export function openInEditor(path: string): void {
  const editor = process.env.VISUAL || process.env.EDITOR || 'code';
  spawnSync(editor, [path], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
}
