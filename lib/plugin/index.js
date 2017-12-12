'use strict';

const chalk = require('chalk');
const fs = require('fs');
const camelCase = require('camelcase');
const utils = require('../common/utils');

module.exports = function *() {
  utils.hint('info', '开始初始化 Tiny.js 插件库...');

  // 1. 获取问询值
  const answers = yield require('./query')();
  let name = answers.name;
  const type = answers.type;

  if (!name) {
    return utils.hint('error', '插件名不能为空！');
  }
  if (name.indexOf('tinyjs-plugin') !== 0) {
    name = `tinyjs-plugin-${name}`;
    answers.name = name;
  }
  const camelCaseName = camelCase(name.replace('tinyjs-plugin', ''));
  answers.camelCaseName = camelCaseName;
  answers.className = firstUpperCase(camelCaseName);
  if (type === 'class') {
    answers.buildName = answers.className;
  } else if (type === 'module') {
    answers.buildName = answers.camelCaseName;
  }

  // 2. 检查目录是否存在
  const destDir = process.cwd();
  const files = fs.readdirSync(destDir).filter(function (dir) {
    return [name].indexOf(dir) !== -1;
  });
  if (files.length) {
    return utils.hint('error', `${chalk.cyan.bold(name)} 已经存在！`);
  }

  // 3. 生成插件库
  require('./generate')(answers);

  // 4. 结束
  utils.hint('success', `Tiny.js 插件库 ${chalk.cyan.bold(name)} 初始化完成。`);
};

function firstUpperCase(str) {
  return str.toString()[0].toUpperCase() + str.toString().slice(1);
}
