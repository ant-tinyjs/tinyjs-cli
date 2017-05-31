'use strict';

const inquirer = require('inquirer');
const config = require('../../config');

module.exports = function*() {
  return yield inquirer.prompt(config.questions.init);
};
