# tinyjs-cli

## 简介

Tiny.js 本地开发工具，使用命令行快速创建游戏项目、 生成资源配置文件等。

### 功能一览

```bash
-h, --help          查看帮助信息
-V, --version       查看版本信息
init                初始化 Tiny.js 项目
plugin              初始化 Tiny.js 插件库
resource            resources.js 生成器
```

## 环境准备

- nodejs, npm

## 安装

使用 npm 安装 tinyjs-cli
```bash
$ npm install tinyjs-cli -g
```

## 快速上手

### 初始化 Tiny.js 项目

1. 打开命令行工具输入
  ```bash
  $ tiny init
  ```

2. 按照提示步骤逐步输入信息

  ![](https://gw.alipayobjects.com/zos/rmsportal/EaFSYYYbxxKZienZQRdG.gif)
> 注意： `项目名`为必填项，如果不填，将使用当前目录，但是会检测此目录是否是空目录。

### 初始化 Tiny.js 插件库

1. 打开命令行工具输入
  ``` bash
  $ tiny plugin
  ```

2. 按照提示步骤逐步输入信息

  ![](https://zos.alipayobjects.com/rmsportal/zLdwzpBzbQUNyLBpjjmK.gif)
> 注意：
>
> - `插件名`为必填项，会自动在开头补充`tinyjs-plugin-`，比如：输入`dust`，实际插件名是`tinyjs-plugin-dust`
> - `插件类型` 实际上是选择插件是作为 Class 开发，还是作为 Module 开发。

## 资源文件管理

tiny-cli 提供一套资源管理方案，执行 `tiny resource` 一键管理，非常方便易用。

### 生成 resources.js

配置 `tiny-app.config.js` 文件：

``` js
module.exports = {
  ...

  /**
   * 资源文件所在项目目录，如果就在根目录，此参数给空即可，如果不是，格式如：“alipay/tiny/games/”
   */
  appFold: '',

  /**
   * 生成的资源配置文件，只扫描 <res> 目录下的资源
   */
  resourceName: 'resources.js',

  /**
   * 生成的资源配置模版
   *
   * 默认是：
   * var RESOURCES = {
   *  <% list.forEach(function(item, i){ %>
   *  '<%= item.name %>': '<%= item.path %>',
   *  <% }); %>
   * };
   *
   * 也可以输出成 ES6：
   * <% list.forEach(function(item, i){ %>
   * import <%= item.name %> from '<%= item.path %>';
   * <% }); %>
   * export {
   * <% list.forEach(function(item, i){ %>
   *   <%= item.name %>,
   * <% }); %>
   * };
   */
  resourceTemplate: '', //为空会使用默认模版
  ...
};
```

- **appFold**：资源文件所在的项目目录，比如：项目目录是 `myFirstGame`，那么就会去找 `myFirstGame/res` 下的所有目录及里面的资源。是的，`res` 是规定，项目下没有就无效
- **resourceName**： 资源配置文件名，默认是 `resources.js`，那么执行 `tiny resource` 就会在 `myFirstGame/src` 下生成 `resources.js`，文件内容规则会按照 `resourceTemplate` 配置的模版输入
- **resourceTemplate**：生成的资源配置模版，输入的变量是 `list: [{name, path}]`，其中 `name` 会转换文件后缀为全大写，并移除资源文件名中的空格和"-"等（`/\s|-|\./ig`），如：`info-bubble 1.png` => `infobubble1PNG`

使用资源文件：

``` js
var sprite = Tiny.Sprite.fromImage(RESOURCES['infobubble1PNG']);
// 或
var sprite = new Tiny.Sprite(Tiny.TextureCache['infobubble1PNG']);

// resourceTemplate 为 ES6 的模版
const sprite = new Tiny.Sprite(Tiny.TextureCache[infobubble1PNG])
```

### 生成 tileset 文件

> 此功能依赖 [ImageMagick](https://www.imagemagick.org)，所以使用之前请确认是否已经安装，识别方法：`which convert` 或 `which identify`。
> 如果没有安装，OSX 设备可以通过 brew 快速安装：`brew install imagemagick`

假设我们的资源文件目录为：

``` bash
.
├── frame
│   ├── animals
│   │   ├── ant.png
│   │   ├── bee.png
│   │   └── bird.png
│   └── enemies
│       ├── 1.png
│       ├── 2.png
│       └── 3.png
└── images
    ├── bg.png
    ├── cloud.png
    ├── logo.png
    └── mask.png

```

配置 `tiny-app.config.js` 文件：

``` js
module.exports = {
  ...
  /**
   * tileset 通用配置，会 Assign 这个，对于多个 tileset 较友好
   */
  tilesetDefault: {
    fold: 'res/images', //默认为：{appFold}/res/images，自定义如：res/images/animals
    name: '', //默认为：tileset
    trim: false, //是否移除图片周边的透明空白，默认为：false
    padding: 2, //图片与图片的间距，默认为：0
    outFold: '', //默认为：{appFold}/res/tileset
  },

  tileset: [ {
    fold: 'res/frame/animals',
    name: 'mole_tile',
    trim: true,
    padding: 10,
    outFold: 'res/animals',
  }, {
    fold: 'res/frame/enemies',
  }, {
    fold: '',
    name: 'vendor',
  } ],
  ...
};
```

- **tilesetDefault**：`tileset` 的通用配置，方便配置多个 tileset
  - **fold**：资源集合所在目录
  - **name**：生成的 tileset 文件名
  - **trim**：是否移除子图片周围的透明空白
  - **padding**：每个子图片直接的间距
  - **outFold**：生成的文件输出目录
- **tileset**：各个 tileset 的配置数组

执行 `tiny resource` 后的目录结构为：

``` bash
.
├── animals
│   ├── mole_tile.json
│   └── mole_tile.png
├── frame
├── images
└── tileset
    ├── tileset_enemies.json
    ├── tileset_enemies.png
    ├── vendor.json
    └── vendor.png

```

假设我们的项目目录是 `myFirstGame`，在根目录下执行 `tiny resource` 就会在 `myFirstGame/res/animals` 下生成两个文件 `mole_tile.json` 和 `mole_tile.png`，生成的文件的文件名就是 `tiny-app.config.js` 里配置的 `tileset -> name`。
其中 `mole_tile.png` 是一张雪碧图，是组合了 `tileset -> fold` 下的所有图片，`mole_tile.json` 是各个子图片的相关属性的定义，使用的方式也很简单。

了解更多，请移步 [进阶文档](http://tinyjs.net/guide/advanced-displays-sprite.html)「`显示对象->精灵->使用 tileset`」

## 其他

Tiny.js 是一款轻量级 HTML5 2D 游戏引擎，[了解更多？](http://tinyjs.net)
