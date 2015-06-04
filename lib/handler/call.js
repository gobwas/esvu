var Handler = require("../handler"),
    assert   = require("assert"),
    _        = require("lodash"),
    CallHandler;

/**
 * @class CallHandler
 * @extends Handler
 */
CallHandler = Handler.extend(
    /**
     * @lends CallHandler.prototype
     */
    {
        test: function(node, parent) {
            return parent && parent.type == "CallExpression" && node.type == "Identifier";
        },

        getHash: function(node, parent) {
            if (!this.test(node, parent)) {
                throw new Error("Could not get call ID from node '" + node.type + "' of '" + parent.type + "' parent");
            }

            return {
                id:        node,
                arguments: parent.arguments
            };
        }
    }
);

module.exports = CallHandler;