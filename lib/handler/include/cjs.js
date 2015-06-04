var Include = require("../include"),
    assert  = require("assert"),
    _       = require("lodash"),
    CJSInclude;

/**
 * @class CJSInclude
 * @extends Include
 */
CJSInclude = Include.extend(
    /**
     * @lends CJSInclude.prototype
     */
    {
        test: function(node) {
            return node.type == "CallExpression" && node.callee.type == "Identifier" && node.callee.name == "require" && node.arguments[0].type == "Literal" && node.arguments[0].value == this.options.name
        }
    }
);

module.exports = CJSInclude;