var Variable = require("./id").Variable,
    inherits = require('inherits-js'),
    assert   = require("assert"),
    _        = require('lodash');

/**
 * @class Scope
 * @constructor
 * @abstract
 */
function Scope(parent) {
    assert(_.isUndefined(parent) || parent instanceof Scope, "Parent is expected to be a Scope");

    this.variables = [];
    this.scopes = [];
    this.parent = parent;
}

Scope.prototype = {
    constructor: Scope,

    put: function(scope) {
        assert(scope instanceof Scope, "Scope is expected");
        this.scopes.push(scope);
    },

    add: function(variable) {
        assert(variable instanceof Variable, "Variable is expected");
        this.variables.push(variable);
    },

    remove: function(id) {
        return _.remove(this.variables, this._identity(id));
    },

    find: function(id, chain) {
        var found;

        if (!(found = _.find(this.variables, this._identity(id))) && chain && this.parent) {
            return this.parent.find(id, true);
        }

        return found;
    },

    _identity: function(id) {
        return function(exists) {
            return _.isEqual(exists.id, id);
        }
    }
};

Scope.extend = function(proto, statics) {
    return inherits(this, proto, statics);
};

module.exports = Scope;