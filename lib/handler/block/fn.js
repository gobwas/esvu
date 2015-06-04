var Block = require("../block"),
    assert   = require("assert"),
    _        = require("lodash"),
    FnBlock;

/**
 * @class FnBlock
 * @extends Block
 */
FnBlock = Block.extend(
    /**
     * @lends FnBlock.prototype
     */
    {
        test: function(node, parent) {
            var test;

            test = Block.prototype.test.apply(this, arguments);
            test = test && _.includes([
                "FunctionDeclaration",
                "FunctionExpression"
            ], parent.type);

            return test;
        },

        getID: function(node, parent) {
            if (!this.test(node, parent)) {
                throw new Error("Could not get block ID from node '" + node.type + "' of '" + parent.type + "' parent");
            }

            return parent.params;
        }
    }
);

module.exports = FnBlock;