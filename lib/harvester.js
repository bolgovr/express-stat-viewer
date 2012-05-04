var request = require('request');
var async = require('async');

var Harvester = function (options) {
  this.hosts = [];
  for (var i = 0; i < options.hosts.length; i++) {
    console.log("adding " + options.hosts[i] + " for watching");
    this.hosts.push(this._harvestOne.bind(this, options.hosts[i]));
  }
  this.pollingInterval = options.pollingInterval || (60 * 1000);
  this.interval = null;
};

Harvester.prototype._harvestOne = function (host, callback) {
  request.get(host, function (err, response, body) {
    if (!err && response.statusCode === 200) {
      var result = {};
      try {
        result = JSON.parse(body);
      } catch (e) {
        return  callback(e);
      }
      return callback(null, result);
    } else {
      callback(err);
    }
  });
};
Harvester.prototype.harvest = function (callback) {
  async.parallel(this.hosts, callback);
};
Harvester.prototype.getStream = function (callback) {
  console.log('start polling hosts with timeout ' + this.pollingInterval);
  this.interval = setInterval(this.harvest.bind(this, callback), this.pollingInterval);
};
module.exports = {
  'start': function (options) {
    return new Harvester(options);
  }
};
