var Harvester = require('./lib/harvester.js');
var _ = require('underscore');
var models = require('./lib/models.js');
var rawData = models.RawData;
var config = require('config');
var harvest = require('./lib/harvester.js').start(config.stats);
var expressApp = require('./express.js');
expressApp.listen(config.app.port);

harvest.getStream(function (err, data) {
  data = data[0];
  if (data && !_.isEmpty(data)) {
    data.forEach(function (dataObject) {
      rawData.setData(dataObject, function () {});
    });
  } else {
  }
});
