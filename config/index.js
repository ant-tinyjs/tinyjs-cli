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
  commands: require('./commands'),
  questions: require('./questions'),
};
