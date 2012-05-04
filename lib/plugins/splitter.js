var _ = require('underscore');
function getCurrentStatDate() {
  return new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDay(), (new Date()).getHours());
}
var splitterModel = {
  'date': {'type': Date, 'default': getCurrentStatDate(), 'index': true },
  'key': [String],
  'value': {'type': Number, 'default': 0}
};
module.exports = {
  'configure': function (mongoose) {
    return function (model) {
      model.pre('save', function (next) {
        var Splitter = new mongoose.Schema(splitterModel);
        var SplitterCollection = mongoose.model(this.eventName.replace('counter::', ''), Splitter);
        for (var i in this.data) {
          (function (i, data) {
            SplitterCollection.update({'key': i.split('|').join('.').split('::'), 'date': getCurrentStatDate()}, {'$inc': {'value': data}}, {'upsert': true}, function (err, something) {});
          }(i, this.data[i]));
        }
        next();
      });
    };
  }
};
