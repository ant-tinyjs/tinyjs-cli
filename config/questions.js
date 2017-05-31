'use strict';

const path = require('path');
const shell = require('shelljs');

let currentUser = null;

// 获取 tnpm user 名, 如有
try {
  if (!currentUser) {
    const ret = shell.exec('tnpm whoami', {silent: true});
    if (ret.code === 0) {
      // 取最后一行
      const stdout = ret.stdout.trim().split('\n');
      currentUser = stdout[stdout.length - 1].trim();
    }
  }
} catch (e) {
}

/**
 * 插件类型
 */
const ALL_TYPES = {
  class: '类（首字母大写，如：PluginClassName）',
  module: '模块（如：pluginModuleName）',
};

module.exports = {
  init: [{
    type: 'input',
    name: 'name',
    message: '项目名:',
    default: function () {
      return path.basename(process.cwd());
    },
  }, {
    type: 'input',
    name: 'description',
    message: '项目描述:',
    default: function () {
      return 'The Tiny.js Game build by tinyjs client';
    },
  }, {
    type: 'input',
    name: 'author',
    message: '开发人员:',
    default: function () {
      return currentUser;
    },
  }],
  plugin: [{
    type: 'input',
    name: 'name',
    message: '插件名:'
  }, {
    type: 'input',
    name: 'description',
    message: '插件描述:',
    default: function () {
      return 'The Tiny.js plugin';
    },
  }, {
    type: 'list',
    name: 'type',
    message: '插件类型:',
    choices: getTypes(),
    default: function () {
      return 'class';
    },
  }, {
    type: 'input',
    name: 'author',
    message: '开发人员:',
    default: function () {
      return currentUser;
    },
  }],
};

function getTypes() {
  return Object.keys(ALL_TYPES).map((key) => {
    return {
      name: ALL_TYPES[key],
      value: key
    };
  });
}
