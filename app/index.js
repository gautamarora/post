var core = require('@gautamarora/core');
var header = require('@gautamarora/header');
var self = require('./self');

exports.initBrowserify = core.initBrowserify;
exports.initBrowserifyOptions = core.initBrowserifyBundleOpts;

module.exports.init = function(app, express) {
  console.log('post app init');
  core.initSass(__dirname);
  core.init(app, express);
  header.init(app, express);
  self.init(app, express);
};