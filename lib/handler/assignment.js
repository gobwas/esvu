var Handler = require("../handler"),
    assert   = require("assert"),
    _        = require("lodash"),
    AssignmentHandler;

/**
 * @class AssignmentHandler
 * @extends Handler
 */
AssignmentHandler = Handler.extend(
    /**
     * @lends AssignmentHandler.prototype
     */
    {
        test: function(node, parent) {
            try {
                this.getHash(node, parent);
                return true;
            } catch (err) {
                return false;
            }
        }
    }
);

module.exports = AssignmentHandler;