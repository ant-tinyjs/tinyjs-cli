## 1.3.0

`2020-03-05`

### Added
- 压缩纹理生成器增加压缩率的选择，你可以选择三种质量的压缩率来满足你的诉求

## 1.2.1

`2020-01-12`

### Fixed
- 修复 PVRTexToolCLI 工具目录索引的错误
- 修复配置文件模式下参数重新组装的错误

## 1.2.0

`2020-01-12`

### Added
- 增加压缩纹理生成器：`tiny texture-compressor`，配置文件延续使用 `tiny-app.config.js`，并使用字段 `compressedTexture`，当然，同时支持带入参数，文件目录/文件名/多个都可以（如：`tiny texture-compressor res/nzd`）

## 1.1.2

`2018-04-13`

- `tiny init` 增加标准版，并修改原来的默认版为极简版

## 1.1.1

`2018-03-02`

- 支持 tileset 输出目录的配置，并支持通用配置（字段为 `tilesetDefault`），方便配置多个 tileset
- 支持生成的资源配置文件的模版渲染（字段为`resourceTemplate`）
- 移除 `tiny init` 后的 `npm install` 自动执行，用户需手动执行

## 1.1.0

`2017-11-14`

- 优化命令执行速度：1、`npm whoami` 和检查最新版本设置超时 5s；2、增加以天为周期的缓存
