'use strict';

const path = require('path');
const config = require('../../config');
const utils = require('../common/utils');

module.exports = function (answers) {
  const name = answers.name;

  // 1. Tiny.js 插件模板拉取
  utils.hint(`开始从 ${config.pluginTemplate.link} 拉取 Tiny.js 插件开发模板...`);
  utils.doExec(`git clone ${config.pluginTemplate.link} ${name} && cd ${name} && rm -rf .git`, true, function () {
    utils.hint('√ 拉取完成');
  });

  // 2. 执行拷贝
  utils.hint('开始整理插件模板...');
  utils.copyTo(path.join('.', name), name, answers);
  utils.hint('√ 整理完成');
};
