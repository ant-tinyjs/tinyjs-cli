'use strict';

const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const spritesheet = require('spritesheet-js');
const utils = require('../common/utils');
const getTilesetImagesPath = function (fold, resourcePath) {
  return fold ? path.join(process.cwd(), fold) : path.join(resourcePath, 'images');
};
const getTilesetSuffix = function (fold) {
  return fold ? `_${fold.split(path.sep).pop()}` : '';
};
const getTilesetOutPath = function (fold, resourcePath) {
  return fold ? path.join(process.cwd(), fold) : path.join(resourcePath, 'tileset');
};
const outs = [];
const resourceTemplate = `var RESOURCES = {<% list.forEach(function(item, i){ %>
  '<%= item.name %>': '<%= item.path %>',<% }); %>
};
`;

module.exports = {
  generateFile(opts) {
    const tileset = opts.tileset;
    // 开始解析资源文件
    if (_.isArray(tileset) && tileset.length > 0) {
      generateSpritesheet(tileset, opts)
        .then(() => {
          this.writeToFile(opts);
        })
        .catch((e) => {
          utils.hint('error', e);
        });
    } else {
      this.writeToFile(opts);
    }
  },
  writeToFile(opts) {
    const resourcePath = opts.resourcePath;
    const tpl = opts.resourceTemplate || resourceTemplate;

    utils.hint('info', `Start write resource file to: ${opts.resourceFilePath}`);
    getAllFiles(resourcePath, opts);

    const content = _.template(tpl)({
      list: outs,
    });

    // 开始写入文件
    fs.writeFile(opts.resourceFilePath, content, function (err) {
      if (err) throw err;
      utils.hint('success', `resource file is successfully generated. The file path is: ${resourcePath}`);
    });
  },
};

// 生成 spritesheet
function generateSpritesheet(list, opts) {
  const resourcePath = opts.resourcePath;
  return new Promise(function (resolve, reject) {
    utils.hint('info', `Start generate tileset by spritesheet-js`);

    list.forEach(function (tileset, i) {
      const name = tileset.name || `tileset${getTilesetSuffix(tileset.fold)}`;
      const files = path.join(getTilesetImagesPath(tileset.fold, resourcePath), '*.png');
      const outPath = getTilesetOutPath(tileset.outFold, resourcePath);

      spritesheet(files, {
        format: 'json',
        name,
        padding: tileset.padding || 0,
        trim: tileset.trim || false,
        path: outPath,
      }, function (err) {
        if (err) {
          reject(new Error(err));
        }
        utils.hint('success', `<${name}> is successfully generated. The file path is: ${outPath}`);
        if (i === list.length - 1) {
          resolve();
        }
      });
    });
  });
}

function getAllFiles(root, opts) {
  const files = fs.readdirSync(root);
  const tilesetFoldArr = [];
  const tilesetOutFoldArr = [];
  _.forEach(opts.tileset, function (item) {
    tilesetFoldArr.push(item.fold);
    tilesetOutFoldArr.push(item.outFold);
  });

  files.forEach(function (filename) {
    const pathname = path.join(root, filename);
    const stat = fs.lstatSync(pathname);
    const prex = pathname.split(opts.appFoldPath)[ 1 ].replace(new RegExp(`^\\${path.sep}`), '');

    if (stat.isDirectory()) {
      if (filename === 'css' || filename === 'js' || filename.indexOf('.') === 0) {
        return;
      }
      if (!_.includes(tilesetFoldArr, prex)) {
        getAllFiles(pathname, opts);
      }
    } else {
      if (filename.indexOf('.') > 0) {
        const extname = path.extname(prex);
        if (extname === '.mp3' || extname === '.css' || extname === '.js') {
          return true;
        }

        // 过滤 tileset 的图片文件，只输入 json
        if (extname === '.png' && (/tileset/.test(prex) || _.includes(tilesetOutFoldArr, path.dirname(prex)))) {
          return true;
        }

        let name = path.basename(prex);
        const _extname = path.extname(name);
        name = name.replace(new RegExp(`${_extname}`, 'ig'), _extname.replace('.', '').toUpperCase()).replace(/\s|-|\./ig, '');
        outs.push({
          name,
          path: prex,
        });
      }
    }
  });
}
