## 1.1.1

`2017-03-02`

- 支持 tileset 输出目录的配置，并支持通用配置（字段为 `tilesetDefault`），方便配置多个 tileset
- 支持生成的资源配置文件的模版渲染（字段为`resourceTemplate`）
- 移除 `tiny init` 后的 `npm install` 自动执行，用户需手动执行

## 1.1.0

`2017-11-14`

- 优化命令执行速度：1、`npm whoami` 和检查最新版本设置超时 5s；2、增加以天为周期的缓存
