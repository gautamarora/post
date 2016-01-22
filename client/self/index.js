var core = require('@gautamarora/core');
var $ = core.$;
var globalBus = core.globalBus;
var localBus = require('../../utils/local-bus');

module.exports.init = function() {
  if(!window.microapps.post) return false;
  console.log('post self init');
};