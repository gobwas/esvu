var EventEmitter = require("events").EventEmitter,
    Variable     = require("./id").Variable,
    inherits     = require('inherits-js'),
    assert       = require("assert"),
    _            = require('lodash'),
    Scope;

/**
 * @class Scope
 * @extends EventEmitter
 */
Scope = inherits( EventEmitter,
    /**
     * @lends Scope.prototype
     */
    {
        constructor: function(parent) {
            EventEmitter.prototype.constructor.call(this);

            assert(_.isUndefined(parent) || parent instanceof Scope, "Parent is expected to be a Scope");

            this.variables = [];
            this.scopes = [];
            this.parent = parent;
        },

        put: function(scope) {
            assert(scope instanceof Scope, "Scope is expected");
            this.scopes.push(scope);

            this.emit("scope", scope);
        },

        add: function(variable) {
            assert(variable instanceof Variable, "Variable is expected");
            this.variables.push(variable);

            this.emit("variable", variable);
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
    },
    /**
     * @lends Scope
     */
    {
        extend: function(proto, statics) {
            return inherits(this, proto, statics);
        }
    }
);

module.exports = Scope;