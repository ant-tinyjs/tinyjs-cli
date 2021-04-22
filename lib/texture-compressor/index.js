'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const { spawnSync } = require('child_process');
const _ = require('lodash');
const basisu = require('basisu');
const sizeOf = require('image-size');
const utils = require('../common/utils');
const constants = require('./constants');

const defaultFormat = ['basis', 'astc', 'pvr'];
const configFilePath = path.join(process.cwd(), 'tiny-app.config.js');
const binaryDir = path.join(path.resolve(__dirname, '..', '..'), 'bin', os.platform());

module.exports = function*(cwds, { quality, format }) {
  utils.hint('开始生成压缩纹理...');

  const folds = cwds;
  const inputs = [];
  const inputQuality = quality;
  const inputFormat = _.filter(format.split(','), (o) => _.includes(defaultFormat, o));
  let cts;

  if (inputFormat.length === 0) {
    return utils.hint('error', '无法识别的压缩格式，可选值：basis|astc|pvr（多个以,分割，不设置默认为所有）');
  }

  if (!_.includes(_.keys(constants), inputQuality)) {
    return utils.hint('error', '无法识别的压缩率，应该是以下中的值：low, medium, high');
  }

  if (folds.length) {
    cts = [...folds];
  } else {
    // 1. 检查 tiny-app.config 文件
    if (!fs.existsSync(configFilePath)) {
      utils.hint('error', 'The <tiny-app.config.js> is not exist.');
      return;
    }
    // 2. 解析 config 配置信息，获取 compressedTexture 字段
    const { compressedTexture } = require(configFilePath);

    if (!(compressedTexture && compressedTexture.length !== 0)) {
      utils.hint('没有要生成的压缩纹理，请检查 compressedTexture 字段是否存在且不为空');
      return;
    }
    // 3. 重新组装参数
    if (_.isString(compressedTexture)) {
      cts = [compressedTexture];
    } else {
      cts = compressedTexture;
    }
  }

  utils.hint(`当前选择的压缩率为：${inputQuality}`);

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
      const { dir: outFold, ext, name } = path.parse(path.join(process.cwd(), ct));

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
      return /.+\.(ktx|basis)$/ig.test(dir);
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
  inputs.forEach(function(opts, i) {
    const { input, name } = opts;
    const { size: originalFileSize } = fs.statSync(input);
    const { width, height } = sizeOf(input);

    console.log(`\n${'='.repeat(20)} 任务${i} [${input} - ${originalFileSize / 1000}KB] ${'='.repeat(20)}\n`);

    if (!(utils.isPow2(width) && utils.isPow2(height))) {
      return utils.hint('error', 'Error: Non-Power of Two this image.');
    }

    inputFormat.forEach(function(type, i) {
      const isBasisType = type === 'basis';
      const extension = isBasisType ? type : `${type}.ktx`;
      const output = path.join(opts.outFold, `${name}.${extension}`);
      const { compression, quality, level } = constants[inputQuality][type];
      let toolPath = path.join(binaryDir, 'PVRTexToolCLI');
      let flagMapping = [
        '-i',
        input,
        '-o',
        output,
        '-f',
        compression,
        '-q',
        quality,
        '-p',
      ];

      if (args.square !== 'no') {
        flagMapping.push('-square', args.square || '+');
      }
      if (args.pot !== 'no') {
        flagMapping.push('-pot', args.pot || '+');
      }

      i !== 0 && utils.hint(`\n${'-'.repeat(70)}\n`);
      utils.hint(`[${type.toUpperCase()}] 开始进行压缩处理...`);
      console.time(`压缩耗时`);

      if (isBasisType) {
        toolPath = basisu.path;
        flagMapping = [
          '-comp_level',
          level,
          '-q',
          quality,
          '-output_file',
          output,
          input,
        ];
      }

      const { stdout, stderr } = spawnSync(toolPath, flagMapping, {
        env: {
          PATH: binaryDir || process.env,
        },
      });
      if (_.trim(stderr)) {
        (isBasisType || stderr.toString().toLowerCase().indexOf('error') !== -1) && utils.hint('error', stderr);
      }
      if (_.trim(stdout)) {
        // utils.hint(stdout);
      }
      if (fs.existsSync(output)) {
        const { size: outFileSize } = fs.statSync(output);

        utils.hint(`[${type.toUpperCase()}] 压缩纹理信息：${output} - ${outFileSize / 1000}KB`);
      }
      console.timeEnd(`压缩耗时`);
    });
  });

  utils.hint('生成任务结束');
};
