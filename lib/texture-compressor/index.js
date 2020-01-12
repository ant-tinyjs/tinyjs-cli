'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const { spawnSync } = require('child_process');
const _ = require('lodash');
const utils = require('../common/utils');
const constants = require('./constants');

const configFilePath = path.join(process.cwd(), 'tiny-app.config.js');
const binaryDir = path.join(process.cwd(), 'bin', os.platform());
const toolPath = path.join(binaryDir, 'PVRTexToolCLI');

module.exports = function*(...folds) {
  utils.hint('开始生成压缩纹理...');

  const inputs = [];
  let cts;

  if (folds[0].length) {
    cts = folds[0];
  } else {
    // 1. 检查 tiny-app.config 文件
    if (!fs.existsSync(configFilePath)) {
      utils.hint('error', 'The <tiny-app.config.js> is not exist.');
      return;
    }
    // 2. 解析 config 配置信息，获取 compressedTexture 字段
    const { compressedTexture } = require(path.join(process.cwd(), 'tiny-app.config.js'));

    if (!(compressedTexture && compressedTexture.length !== 0)) {
      utils.hint('没有要生成的压缩纹理，请检查 compressedTexture 字段是否存在且不为空');
      return;
    }
    // 3. 重新组装参数
    if (_.isString(compressedTexture)) {
      cts = [compressedTexture];
    }
  }

  _.forEach(cts, function(ct) {
    if (!fs.existsSync(ct)) {
      throw new Error(`<${ct}> is not exist.`);
    }
    const stats = fs.statSync(ct);

    if (stats.isDirectory()) {
      const files = fs.readdirSync(ct).filter(function(dir) {
        return !/^\..+/ig.test(dir) && /.+\.(png|jpg|jpeg|webp)$/ig.test(dir);
      });

      _.forEach(files, function(file) {
        const input = path.join(ct, file);
        const { dir: outFold, ext, name } = path.parse(input);

        inputs.push({
          input,
          outFold,
          ext,
          name,
        });
      });
    } else {
      const { dir: outFold, ext, name } = path.parse(ct);

      inputs.push({
        input: ct,
        outFold,
        ext,
        name,
      });
    }
  });

  // 4. 清理历史生成的 ktx 文件
  _.forEach(_.uniqBy(inputs, 'outFold'), function({ outFold }) {
    const files = fs.readdirSync(outFold).filter(function(dir) {
      return /.+\.ktx$/ig.test(dir);
    });

    _.forEach(files, function(file) {
      fs.removeSync(path.join(outFold, file));
    });
  });

  // 5. 开始执行生成任务
  const args = {
    square: 'no',
    pot: 'no',
  };
  inputs.forEach(function(opts) {
    const { input, name } = opts;
    const { size: originalFileSize } = fs.statSync(input);

    utils.hint('info', `原始图片：${input} - ${originalFileSize / 1000}KB`);
    ['astc', 'pvr'].forEach(function(type) {
      const output = path.join(opts.outFold, `${name}.${type}.ktx`);
      const { compression, quality } = constants[type];
      const flagMapping = [
        '-i',
        input,
        '-o',
        output,
        '-f',
        compression,
        `-q`,
        quality,
        '-p',
      ];
      if (args.square !== 'no') {
        flagMapping.push('-square', args.square || '+');
      }
      if (args.pot !== 'no') {
        flagMapping.push('-pot', args.pot || '+');
      }

      utils.hint(`开始对<${input}>进行[${type.toUpperCase()}]压缩处理`);
      console.time(`耗时`);

      const { stdout, stderr } = spawnSync(toolPath, flagMapping, {
        env: {
          PATH: binaryDir || process.env,
        },
      });
      if (_.trim(stderr)) {
        utils.hint(stderr);
      }
      if (_.trim(stdout)) {
        utils.hint(stdout);
      }
      if (fs.existsSync(output)) {
        const { size: outFileSize } = fs.statSync(output);

        utils.hint('info', `${type.toUpperCase()}：${output} - ${outFileSize / 1000}KB`);
      }
      console.timeEnd(`耗时`);
      utils.hint('=======');
    });
  });

  utils.hint('生成任务结束');
};
