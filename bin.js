#!/usr/bin/env node

var minimist = require('minimist')(process.argv.slice(2));

if (minimist.verbose || minimist.v)
  process.env['DEBUG'] = 'it-got-limit';

var byline = require('byline')
var itGotLimit = require('./index');

process.stdin.setEncoding('utf8');

var stream = itGotLimit(minimist.length && parseInt(minimist.length) || 2);

byline(process.stdin).on('data', function(chunk) {
  if (chunk !== null) {
    stream.write(chunk);
  }
});

stream.on('end', function (){
  console.error('done')
})

stream.on('data', function (data){
  console.error('data')
  console.error(data.url)
  data.got.pipe(process.stdout)
})

process.stdin.on('end', function() {
  stream.end();
});
