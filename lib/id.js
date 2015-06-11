var EventEmitter = require("events").EventEmitter,
    inherits     = require('inherits-js'),
    assert       = require("assert"),
    _            = require('lodash'),
    Target, Variable, Property, Call, Binding;

/**
 * @class Target
 * @extends EventEmitter
 */
Target = inherits( EventEmitter,
    /**
     * @lends Target.prototype
     */
    {
        constructor: function() {
            EventEmitter.prototype.constructor.call(this);
            this.calls = [];
            this.properties = [];
        },

        addCall: function(arguments) {
            var call, exists;

            call = new Call(this, arguments);
            exists = _.find(this.calls, function(exists) {
                return exists.isEqual(call);
            });

            if (exists) {
                return exists;
            }

            this.calls.push(call);

            this.emit("call", call);

            return call;
        },

        addMining: function(prop) {
            var property, exists;

            property = new Property(this, prop);
            exists = _.find(this.properties, function(exists) {
                return exists.isEqual(property);
            });

            if (exists) {
                //exists.accessCount++;
                return exists;
            }

            this.properties.push(property);

            this.emit("property", property);

            return property;
        },

        isEqual: function(obj) {
            return this === obj;
        }
    },

    /**
     * @lends Target
     */
    {
        extend: function(proto, statics) {
            return inherits(this, proto, statics);
        }
    }
);


/**
 * @class Variable
 * @extends Target
 */
Variable = Target.extend(
    /**
     * @lends Variable.prototype
     */
    {
        constructor: function(id) {
            assert(_.isObject(id), "Id is expected to be an Object");

            Target.prototype.constructor.call(this);

            //this._type = "variable";

            this.id = id;
            this.bindings = [];
        },

        setBinding: function(value) {
            var binding;

            binding = new Binding(value);

            this.binding = binding;
            this.bindings.push(binding);

            this.emit("binding", binding);

            return this;
        },

        addMining: function(property) {
            if (!this.binding) {
                this.setBinding(undefined);
            }

            return this.binding.addMining(property);
        },

        addCall: function(arguments) {
            if (!this.binding) {
                this.setBinding(undefined);
            }

            return this.binding.addCall(arguments);
        },

        isEqual: function(obj) {
            var equal;

            equal = true;
            equal = equal && (obj instanceof this.constructor);
            equal = equal && _.isEqual(obj.id, this.id);

            return equal;
        },

        toJSON: function() {
            return _.omit(this, "binding");
        }
    }
);

/**
 * @class Property
 * @extends Variable
 */
Property = Variable.extend({
    constructor: function(parent, property) {
        Variable.prototype.constructor.call(this, property);
        this.parent = parent;
    }
});

/**
 * @class Call
 * @extends Target
 */
Call = Target.extend(
    /**
     * @lends Call.prototype
     */
    {
        constructor: function(parent, args) {
            Target.prototype.constructor.call(this);
            this.atype = "call";
            this.arguments = args;
            this.parent = parent;
        },

        isEqual: function(obj) {
            var equal;

            equal = true;
            equal = equal && (obj instanceof Call);
            equal = equal && _.isEqual(obj.arguments, this.arguments);

            return equal;
        }
    }
);

/**
 * @class Binding
 * @extends Target
 */
Binding = Target.extend(
    /**
     * @lends Binding.prototype
     */
    {
        constructor: function(value) {
            Target.prototype.constructor.call(this);
            this.value = value;
        },

        isEqual: function(obj) {
            var equal;

            equal = true;
            equal = equal && (obj instanceof this.constructor);
            equal = equal && _.isEqual(obj.value, this.value);

            return equal;
        }
    }
);


exports.Target   = Target;
exports.Variable = Variable;
exports.Property = Property;
exports.Call     = Call;
exports.Binding  = Binding;