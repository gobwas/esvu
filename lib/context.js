var EventEmitter = require("events").EventEmitter,
    Scope        = require("./scope"),
    inherits     = require('inherits-js'),
    assert       = require("assert"),
    _            = require('lodash'),
    Context;


/**
 * @class Context
 * @extends EventEmitter
 */
Context = inherits( EventEmitter,
    /**
     * @lends Context.prototype
     */
    {
        constructor: function(options) {
            EventEmitter.prototype.constructor.call(this);

            this.options = _.extend({}, this.constructor.DEFAULTS, options);
            this.scopes = [];
        },

        add: function(id) {
            this.scope.add(id);
        },

        addGlobal: function(id) {
            this.global.add(id);
        },

        find: function(id, chain) {
            return this.scope.find(id, chain);
        },

        enter: function() {
            var self = this,
                scope;

            scope = new Scope(this.scope);

            if (this.scope) {
                this.scope.put(scope);
            } else {
                this.global = scope;
            }

            this.scopes.push(scope);
            this.scope = scope;

            this.emit("scope", scope);

            scope.on("scope", function(scope) {
                self.emit("scope", scope);
            });

            return scope;
        },

        leave: function() {
            var leaved;

            leaved = this.scopes.pop();

            this.scope = _.last(this.scopes);

            return leaved;
        },

        toJSON: function() {
            return _.omit(this, "scope", "global");
        }
    },

    /**
     * @lends Context
     */
    {
        extend: function(proto, statics) {
            return inherits(this, proto, statics);
        },

        DEFAULTS: {}
    }
);

module.exports = Context;