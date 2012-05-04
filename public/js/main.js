$(function () {
  $('.dropdown-toggle').dropdown();
  var socket = io.connect();
  var lastAccess = '';
  $('#setFilters').bind('click', function () {
    var obj = {
      'key': $('#key').val(),
      'treshold_min': $('#treshold_min').val(),
      'treshold_max': $('#treshold_max').val(),
      'stats': $('#stat option:selected').text()
    };
    socket.emit('getData', obj);
    socket.on(obj.stats, buildChart.bind({}));
  });
});
function buildChart(data) {
  var p = new Parser(data);
  var chart1 = new Highcharts.Chart({
    chart: {
      renderTo: 'container',
      type: 'line'
    },
      title: {
        text: 'Access'
      },
      xAxis: {
        categories: p.getCategories()
      },
      yAxis: {
        title: {
          text: 'Count'
        }
      },
      series: p.parse()
  });
}


var Parser = function (data) {
  this.data = JSON.parse(data);
};
Parser.prototype.getCategories = function () {
  return _.pluck(this.data, 'date');
};
Parser.prototype.parse = function () {
  var result = {};
  _.each(this.data, function (elem) {
    var key = elem.key.join('::');
    if (!result[key]) {
      result[key] = {
        'name': key,
        'data': [elem.value]
      };
    } else {
      result[key].data.push(elem.value);
    }
  });
  return _.values(result);
};
