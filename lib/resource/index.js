'use strict';

const path = require('path');
const fs = require('fs');
const spritesheet = require('spritesheet-js');

const utils = require('../common/utils');
const configFilePath = path.join(process.cwd(), 'tiny-app.config.js');

let outs = [];

module.exports = function *() {
  utils.hint('info', '开始生成 Resource.js 文件...');
  // 1. 检查 tiny-app.config 文件
  if (!fs.existsSync(configFilePath)) {
    utils.hint('error', 'The <tiny-app.config.js> is not exist.');
    return;
  }
  const config = require(path.join(process.cwd(), 'tiny-app.config.js'));
  if (typeof config.appFold === 'undefined') {
    utils.hint('error', 'The value appFold is undefined in <tiny-app.config.js>.');
    return;
  }
  const resourcePath = path.join(process.cwd(), config.appFold, 'res');
  const srcPath = path.join(process.cwd(), config.appFold, 'src');

  function getTilesetImagesPath(fold) {
    return fold ? path.join(process.cwd(), fold) : path.join(resourcePath, 'images');
  }

  function getTilesetSuffix(fold) {
    return fold ? '_' + fold.split(path.sep).pop() : '';
  }

  if (!fs.existsSync(resourcePath)) {
    utils.hint('error', 'The res fold is not exist.');
    return;
  }

  if (!fs.existsSync(srcPath)) {
    const err = fs.mkdirSync(srcPath, 0o777);
    if (err) {
      throw err;
    }
  }

  const resourceFilePath = path.join(srcPath, config.resourceName || 'Resource.js');

  function getAllFiles(root) {
    const files = fs.readdirSync(root);

    files.forEach(function (filename) {
      const pathname = path.join(root, filename);
      const stat = fs.lstatSync(pathname);

      config.appFold = (config.appFold === '' ? process.cwd() : config.appFold);
      const prex = pathname.split(config.appFold)[1].replace(new RegExp('^\\' + path.sep), '');

      if (stat.isDirectory()) {
        if (filename.indexOf('.') === 0) return;
        outs.push(`\n  // ${path.basename(pathname, path.extname(pathname))}`);
        getAllFiles(pathname);
      } else {
        if (filename.indexOf('.') > 0) {
          const extname = path.extname(prex);
          if (extname === '.mp3') {
            return;
          }

          if (config.tileset) {
            for (let i = 0; i < config.tileset.length; i++) {
              if (extname === '.png' &&
                pathname.indexOf(getTilesetImagesPath(config.tileset[i].fold)) !== -1 &&
                filename.indexOf(config.tileset[i].name || 'tileset') === -1
              ) {
                utils.hint(`This image will adds to tileset: ${pathname}`);
                return false;
              }
            }
          }

          outs.push(`  's_${path.basename(prex).replace(new RegExp(extname + '$'), '_' + extname.substr(1))}': '${prex.toString()}'`);
        }
      }
    });
  }

  utils.hint('info', `Start scan resources from: ${resourcePath}`);

  if (config.tileset && config.tileset.length != 0) {
    config.tileset.forEach(function (tileset, i) {
      const name = tileset.name || 'tileset' + getTilesetSuffix(tileset.fold);
      spritesheet(path.join(getTilesetImagesPath(tileset.fold), '*.png'), {
        format: 'json',
        name: name,
        padding: tileset.padding || 0,
        trim: tileset.trim || false,
        path: path.join(resourcePath, 'images'),
      }, function (err) {
        if (err) throw err;
        utils.hint('info', `${name} is successfully generated`);

        if (i === 0) {
          generateFile();
        }
      });
    });
  } else {
    generateFile();
  }

  function generateFile() {
    getAllFiles(resourcePath);

    fs.writeFile(resourceFilePath, `var RESOURCES = {${outs.join(',\n')}\n};\n`, function (err) {
      if (err) throw err;
      utils.hint('info', `Generate Resource file finished. The file path is: ${resourcePath}`);
    });
  }
};
