'use strict';

const path = require('path');
const config = require('../../config');
const utils = require('../common/utils');

module.exports = function (answers) {
  const name = answers.name;
  const destDir = process.cwd();
  const useBaseName = path.basename(destDir) === name;

  // 1. Tiny.js模板拉取
  utils.hint(`开始从 ${config.template.link} 拉取 Tiny.js 项目开发模板...`);
  utils.doExec(`git clone ${config.template.link} __tiny__tmp && cd __tiny__tmp && rm -rf .git`, true, function () {
    utils.hint('√ 拉取完成');
  });

  // 2. 执行拷贝
  utils.hint('开始整理项目结构...');
  utils.copyTo(path.join('.', '__tiny__tmp'), useBaseName ? destDir : name, answers);
  utils.hint(`开始清理临时文件`);
  utils.doExec(`rm -rf __tiny__tmp npm-debug.log`, true, function () {
    utils.hint('√ 整理完成');
  });
};
