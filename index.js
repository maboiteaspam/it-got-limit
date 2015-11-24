
var through2 = require('through2');
var got = require('got');

var debug = require('debug')('it-got-limit');

module.exports = function (limit, asEvent) {

  asStream = !!asStream;
  limit = limit && parseInt(limit) || 2;

  debug("limit=%s", limit);

  var curTasks = [];
  var pendTasks = [];
  var stream;

  var fetchUrl = function (o) {
    var url = o.url;
    var fn = o.fn;
    debug("fetch = %s", url);
    var d = {url:url, got:asStream?got.stream(url):got(url)};
    fn(d)
    return d;
  };
  var noOp = function (o) {
    var url = o.url;
    var fn = o.fn;
    debug("noOp = %s", url);
    setTimeout(function (){
      debug("noOp done = %s", url);
      fn({url:url, error:null, response:null})
    }, getRandomInt(250, 750))
  };
  var processMore = function (processFn){
    if (pendTasks.length) {
      debug("curTasks / pendTasks = %s / %s", curTasks.length, pendTasks.length);
      if(curTasks.length<limit && pendTasks.length) {
        var o = pendTasks.shift();
        curTasks.push(o);
        var got = processFn(o).got;
        var doneMoveNext = function () {
          curTasks.shift()
          processMore(processFn)
        };
        if (got.then) {
          got.then(doneMoveNext)
            .catch(doneMoveNext)
        } else {
          got.on('error', doneMoveNext)
            .on('data', function(){})
            .on('end', doneMoveNext)
        }
      }
    }
  };
  stream = through2.obj(function (chunk, enc, cb) {
    var that = this;

    var hasUseCb = curTasks.length<limit;
    pendTasks.push({
      url: chunk,
      fn: function (response){
        if (hasUseCb) that.push(response)
        else cb(null, response)
      }
    });
    if (hasUseCb) cb(null);
    processMore(fetchUrl);

  }, function (cb) {
    var t = function () {
      if(!pendTasks.length && !curTasks.length) {
        cb()
      } else {
        setTimeout(t, 5)
      }
    };
    t();
  });

  return stream;
};
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}