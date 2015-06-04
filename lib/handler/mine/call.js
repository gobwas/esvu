var Mine   = require("../mine"),
    assert = require("assert"),
    _      = require("lodash"),
    CallMine;

/**
 * @class CallMine
 * @extends Mine
 */
CallMine = Mine.extend(
    /**
     * @lends CallMine.prototype
     */
    {
        test: function(node, parent) {
            return Mine.prototype.test.apply(this, arguments) && parent.type == "CallExpression";
        },

        getHash: function(node, parent) {
            return _.extend({
                arguments: parent.arguments
            }, Mine.prototype.getHash.apply(this, arguments));
        }
    }
);

module.exports = CallMine;