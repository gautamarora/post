var pkg = require('../../../package');
var db = require('../../db');
var md = require('markdown-it')();

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
  core.renderTemplate(__dirname, 'post', res.data, function (err, html) {
    if (err) return next(err);
    return res.send(html);
  });
}

module.exports = function(app) {
  app.get('/posts/:id', function getData(req, res) {
    res.data = {};
    db.getOne('post', req.params.id, function(err, data) {
      data.body = md.render(data.body);
      res.data.db = data;
      processData(req, res, mergeData);
      core.processData('post', req, res, mergeData);
      header.processData('post', req, res, mergeData);
    });
  });
};