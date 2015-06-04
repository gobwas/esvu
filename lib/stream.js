var Parser   = require("./parser"),
    stream   = require("stream"),
    inherits = require("inherits-js"),
    _        = require("lodash"),
    StreamParser;


StreamParser = inherits( stream.Transform,
    /**
     * @lends StreamParser.prototype
     */
    {
        constructor: function(options) {
            stream.Transform.call(this, { readableObjectMode: true });
            this.options = _.extend({}, this.constructor.DEFAULTS, options);
            this.buffer = [];
        },

        _transform: function(chunk, enc, done) {
            this.buffer.push(chunk);
            done();
        },

        _flush: function(done) {
            var buffer, context;

            buffer = Buffer.concat(this.buffer);

            context = (new Parser(this.options.parser)).parse(buffer.toString());

            this.push(context);

            done();
        }
    },

    /**
     * @lends StreamParser
     */
    {
        extend: function(proto, statics) {
            return inherits(this, proto, statics);
        },

        DEFAULTS: {}
    }
);

module.exports = StreamParser;