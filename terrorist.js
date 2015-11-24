
var http = require('http');

var debug = require('debug')('it-got-limit');


module.exports = function (httpPort, httpHost, max) {

  max = max && parseInt(max) || 5;
  var c = 0

  var server = http.createServer(function (req, res) {
    debug('hit!')
    c++; if (c>max) throw 'boom !';
    res.write('co start '+c+'\n');
    debug('co start %s', c)
    res.write('tac tac tac tac !!\n');
    setTimeout(function () {
      res.write('co end '+c+'\n');
      debug('co end %s', c)
      c--;
      res.end('\n');
    }, getRandomInt(200, 5*getRandomInt(100, 200)));
  }).listen(httpPort, httpHost);

  console.log('server started http://%s:%s', httpHost, httpPort)

  return server
};
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
