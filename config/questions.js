'use strict';

const path = require('path');
const npmWhoami = require('npm-whoami');
const utils = require('../lib/common/utils');

let currentUser = utils.localStorage.get('currentUser');

// 获取 npm user 名, 如有
try {
  if (!currentUser) {
    npmWhoami.sync({
      timeout: 5000,
    }, function (err, username) {
      if (!err) {
        currentUser = username;
        utils.localStorage.set('currentUser', currentUser);
      }
    });
  }
} catch (e) {
}

/**
 * choices types
 */
const TYPES = {
  init: {
    basicTpl: '标准版',
    simpleTpl: '极简版',
  },
  plugin: {
    class: '类（首字母大写，如：PluginClassName）',
    module: '模块（如：pluginModuleName）',
  },
};

module.exports = {
  init: [{
    type: 'list',
    name: 'tplType',
    message: '请选择项目类型',
    choices: getTypes('init'),
    default: function () {
      return 'basicTpl';
    },
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
      return 'The Tiny.js game project build by tinyjs-cli';
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
    message: '插件名:',
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
};

function getTypes(commander) {
  const types = TYPES[commander];

  if (!commander || !types) {
    console.log(commander, '命令TYPES不存在');
    return;
  }

  return Object.keys(types).map((key) => {
    return {
      name: types[key],
      value: key,
    };
  });
}
