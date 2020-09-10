//@ts-check
const { execCommand } = require('../utils/exec');

/**
 * @typedef {{
 *  status: 'tracked' | 'staged' | 'untracked'
 *  path: string
 * }} File
 * @returns {Promise<Array<File>>}
 */
async function gitStatus() {
  const status = await execCommand('git status --porcelain=v2 -uall');
  /**
   * @type Array<File>
   */
  const initialFiles = [];
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
            path
          });
        }
        if (changedIndication !== '.') {
          prev.push({
            status: 'tracked',
            path
          });
        }
      } else if (index === '?') {
        prev.push({
          status: 'untracked',
          path
        });
      }
      return prev;
    }, initialFiles);

  return files;
}

/**
 * @param {string} command
 * @param {Array<string>} files
 */
async function runCommand(command, files) {
  const gitCommand = `git ${command} ${files.join(' ')}`;
  await execCommand(gitCommand);
  console.log('\x1b[0m', `"${gitCommand}"`, '\x1b[32m', 'did great 🤟');
}

/**
 * @param {Array<string>} files
 */
async function gitAdd(files) {
  await runCommand('add', files);
}

/**
 * @param {Array<string>} files
 */
async function gitReset(files) {
  await runCommand('reset HEAD -- ', files);
}

exports.gitAdd = gitAdd;
exports.gitReset = gitReset;
exports.gitStatus = gitStatus;
