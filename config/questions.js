'use strict';

const path = require('path');
const shell = require('shelljs');

let currentUser = null;

// 获取 npm user 名, 如有
try {
  if (!currentUser) {
    const ret = shell.exec('npm whoami', {silent: true});
    if (ret.code === 0) {
      // 取最后一行
      const stdout = ret.stdout.trim().split('\n');
      currentUser = stdout[stdout.length - 1].trim();
    }
  }
} catch (e) {
}

/**
 * choices types
 */
const TYPES = {
  init: {
    basicTpl: '基础包',
    offlineTpl: '离线包',
    //onlineTpl: '在线包'
  },

  plugin: {
    class: '类（首字母大写，如：PluginClassName）',
    module: '模块（如：pluginModuleName）',
  }
};

module.exports = {
  init: [{
    type: 'list',
    name: 'tplType',
    message: '请选择项目类型',
    choices: getTypes('init'),
    default: function() {
      return 'basicTpl';
    }
  }, {
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
    choices: getTypes('plugin'),
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
  bundle: [
    {
      type: 'input',
      name: 'bundleName',
      message: 'bundle名称:',
      default: function () {
        return 'index';
      },
    }
  ]
};

function getTypes(commander) {
  let types = TYPES[commander];

  if(!commander || !types) {
    console.log(commander, '命令TYPES不存在');
    return;
  }

  return Object.keys(types).map((key) => {
    return {
      name: types[key],
      value: key
    };
  });
}
