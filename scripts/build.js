'use strict';

const path = require('node:path');
const fs = require('fs-extra');
const webpack = require('webpack');
const config = require('../config/webpack.prod');
const appBuild = path.resolve(__dirname, '../build');

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

function rimraf(tmpPath) {
  console.log('Чистим каталог build...');
  //return Promise.resolve();
  return new Promise((resolve, reject) => {
    fs.readdir(tmpPath, (err, files) => {
      if (!err) {
        try {
          for (let file of files) {
            fs.rmSync(path.join(tmpPath, file), {recursive: true});
          }
          resolve();
        }
        catch (err) {
          reject(err);
        }
      }
      else {
        reject(err);
      }
    });
  })
}

function copyPublicFolder(appPublic) {
  const appHtml = path.resolve(appPublic, 'index.html');
  fs.copySync(appPublic, appBuild, {
    dereference: true,
    filter: file => file !== appHtml,
  });
}

function build(previousFileSizes) {
  console.log('Создаём production build...');

  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages;
      if (err) {
        if (!err.message) {
          return reject(err);
        }

        messages = {errors: err.message, warnings: []};
      } else {
        messages = stats.toJson({ all: false, warnings: true, errors: true });
      }

      for(const msg of messages.errors.concat(messages.warnings)) {
        console.log(msg.message || msg);
      }

      const resolveArgs = {
        stats,
        previousFileSizes,
        ...messages,
      };

      if (process.env.WRITE_STAT) {
        return new Promise((resolve, reject) => {
          fs.write(appBuild + '/bundle-stats.json', stats.toJson(), (err) => {
            err ? reject(err) : resolve();
          });
        })
          .then(() => resolve(resolveArgs))
          .catch(error => reject(new Error(error)));
      }

      return resolve(resolveArgs);
    });
  });
}

rimraf(path.resolve(__dirname, '../build'))
  .then(() => build(0))
  .then(() => copyPublicFolder(path.resolve(__dirname, '../public')))
  .catch(console.error);

