module.exports = {
  'configure': function (mongoose, plugins) {
    var RawData = new mongoose.Schema({
      'eventName': {'type': String, 'index': true, 'required': true},
      'created_at': {'type': Date, 'default': Date.now()},
      'startDate': Date,
      'endDate': Date,
      'total': {'type': Number, 'required': true},
      'data': {}
    });
    RawData.statics.setData = function (dataObj, callback) {
      var instance = new this();
      instance.eventName = dataObj.eventName;
      instance.startDate = new Date(dataObj.start);
      instance.endDate = new Date(dataObj.end);
      instance.total = dataObj.total;
      delete dataObj.start;
      delete dataObj.end;
      delete dataObj.eventName;
      delete dataObj.total;
      var data = {};
      for (var i in dataObj) {
        data[i.split('.').join('|')] = dataObj[i];
      }
      instance.data = data;
      instance.save(callback);
    };
    if (plugins) {
      for (var i = 0; i < plugins.length; i++) {
        RawData.plugin(plugins[i]);
      }
    }
    return mongoose.model('rawData', RawData);
  }
};
