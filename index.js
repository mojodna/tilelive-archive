"use strict";

var fs = require("fs"),
    path = require("path"),
    stream = require("stream"),
    url = require("url"),
    zlib = require("zlib");

var base64 = require("base64-stream"),
    tar = require("tar");

module.exports = function(tilelive, options) {
  var prefix = "archive+";

  var Archive = function(uri, callback) {
    uri = url.parse(uri, true);

    uri.protocol = uri.protocol.replace(prefix, "");

    this.uri = uri;

    return callback(null, this);
  };

  Archive.prototype.createReadStream = function() {
    var p = this.uri.pathname,
        encoding = this.uri.query.encoding || null,
        source,
        readStream = new stream.PassThrough({
          objectMode: true
        });

    switch (this.uri.protocol.toLowerCase()) {
    case "file:":
      p = path.resolve(path.join(this.uri.host, p));
      source = fs.createReadStream(p);

      break;

    default:
      throw new Error("Unsupported protocol: " + this.uri.protocol);
    }

    if (path.extname(p).match("gz")) {
      source = source.pipe(zlib.createGunzip());
    }

    var parser = tar.Parse();

    source
      .pipe(parser)
      .on("entry", function(entry) {
        var coords = entry.props.path.split(".")[0].split("/");

        var obj = entry;

        if (encoding && encoding.toLowerCase() === "base64") {
          obj = entry.pipe(base64.decode());
        }

        obj.z = coords.shift() | 0;
        obj.x = coords.shift() | 0;
        obj.y = coords.shift() | 0;

        parser.pause();
        readStream.write(obj, function() {
          parser.resume();
        });
      })
      .on("end", function() {
        readStream.end();
      });

    return readStream;
  };

  Archive.registerProtocols = function(tilelive) {
    tilelive.protocols[prefix + "file:"] = this;
  };

  Archive.registerProtocols(tilelive);

  return Archive;
};
