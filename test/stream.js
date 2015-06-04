var StreamParser = require("../lib/stream"),
    Writable     = require("stream").Writable,
    inherits     = require("inherits-js"),
    Reader;

Reader = inherits( Writable,
    {
        constructor: function() {
            Writable.prototype.constructor.call(this, { objectMode: true });
        },

        _write: function(chunk, enc, callback) {
            console.log('write', chunk);
            callback();
        }
    }
);


require("fs")
    .createReadStream("./test/fixture/test.js")
    .pipe(new StreamParser({ parser: { strict: false } }))
    .pipe(new Reader());