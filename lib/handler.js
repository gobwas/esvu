var inherits = require('inherits-js'),
    assert   = require("assert"),
    _        = require('lodash');

/**
 * @class Handler
 * @constructor
 * @abstract
 *
 * @param {Object} [options]
 */
function Handler(options) {
    this.options = _.extend({}, this.constructor.DEFAULTS, options);
}

Handler.prototype = {
    constructor: Handler,

    /**
     * @abstract
     */
    test: function(node, parent) {
        throw new TypeError("Method 'test' must be implemented");
    }
};

Handler.DEFAULTS = {};

Handler.extend = function(proto, statics) {
    return inherits(this, proto, statics);
};

module.exports = Handler;