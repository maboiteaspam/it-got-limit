#!/usr/bin/env node

var spawn = require('child_process').spawn;

var terrorist = require('./terrorist');
var httpPort = 9615
var httpHost = '0.0.0.0'

var hb = terrorist(httpPort, httpHost, 2)

var p = spawn('node', ['./bin.js', '--verbose'],  { stdio: 'pipe' })

p.stdout.pipe(process.stdout)
p.stderr.pipe(process.stderr)

setTimeout(function () {
  p.stdin.write(new Array(10).join("http://127.0.0.1:9615/\n"))
  p.stdin.end();
}, 500);

p.stdout.on('close', function (){
  hb.close()
})
