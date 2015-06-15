var Parser   = require("../lib/parser"),
    Target   = require("../lib/id").Target,
    Variable = require("../lib/id").Variable,
    Property = require("../lib/id").Property,
    Binding  = require("../lib/id").Binding,
    Call     = require("../lib/id").Call,
    Context  = require("../lib/context"),
    fs       = require("fs"),
    path     = require("path"),
    honey    = require("json-honey"),
    _        = require("lodash"),
    parser, context;


function propLogger(binding, isChain) {
    binding.on("property", function(property) {
        property.on("binding", function(binding) {
            if (_.isUndefined(binding.value)) {
                binding.on("call", function(call) {
                    console.log("call", property.id.name);

                    if (isChain || property.id.name == "chain") {
                        propLogger(call, true);
                    }
                });
            }
        });
    });
}

parser = new Parser;
context = new Context();

context.on("scope", function(scope) {
    scope.on("variable", function(variable) {
        variable.on("binding", function(binding) {
            if (binding.value instanceof Call) {
                var isLodash;

                try {
                    isLodash = binding.value.arguments[0].value == "lodash";
                } catch (err) {
                    isLodash = false;
                }

                if (isLodash) {
                    propLogger(binding);
                }
            }
        });
    });
});


parser.parse(fs.readFileSync(path.resolve(__dirname, "./fixture/test.js")), context);

console.log(honey(context, { circular: true }));