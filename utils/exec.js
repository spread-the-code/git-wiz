//@ts-check
const cp = require('child_process');
/**
 * @param {string} command
 * @returns {Promise<string>}
 */
function execCommand(command) {
  return new Promise((resolve, reject) =>
    cp.exec(
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

exports.execCommand = execCommand;
