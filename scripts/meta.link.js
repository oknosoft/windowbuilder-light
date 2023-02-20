/**
 * Копирует dev-версию файлов в node_modules (для отладки библиотек)
 */

const path = require('path');
const fs = require('fs');
const md5File = require('md5-file');
const localNodeModules = path.resolve(__dirname, '../node_modules');
const remoteNodeModules = '..\\metadata\\packages';
const {dependencies} = require(path.resolve(__dirname, '../package.json'));
const libs = Object.keys(dependencies).filter(v => /^metadata-/.test(v));
//libs.push('docdash');

function fromDir(startPath, filter, callback) {

  if(!fs.existsSync(startPath)) {
    console.log('no dir ', startPath);
    return;
  }

  const files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    if(/node_modules|\\src\\|\/src\//.test(filename)){
      continue;
    }
    const stat = fs.lstatSync(filename);
    if(stat.isDirectory()) {
      callback(filename, true);
      fromDir(filename, filter, callback); //recurse
    }
    else if(filter.test(filename)) {
      callback(filename);
    }
  };
};

let copied;
for (const lib of libs) {
  const lpath = path.resolve(localNodeModules, lib);
  const rpath = lib === 'docdash' ?  path.resolve('../', lib) : path.resolve(remoteNodeModules, lib);
  let i = 0;
  fromDir(rpath, /\.(css|js|mjs|md|map|tmpl)$/, (rname, isDir) => {
    const name = rname.replace(rpath, '');
    const lame = path.join(lpath, name);
    if(isDir) {
      if(!fs.existsSync(lame)) {
        fs.mkdirSync(lame);
      }
    }
    else if(!fs.existsSync(lame) || (md5File.sync(rname) != md5File.sync(lame))){
      i++;
      fs.createReadStream(rname).pipe(fs.createWriteStream(lame));
    }
  });
  if(i){
    copied = true;
    console.log(`from ${rpath} written ${i} files`);
  }
}
if(!copied){
  console.log(`all files match`);
}
