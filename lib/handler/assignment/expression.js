var Assignment = require("../assignment"),
    assert   = require("assert"),
    _        = require("lodash"),
    ExpressionAssignment;

/**
 * @class ExpressionAssignment
 * @extends Assignment
 */
ExpressionAssignment = Assignment.extend(
    /**
     * @lends ExpressionAssignment.prototype
     */
    {
        getHash: function(node, parent) {
            if (node.type == "AssignmentExpression" && node.operator == "=") {
                return {
                    id:       node.left,
                    value:    node.right,
                    operator: node.operator
                };
            }

            throw new Error("Could not get expression hash from '" + node.type + "'");
        }
    }
);

module.exports = ExpressionAssignment;