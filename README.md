# tilelive-archive

Streaming reads from (compressed) tile tar archives.

## Usage

```javascript
"use strict";

var MBTiles = require("mbtiles"),
    tilelive = require("tilelive");

var Archive = require("tilelive-archive")(tilelive);

new Archive("archive+file://./tiles.tar.gz?encoding=base64", function(err, src) {
  new MBTiles("mbtiles://./tiles.mbtiles", function(err, sink) {
    src.createReadStream().pipe(sink.createWriteStream());
  });
});
```

## Why?

Tarballs are easy to make.

## Base64 encoding?

My source tiles were base64 encoded (don't ask, or if you do, be prepared for
a story) and it was easier to transform them on the way out.

## How 'bout writing?

I'm not sure why you'd want to, but it's theoretically possible (assuming
[`node-tar`](https://github.com/isaacs/node-tar) does the right thing).
