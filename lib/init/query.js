'use strict';

const inquirer = require('inquirer');
const config = require('../../config');
//todo fengdie template
//const http = require('http');

module.exports = function*() {
  //todo fengdie template
  //let config_init = config.questions.init;

  //let localCheck = new Promise(function(resolve, reject) {
  //  http.get('http://luna.alipay.net/', (res) => {
  //    res.on('data', () => {});
  //    res.on('end', () => {
  //      resolve();
  //    });
  //  }).on('error', err => {
  //    config_init[0].choices.pop();
  //    resolve();
  //  });
  //});
  //
  //yield localCheck;
  return yield inquirer.prompt(config.questions.init);
};
