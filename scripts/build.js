const path = require('node:path');
const fs = require('node:fs');
const webpack = require('webpack');
const config = require('../config/webpack.prod');

function rimraf(tmpPath) {
  console.log('Чистим каталог build...');
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

      return resolve(resolveArgs);
    });
  });
}

rimraf(path.resolve(__dirname, "../build"))
  .then(() => build(0))
  .catch(console.error);

