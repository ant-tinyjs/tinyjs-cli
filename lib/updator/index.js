'use strict';

const request = require('request');
const semver = require('semver');
const pkg = require('../../package.json');

const Updator = function () {

};

Updator.prototype.update = function (callback) {
  callback = callback || function () {};

  getLatestVersion(pkg.name, function (err, latestVersion) {
    if (err) return callback(err);
    let isOutdated = false;
    if (semver.gt(latestVersion, pkg.version)) {
      isOutdated = true;
    }
    callback(null, {
      pkgName: pkg.name,
      isOutdated: isOutdated,
      latest: latestVersion,
      current: pkg.version,
    });
  });
};

function getLatestVersion(pkgName, callback) {
  const latestUrl = [
    'http://registry.npmjs.org',
    pkgName, 'latest'].join('/');
  request({
    url: latestUrl,
    timeout: 5000,
    json: true,
  }, function (err, res, body) {
    if (err) return callback(err);
    if (body.error) {
      return callback(new Error(body.reason));
    }
    callback(null, body.version, body.updates || []);
  });
}

module.exports = new Updator();
