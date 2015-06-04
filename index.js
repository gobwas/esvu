module.exports = {
    Parser:       require("./lib/parser"),
    Target:       require("./lib/id").Target,
    Variable:     require("./lib/id").Variable,
    Property:     require("./lib/id").Property,
    Call:         require("./lib/id").Call,
    Binding:      require("./lib/id").Binding,
    ParserStream: require("./lib/stream")
};