const config = require('../../config');
const utils = require('../common/utils');
const fs = require('fs');
const process = require('process');
const path = require('path');

module.exports = function* (answer) {
  const {bundleName} = answer;
  const _path = path.join(process.cwd(), 'src', 'bundles');
  const bundlePath = path.join(_path, bundleName);
  const checkBundle = new Promise((resolve, reject) => {
      fs.readdir(_path, (err, dir) => {
        if(err) {
          reject([]);
          return;
        }

        resolve(dir);
      });
  }).catch(e => {});

  const bundleArr = yield checkBundle;

  if(!bundleArr) {
    utils.hint('error', '请在项目根目录下执行\`tiny bundle\`');
    return;
  }

  if(bundleArr.length && bundleArr.indexOf(bundleName) > -1) {
    utils.hint('error', 'bundle已存在，请检查bundle name后重试。');

    return;
  }

  utils.hint('开始创建bundle...');
  fs.mkdirSync(bundlePath, 0o777);
  utils.hint('开始拉取模板...');
  utils.doExec(`git clone ${config.weiBundleTemplate.link} && mv ./weiBundle/* ${bundlePath} && rm -rf ./weiBundle`, true, function() {
    utils.hint('success', '√ 创建完成');
  })
};
