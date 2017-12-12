'use strict';

const path = require('path');
const shell = require('shelljs');
const chalk = require('chalk');
const fs = require('fs');
const utils = require('../common/utils');

module.exports = function *() {
  utils.hint('info', '开始初始化 Tiny.js 项目...');

  // 1. 获取问询值
  const answers = yield require('./query')();
  const name = answers.name;
  const baseName = path.basename(process.cwd());

  if (!name || baseName === name) {
    utils.hint('warning', '没有输入项目名，将在当前目录下初始化。');
    // 1.1. 判断当前目录是否为空
    const destDir = process.cwd();
    const files = fs.readdirSync(destDir).filter(function (dir) {
      return ['.idea', '.DS_Store', '.git', '.gitignore', '.npmignore', 'npm-debug.log'].indexOf(dir) === -1;
    });
    if (files.length) {
      return utils.hint('error', '请在空目录下进行初始化！');
    }
  }

  // 2. 检查目录是否存在
  const destDir = process.cwd();
  const files = fs.readdirSync(destDir).filter(function (dir) {
    return [name].indexOf(dir) !== -1;
  });
  if (files.length) {
    return utils.hint('error', `${chalk.cyan.bold(name)} 已经存在！`);
  } else {
    shell.exec(`mkdir ${name}`, {silent: false});
  }

  // 3. 生成项目
  require('./generate')(answers);

  // 4. 安装依赖
  let ifInstallOk = true;
  try {
    utils.hint('info', '开始安装依赖...');
    const ret = shell.exec(`npm install`, {silent: false});

    if (ret.code === 0) {
    } else {
      ifInstallOk = false;
      utils.hint('error', ret.stderr);
    }
  } catch (e) {
    ifInstallOk = false;
    utils.hint('error', e);
  }

  // 5. 结束
  if (ifInstallOk) {
    utils.hint('success', `Tiny.js 项目 ${chalk.cyan.bold(name)} 初始化完成。\n创造吧, 骚年!`);
  } else {
    utils.hint('success', `Tiny.js 项目 ${chalk.cyan.bold(name)} 初始化完成。`);
    utils.hint('warn', `但是, 依赖安装失败, 请自行执行 ${chalk.green.bold('npm install')} 安装依赖。`);
  }
};
