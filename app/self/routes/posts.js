var pkg = require('../../../package');
var db = require('../../db');
var removeMd = require('remove-markdown');

var core = require('@gautamarora/core');
var header = require('@gautamarora/header');

var microapps = ['core', 'header'];

//pre-processing of the raw data based on the io response
function processData(req, res, cb) {
  res.data.post = {};
  res.data.post = res.data.db;
  cb(null, 'post', req, res);
}

function mergeData(err, microapp, req, res) {
  if(Object.keys(res.data).length === microapps.length + 2) { //+1 for self, +1 for db in the data map
    processMergedData(req, res);
  }
}

//post-processing when you have data from all the modules
function processMergedData(req, res) {
  sendResponse(req, res);
}

function sendResponse(req, res) {
  core.renderTemplate(__dirname, 'posts', res.data, function (err, html) {
    if (err) return next(err);
    return res.send(html);
  });
}

module.exports = function(app) {
  //get package info
  app.get('/info/posts', function(req, res) {
    res.send({
      name: pkg.name,
      version: pkg.version,
      process: {
        title: process.title,
        pid: process.pid,
        version: process.version,
        arch: process.arch,
        platform: process.platform,
        memory: process.memoryUsage()
      },
      env: {
        NODE_ENV: process.env.NODE_ENV
      }
    });
  });
  
  app.get('/posts', function getData(req, res) {
    res.data = {};
    db.getAll('post', function(err, data) {
      var _data = [];
      Object.keys(data).sort().reverse().forEach(function(d) { //descending sort
        data[d].body = removeMd(data[d].body).replace(/\n/g, ' '); //cleanup md
        data[d].shortBody = data[d].body.split(' ').slice(0, 20).join(' ') + '...'; //create intro
        _data.push(data[d]);
      });
      res.data.db = _data;
      processData(req, res, mergeData);
      core.processData('post', req, res, mergeData);
      header.processData('post', req, res, mergeData);
    });
  });
};