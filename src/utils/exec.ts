import {exec} from 'child_process';

export function execCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) =>
    exec(
      command,
      {
        cwd: process.cwd(),
        encoding: 'utf8',
      },
      (err, stdout, stderr) => {
        if (err) {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      }
    )
  );
}
