var Assignment = require("../assignment"),
    assert   = require("assert"),
    _        = require("lodash"),
    DeclarationAssignment;

/**
 * @class DeclarationAssignment
 * @extends Assignment
 */
DeclarationAssignment = Assignment.extend(
    /**
     * @lends DeclarationAssignment.prototype
     */
    {
        getHash: function(node, parent) {
            if (node.type == "VariableDeclarator") {
                return {
                    id:    node.id,
                    value: node.init
                };
            }

            throw new Error("Could not get Declaration hash from '" + node.type + "'");
        }
    }
);

module.exports = DeclarationAssignment;