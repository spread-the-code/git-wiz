#! /usr/bin/env node

// @ts-check
const { showFilesChooser } = require('../utils/cli');
const { gitStatus, gitAdd } = require('../utils/git');

(async () => {
  try {
    const status = await gitStatus();
    if (!status.length) {
      console.log('\x1b[33m', 'There are no changes here. Get back to work 🤓')
      return;
    }
    const choices = status.map((file) => file.path);
    const files = await showFilesChooser(choices);
    await gitAdd(files);
  } catch (err) {
    console.log('\x1b[31m', 'Oops, something went wrong', err);
  }
})();
