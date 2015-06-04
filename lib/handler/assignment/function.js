var Assignment = require("../assignment"),
    assert   = require("assert"),
    _        = require("lodash"),
    FunctionAssignment;

/**
 * @class FunctionAssignment
 * @extends Assignment
 */
FunctionAssignment = Assignment.extend(
    /**
     * @lends FunctionAssignment.prototype
     */
    {
        getHash: function(node, parent) {
            if (node.type == "FunctionDeclaration") {
                return {
                    id:    node.id,
                    value: node
                };
            }

            throw new Error("Could not get function hash from '" + node.type + "'");
        }
    }
);

module.exports = FunctionAssignment;