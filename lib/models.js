var mongoose = require('mongoose');
var config = require('config');
mongoose.connect('mongodb://' + config.mongodb.host + '/' + config.mongodb.db);
var plugins = require('./plugins.js').getPlugins(mongoose);
module.exports = {
  'RawData': require('./models/rawData.js').configure(mongoose, plugins),
  'mongoose': mongoose
};

