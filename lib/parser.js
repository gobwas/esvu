var EventEmitter                 = require("events").EventEmitter,
    Context                      = require("./context"),
    Variable                     = require("./id").Variable,
    Call                         = require("./id").Call,
    Handler                      = require("./handler"),
    ExpressionAssignmentHandler  = require("./handler/assignment/expression"),
    DeclarationAssignmentHandler = require("./handler/assignment/declaration"),
    FunctionAssignmentHandler    = require("./handler/assignment/function"),
    MineHandler                  = require("./handler/mine"),
    CallMineHandler              = require("./handler/mine/call"),
    CallHandler                  = require("./handler/call"),
    FnBlockHandler               = require("./handler/block/fn"),
    esprima                      = require("esprima"),
    estraverse                   = require("estraverse"),
    inherits                     = require("inherits-js"),
    _                            = require("lodash"),
    assert                       = require("assert"),
    Parser;


/**
 * @class Parser
 * @extends EventEmitter
 */
Parser = inherits( EventEmitter,
    /**
     * @lends Parser.prototype
     */
    {
        constructor: function(options) {
            EventEmitter.prototype.constructor.call(this);
            this.options = _.extend({}, this.constructor.DEFAULTS, options);
        },

        parse: function(code, context) {
            var self = this,
                ast, enter, leave;

            ast = esprima.parse(code);

            assert(context instanceof Context, "Context is expected");

            enter = [];
            leave = [];

            //scopeMap = new Map();
            //enter.push(function(handler, node, parent) {
            //    scopeMap.set(node, context.scope);
            //});

            context.enter();

            enter.push([
                new FunctionAssignmentHandler(),
                function(handler, node, parent) {
                    var id, hash, variable;

                    hash = handler.getHash(node);

                    if (id = context.find(hash.id)) {
                        //console.log('func overwrites declaration');
                        id.setBinding(hash.value);
                    } else {
                        context.add(variable = new Variable(hash.id));

                        if (hash.value) {
                            variable.setBinding(hash.value._resolved || hash.value);
                        }
                    }
                }
            ]);

            enter.push([
                new FnBlockHandler(),
                function(handler, node, parent) {
                    var parameters;

                    parameters = handler.getID(node, parent);

                    context.enter();
                    parameters.forEach(function(id) {
                        context.add(new Variable(id));
                    });
                }
            ]);

            leave.push([
                new DeclarationAssignmentHandler(),
                function(handler, node, parent) {
                    var id, hash, variable;


                    hash = handler.getHash(node);

                    if (id = context.find(hash.id)) {
                        //console.log('var overwrites declaration');
                        id.setBinding(hash.value);
                    } else {
                        //console.log('decl', require("json-honey")(hash, {circular: true}));
                        context.add(variable = new Variable(hash.id));

                        if (hash.value) {
                            variable.setBinding(hash.value._resolved || hash.value);
                        }
                    }
                }
            ]);

            leave.push([
                new ExpressionAssignmentHandler(),
                function(handler, node, parent) {
                    var id, hash;

                    hash = handler.getHash(node);

                    if (!(id = hash.id._resolved) && !(id = context.find(hash.id))) {
                        if (self.options.strict) {
                            throw new SyntaxError("Non strict assignment expression");
                        }

                        context.addGlobal(id = new Variable(hash.id));
                    }

                    id.setBinding(hash.value._resolved || hash.value);
                    //id.setBinding(hash.value);
                }
            ]);

            leave.push([
                new CallHandler(),
                function(handler, node, parent) {
                    var hash, id;

                    hash = handler.getHash(node, parent);

                    if (!(id = context.find(hash.id, true))) {
                        if (self.options.strict) {
                            throw new SyntaxError("Calling unknown function/variable");
                        }

                        context.addGlobal(id = new Variable(hash.id));
                    }

                    parent._resolved = id.addCall(hash.arguments);
                }
            ]);

            leave.push([
                new CallMineHandler(),
                function(handler, node, parent) {
                    var hash, id;

                    hash = handler.getHash(node, parent);

                    if (!(id = hash.id._resolved) && !(id = context.find(hash.id, true))) {
                        //console.log('Calling property of unknown variable');
                        return false;
                    }

                    parent._resolved = id
                        .addMining(hash.property)
                        .addCall(hash.arguments);

                    return false;
                }
            ]);

            leave.push([
                new MineHandler(),
                function(handler, node, parent) {
                    var hash, id;

                    hash = handler.getHash(node, parent);

                    if (!(id = hash.id._resolved) && !(id = context.find(hash.id, true))) {
                        if (self.options.strict) {
                            throw new SyntaxError("Mining property of unknown variable");
                        }

                        context.addGlobal(id = new Variable(hash.id));
                    }

                    node._resolved = id.addMining(hash.property);
                }
            ]);

            leave.push([
                new FnBlockHandler(),
                function(handler, node, parent) {
                    context.leave();
                }
            ]);


            function run(ware, node, parent) {
                var i, len,
                    def, handler, controller;

                len = ware.length;

                for (i = 0; i < len; i++) {
                    def = ware[i];

                    if (_.isFunction(def)) {
                        controller = def;
                    } else {
                        handler    = def[0];
                        controller = def[1];
                    }

                    if (handler instanceof Handler && !handler.test(node, parent)) {
                        continue;
                    }

                    if (controller.call(null, handler, node, parent) === false) {
                        break;
                    }
                }
            }

            estraverse.traverse( ast, {
                enter: function(node, parent) {
                    run(enter, node, parent);
                },
                leave: function(node, parent) {
                    run(leave, node, parent);
                }
            });


            return context;
        }
    },

    /**
     * @lends Parser
     */
    {
        extend: function(proto, statics) {
            return inherits(this, proto, statics);
        },

        DEFAULTS: {
            strict: false
        }
    }
);

module.exports = Parser;