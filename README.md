# tilelive-archive

Streaming reads from (compressed) tile tar archives.

## Usage

This example requires [@mojodna](https://github.com/mojodna)'s fork of
[`mbtiles`](https://github.com/mojodna/node-mbtiles) for `createWriteStream()`.

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

## Streaming?

For sparsely filled or unknown bounding boxes, iterating over a known list of
tiles is more efficient than using
a [`tilelive`](https://github.com/mapbox/tilelive.js) `Scheme`.

## `getInfo()`?

Err, yeah, that's not implemented yet. You'll want to fake it by generating
your own TileJSON separately.

## Base64 encoding?

My source tiles were base64 encoded (don't ask, or if you do, be prepared for
a story) and it was easier to transform them on the way out.

## How 'bout writing?

I'm not sure why you'd want to, but it's theoretically possible, assuming
[`node-tar`](https://github.com/isaacs/node-tar) does the right thing.
