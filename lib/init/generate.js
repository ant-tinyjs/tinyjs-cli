'use strict';

const path = require('path');
const config = require('../../config');
const utils = require('../common/utils');

module.exports = function (answers) {
  const {name, tplType} = answers;
  const destDir = process.cwd();
  let tplGit = '';

  switch (tplType) {
    case 'basicTpl':
      tplGit = config.weiTemplate.link;
      break;
    case 'simpleTpl':
      tplGit = config.template.link;
      break;
  }

  // 1. Tiny.js模板拉取
  if (tplGit) {
    utils.hint(`开始从 ${tplGit} 拉取 Tiny.js 项目开发模板...`);
    utils.doExec(`git clone ${tplGit} __tiny__tmp && cd __tiny__tmp && rm -rf .git`, true, function () {
      utils.hint('√ 拉取完成');
    });

    // 2. 执行拷贝
    utils.hint('开始整理项目结构...');
    utils.copyTo(path.join('.', '__tiny__tmp'), destDir, answers);
    utils.hint(`开始清理临时文件`);
    utils.doExec(`rm -rf __tiny__tmp npm-debug.log ${name}`, true, function () {
      utils.hint('√ 整理完成');
    });
    return true;
  }
};
