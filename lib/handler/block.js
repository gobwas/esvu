var Handler = require("../handler"),
    assert   = require("assert"),
    _        = require("lodash"),
    BlockHandler;

/**
 * @class BlockHandler
 * @extends Handler
 */
BlockHandler = Handler.extend(
    /**
     * @lends BlockHandler.prototype
     */
    {
        test: function(node, parent) {
            return node.type == "BlockStatement";
        },

        /**
         * @abstract
         */
        getID: function(node, parent) {
            throw new TypeError("Method 'getID' must be implemented");
        }
    }
);

module.exports = BlockHandler;