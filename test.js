#!/usr/bin/env node

var minimist = require('minimist')(process.argv.slice(2));

if (minimist.verbose || minimist.v)
  process.env['DEBUG'] = 'it-got-limit';

var through2 = require('through2')
var itGotLimit = require('./index');
var terrorist = require('./terrorist');
var debug = require('debug')('it-got-limit');

var limit = minimist.limit || 3
var httpPort = minimist.port || 9615
var httpHost = minimist.host || '0.0.0.0'

var hb = terrorist(httpPort, httpHost, limit)

var stream = itGotLimit(limit);

stream.on('end', function (){
  hb.close()
})

stream
  .pipe(through2.obj(function (chunk, enc, cb) {
    debug('url=%s len=%s error%s', chunk.url, !!chunk.response, !!chunk.error)
    cb(null, chunk)
  }))
  .pipe(through2.obj(function (chunk, enc, cb) {
    //debug('url=%s len=%s error%s', chunk.url, !!chunk.response, !!chunk.error)
    cb()
  }, function () {
    debug('All done')
  }))


for(var i=0;i<20;i++) {
  stream.write('http://'+httpHost+':'+httpPort+'/'+i)
}

stream.end()
