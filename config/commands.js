'use strict';

module.exports = [{
  name: 'init',
  description: '初始化 Tiny.js 项目',
  examples: 'tiny init',
  options: [],
}, {
  name: 'plugin',
  description: '初始化 Tiny.js 插件库',
  examples: 'tiny plugin',
  options: [],
}, {
  name: 'resource',
  description: 'resources.js 生成器',
  examples: 'tiny resource',
  options: [],
}, {
  name: 'texture-compressor',
  description: '压缩纹理生成器',
  examples: 'tiny texture-compressor <fold|file> [fold2|file] [-q <quality>] [-f <format>]',
  options: [{
    name: '-q, --quality <type>',
    description: '压缩率，可选值：low, medium, high',
    defaultValue: 'medium',
  }, {
    name: '-f, --format <type>',
    description: '压缩纹理的类型，可选值：basis|astc|pvr（多个以,分割，不设置默认为所有）',
    defaultValue: 'basis,astc,pvr',
  }],
}];
