'use strict';

const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const utils = require('../common/utils');
const helper = require('./helper');
const configFilePath = path.join(process.cwd(), 'tiny-app.config.js');

module.exports = function *() {
  utils.hint('info', 'Start generate resources...');
  // 1. 检查 tiny-app.config 文件
  if (!fs.existsSync(configFilePath)) {
    utils.hint('error', 'The <tiny-app.config.js> is not exist.');
    return;
  }

  // 2. 解析 config 配置信息
  const config = require(path.join(process.cwd(), 'tiny-app.config.js'));
  // 如果 appFold 不存在，则默认使用项目根目录
  const appFoldPath = config.appFold ? path.join(process.cwd(), config.appFold) : process.cwd();
  const resourcePath = path.join(appFoldPath, 'res');
  const srcPath = path.join(appFoldPath, 'src');

  // 3. 检查 res 目录
  if (!fs.existsSync(resourcePath)) {
    utils.hint('error', 'The res fold is not exist.');
    return;
  }

  // 4. 检查 src 目录，没有就创建
  if (!fs.existsSync(srcPath)) {
    const err = fs.mkdirSync(srcPath, 0o777);
    if (err) {
      throw err;
    }
  }

  const resourceFilePath = path.join(srcPath, config.resourceName || 'Resource.js');
  // 打印路径
  utils.hint(`The <res> path is: ${resourcePath}`);
  utils.hint(`The <src> path is: ${srcPath}`);
  utils.hint(`The resourceFile path is: ${resourceFilePath}`);

  utils.hint('info', `Start scan resources from: ${resourcePath}`);

  // 5. 解析 tileset 配置
  const tileset = [];
  if (_.isArray(config.tileset)) {
    config.tileset.forEach(function (item) {
      tileset.push(_.defaults(item, config.tilesetDefault || {}));
    });
  }

  // 6. 解析文件并生成
  helper.generateFile({
    resourcePath,
    appFoldPath,
    resourceFilePath,
    resourceTemplate: config.resourceTemplate,
    tileset,
  });
};
