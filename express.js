var express = require('express');
var app = express.createServer();
var sockets = require('socket.io').listen(app);
var models = require('./lib/models.js');
app.configure(function () {
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
  app.set('views', __dirname + '/templates');
  app.set('view engine', 'ejs');
});
app.get('/', function (req, res) {
  res.render('index');
});
var empty = {};
var mongo = models.mongoose;
sockets.on('connection', function (socket) {
  var settings = {};
  socket.on('getData', function (data) {
    var tmp = mongo.model(data.stats, new mongo.Schema(empty));
    if (data.key !== undefined) {
      var search = {};
      if (data.key) {
        search.key = {'$all': data.key.split(',')};
      }
      if (data.treshold_min) {
        search.value = {'$gt': parseInt(data.treshold_min, 10)};
      }
      if (data.treshold_max) {
        search.value = {'$lt': parseInt(data.treshold_min, 10)};
      }
      console.dir(search);
      tmp.find(search).asc('date').run(function (err, docs) {
        socket.emit(data.stats, JSON.stringify(docs));
      });
    } else {
      tmp.find({}).asc('date').run(function (err, docs) {
        socket.emit(data.stats, JSON.stringify(docs));
      });
    }
  });
});
module.exports = app;
