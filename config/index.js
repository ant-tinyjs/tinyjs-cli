'use strict';

module.exports = {
  template: {
    name: 'template',
    link: 'git@gitlab.alipay-inc.com:tiny/template.git',
  },
  pluginTemplate: {
    name: 'plugin-template',
    link: 'git@gitlab.alipay-inc.com:tiny/plugin-template.git',
  },
  commands: require('./commands'),
  questions: require('./questions'),
};
