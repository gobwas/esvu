var Handler = require("../handler"),
    assert   = require("assert"),
    _        = require("lodash"),
    MineHandler;

/**
 * @class MineHandler
 * @extends Handler
 */
MineHandler = Handler.extend(
    /**
     * @lends MineHandler.prototype
     */
    {
        test: function(node, parent) {
            return node.type == "MemberExpression";
        },

        getHash: function(node, parent) {
            if (!this.test(node, parent)) {
                throw new Error("Could not get mine ID from node '" + node.type + "' of '" + parent.type + "' parent");
            }

            return {
                id:       node.object,
                property: node.property
            };
        }
    }
);

module.exports = MineHandler;