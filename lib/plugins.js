module.exports = {
  'getPlugins': function (mongoose, models) {
    return [
      require('./plugins/splitter.js').configure(mongoose, models)
    ];
  }
};
