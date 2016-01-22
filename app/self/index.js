var core = require('@gautamarora/core');
var header = require('@gautamarora/header');

module.exports.init = function (app, express) {
  console.log('post self init');
  core.registerRoutes(__dirname, 'routes', app, express); //express routes
  core.registerPartials(__dirname, 'partials', 'post'); //handlebars partials
  header.setInitialState({"sidebar":{"component": "post", "name": "posts", "url":"/posts"}});
};