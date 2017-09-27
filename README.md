# tinyjs-cli

## 简介

Tiny.js 本地开发工具， 使用命令行快速创建游戏项目、 生成资源配置文件等。

### 功能一览

```bash
-h, --help          查看帮助信息
-V, --version       查看版本信息
init                初始化 Tiny.js 项目
plugin              初始化 Tiny.js 插件库
resource            Resouce.js 生成器
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

  ![](https://zos.alipayobjects.com/rmsportal/bXkeJVrvbxoeAnOEPVmM.gif)
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

### 生成 Resource.js

配置 `tiny-app.config.js` 文件：

``` js
module.exports = {
  ...

  // 资源文件所在项目目录，如果就在根目录，此参数给空即可，如果不是，格式如：“alipay/tiny/games/”
  appFold: '',

  // 生成的资源配置文件
  resourceName: 'Resource.js',
  ...
};
```

其中 `appFold` 是资源文件所在的项目目录，比如：项目目录是 `myFirstGame`，那么就会去找 `myFirstGame/res` 下的所有目录及里面的资源。是的，`res` 是规定，项目下没有就无效。
`resourceName` 配置的是 `Resource.js`，那么执行 `tiny resource` 就会在 `myFirstGame/src` 下生成 `Resource.js`，文件内容规则如下：

``` js
var RESOURCES = {

// images,
"s_bg_jpg": "res/images/bg.jpg",

// sound
};
```

然后，你就可以通过全局变量 `RESOURCES` 来获取对应的资源，变量名规则是：`s_文件名_文件类型`，比如文件：mole.png，变量名就是：`s_mole_png`。

使用资源文件：

``` js
var background = Tiny.Sprite.fromImage(RESOURCES['s_bg_jpg']);
```

### 生成 tileset 文件

> 此功能依赖 [ImageMagick](https://www.imagemagick.org)，所以使用之前请确认是否已经安装，识别方法：`which convert` 或 `which identify`。
> 如果没有安装，OSX 设备可以通过 brew 快速安装：`brew install imagemagick`

配置 `tiny-app.config.js` 文件：

``` js
module.exports = {
  ...
  tileset: [{
    fold: 'res/images/animals',//默认为：{appFold}/res/images，自定义如：res/images/animals
    name: 'mole_tile',//默认为：tileset
    trim: false,//是否移除图片周边的透明空白，默认为：false
    padding: 2,//图片与图片的间距，默认为：0
    outFold: ''//默认为：{appFold}/res/images
  }, {
    fold: 'res/images/enemies',
  }],
  ...
};
```

假设我们的项目目录是 `myFirstGame`，在根目录下执行 `tiny resource` 就会在 `myFirstGame/res/images` 下生成两个文件 `mole_tile.json` 和 `mole_tile.png`，生成的文件的文件名就是 `tiny-app.config.js` 里配置的 `tileset -> name`。
其中 `mole_tile.png` 是一张雪碧图，是组合了 `tileset -> fold` 下的所有图片，`mole_tile.json` 是各个子图片的相关属性的定义，使用的方式也很简单。

了解更多，请移步 [进阶文档](http://tinyjs.net/#/tutorial/advanced/displays/sprite)「`displays->精灵->使用 tileset`」

## 其他

Tiny.js 是一款轻量级 HTML5 2D 游戏引擎，[了解更多？](http://tinyjs.net)
