'use strict';

module.exports = {
  template: {
    name: 'template',
    link: 'https://github.com/ant-tinyjs/template.git',
  },
  pluginTemplate: {
    name: 'plugin-template',
    link: 'https://github.com/ant-tinyjs/plugin-template.git',
  },
  weiTemplate: {
    name: 'wei',
    link: 'https://github.com/ant-tinyjs/wei.git',
  },
  weiBundleTemplate: {
    name: 'wei-bundle-template',
    link: 'https://github.com/ant-tinyjs/wei-bundle-template.git',
  },
  commands: require('./commands'),
  questions: require('./questions'),
};
