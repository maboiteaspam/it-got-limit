# it got limit

A stream to limit rate of concurrent requests processed
with `got` http module.

## Install

```sh
    npm i maboiteaspam/it-got-limit
```

## API

It s a stream transform made with `through2`.

You input url, it produces got object at given rate.

###### itGotLimit (limit, asStream)

_limit_ : maximum number of simultaneous request.

_asStream_ : receive data as a stream, or a callback (got.stream(url) || got(url).then(fn) )


File: __example.js__
```js
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
```

## Read More

- https://github.com/sindresorhus/got
- https://github.com/rvagg/through2
