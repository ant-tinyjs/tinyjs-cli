'use strict';

const request = require('request');
const semver = require('semver');
const utils = require('../common/utils');
const pkg = require('../../package.json');

const Updator = function () {

};

Updator.prototype.update = function (callback) {
  callback = callback ||
    function () {
    };

  getLatestVersion(pkg.name, function (err, latestVersion) {
    if (err) return callback(err);
    let isOutdated = false;
    if (semver.gt(latestVersion, pkg.version)) {
      isOutdated = true;
    }
    callback(null, {
      pkgName: pkg.name,
      isOutdated,
      latest: latestVersion,
      current: pkg.version,
    });
  });
};

// function getLatestVersion(pkgName, callback) {
//   const latestUrl = [
//     'https://registry.npmjs.org',
//     pkgName, 'latest'].join('/');
//   request({
//     url: latestUrl,
//     timeout: 3000,
//     json: true,
//   }, function (err, res, body) {
//     if (err) return callback(err);
//     if (body.error) {
//       return callback(new Error(body.reason));
//     }
//     callback(null, body.version, body.updates || []);
//   });
// }

function getLatestVersion(pkgName, callback) {
  let latestVersion = utils.localStorage.get('latestVersion');
  if (latestVersion) {
    return callback(null, latestVersion);
  }
  request(utils.getDataOpts(pkgName), (err, res, body) => {
    try {
      latestVersion = body.result.result.version;
      utils.localStorage.set('latestVersion', latestVersion);
      callback(null, latestVersion);
    } catch (e) {
      return callback(err || e);
    }
  });
}

module.exports = new Updator();
