//@ts-check
const { execCommand } = require('../utils/exec');

async function gitStatus() {
  const status = await execCommand('git status --porcelain=v2 -uall');
  const files = status
    .split(/\n/g)
    .filter((line) => line)
    .reduce((prev, line) => {
      let status;
      const [index, ...params] = line.split(/ +/g);
      if (index === '1') {
        const [stagedIndication, changedIndication] = params[0].split('');
        if (changedIndication !== '.') {
          status = 'tracked';
        }
      } else if (index === '?') {
        status = 'untracked';
      }
      if (status) {
        prev.push({
          status,
          path: params[params.length - 1]
        })
      }
      return prev;
    }, []);

  return files;
}

/**
 * @param {Array<string>} files
 */
async function gitAdd(files) {
  const command = `git add ${files.join(' ')}`;
  await execCommand(command);
  console.log('\x1b[0m', `"${command}"`, '\x1b[32m', 'did great 🤟');
}

exports.gitAdd = gitAdd;
exports.gitStatus = gitStatus;
