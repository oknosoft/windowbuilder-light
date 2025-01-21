'use strict';


// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const path = require('path');
const fs = require('fs-extra');
const appBuild = path.resolve(__dirname, '../build');

const packageData = require('../package.json');
const moment = require('moment');
const build = JSON.stringify({
  build: `v${packageData.version} (${packageData.dependencies['metadata-core']}), ${moment().format()}`,
  stamp: Date.now(),
});
//fs.remove(appBuild + '/dynamic-settings.js');
fs.writeFile(path.resolve(appBuild + '/build.json').replace(/\\/g, '/'), build, 'utf8', function (err) {
  if(err) {
    console.log(err);
    process.exit(1);
  }
  else {
    console.log('Write build.json...');
  }
});
