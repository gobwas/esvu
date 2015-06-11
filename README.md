#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> ECMAScript Variable Usage


## Install

```sh
$ npm install --save esvu
```


## Usage

```js
var Parser = require('esvu').Parser,
    Context = require('esvu').Context,
    context, parser;

context = new Context();    
parser = new Parser();

parser.parse("my js code", context);

console.log(context); // your variable usage tree here 

```

## API

### Parser

##### parser.parse(`code`: `String`, `context`: `Context`); 


## License

MIT © [Sergey Kamardin](https://github.com/gobwas)


[npm-image]: https://badge.fury.io/js/esvu.svg
[npm-url]: https://npmjs.org/package/esvu
[travis-image]: https://travis-ci.org/gobwas/esvu.svg?branch=master
[travis-url]: https://travis-ci.org/gobwas/esvu
[daviddm-image]: https://david-dm.org/gobwas/esvu.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/gobwas/esvu