'use strict';

const path = require('path');
const chalk = require('chalk');
const shell = require('shelljs');
const glob = require('glob');
const fs = require('fs-extra');

module.exports = {
  hint(type, msg) {
    if (!msg) {
      msg = type;
    }
    switch (type) {
      case 'error':
        console.log(chalk.red('[错误] ') + msg);
        break;
      case 'success':
        console.log(chalk.green('[成功] ') + msg);
        break;
      case 'info':
        console.log(chalk.cyan('[提示] ') + msg);
        break;
      case 'warn':
        console.log(chalk.yellow('[警告] ') + msg);
        break;
      default:
        console.log(chalk.grey(`${msg}`));
    }
  },
  doExec (cmd, silent, callback) {
    try {
      const ret = shell.exec(cmd, {silent: silent});
      //console.log(ret);
      if (ret.code === 0) {
        callback && callback(ret);
      } else {
        throw new Error(ret.stderr);
      }
    } catch (e) {
      throw new Error(e);
    }
  },
  copyTo: function (srcDir, destDir, data) {
    glob.sync('**', {
      cwd: srcDir,
      dot: true,
      ignore: ['**/**/.gitkeep'],
    }).forEach(function (file) {
      let fromPath = path.join(srcDir, file);
      let destPath = path.join(destDir, file);

      if (fs.statSync(fromPath).isDirectory()) {
        if (!fs.existsSync(destPath)) {
          // 创建文件夹
          fs.mkdirSync(destPath);
        }
      } else {
        // 复制文件并替换内容
        if (fromPath.endsWith('.png') ||
          fromPath.endsWith('.jpg') ||
          fromPath.endsWith('.jpeg') ||
          fromPath.endsWith('.gif') ||
          fromPath.endsWith('.svg') ||
          fromPath.endsWith('.webp')) {
          fs.copySync(fromPath, destPath);
          return;
        }
        let content = fs.readFileSync(fromPath).toString();
        for (let k in data) {
          let reg = new RegExp('<%=\\s*?' + k + '\\s*?%>', 'gi');
          if (reg.test(content)) {
            content = content.replace(reg, data[k]);
          }
        }
        // 将可能被忽略的变量替换为空字符串
        content = content.replace(/<%=\s*?[\w\d\-_]*\s*?%>/gi, '');
        // 写文件到当前目录
        fs.writeFileSync(destPath, content);
      }
    });
  },
};
