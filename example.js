
var through2 = require('through2');
var itGotLimit = require('it-got-limit');

var limit = 2;
var asStream = false;

var stream = itGotLimit(limit, asStream);

stream.on('end', function (){
  console.log('all done');
})

stream
  .pipe(through2.obj(function (chunk, enc, cb) {
    // it produces http responses
    console.log(chunk.url);
    console.log(chunk.got);
    if (asStream) {
      chunk.got
        .pipe(process.stdout)
        .on('error', function (err){

        });
    } else {
      chunk.got
        .then(function(response){})
        .catch(function(response){
          cb(null, chunk)
        });
    }
  }))

// it expects url string
stream.write('http://somewhere.com/')
stream.write('http://somewhere.com/')
stream.write('http://somewhere.com/')
stream.write('http://somewhere.com/')

stream.end()