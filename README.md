# assemble-remarkable [![NPM version](https://img.shields.io/npm/v/assemble-remarkable.svg?style=flat)](https://www.npmjs.com/package/assemble-remarkable) [![NPM monthly downloads](https://img.shields.io/npm/dm/assemble-remarkable.svg?style=flat)](https://npmjs.org/package/assemble-remarkable) [![NPM total downloads](https://img.shields.io/npm/dt/assemble-remarkable.svg?style=flat)](https://npmjs.org/package/assemble-remarkable) [![Linux Build Status](https://img.shields.io/travis/assemble/assemble-remarkable.svg?style=flat&label=Travis)](https://travis-ci.org/assemble/assemble-remarkable)

> Assemble pipeline plugin for remarkable, the markdown converter for node.js. Can also be used with gulp.

You might also be interested in [gulp-breakdance](https://github.com/breakdance/gulp-breakdance).

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save assemble-remarkable
```

## Heads up!

Please report all bugs related to markdown-to-HTML conversion on the [remarkable issue tracker](https://github.com/remarkable/jonschlinkert/issues).

## Assemble usage

Visit [remarkable](http://github.com/jonschlinkert/remarkable) for all available features and options.

```js
var remarkable = require('assemble-remarkable');
var assemble = require('assemble');
var app = module.exports = assemble();

app.task('remarkable', function() {
  return app.src('foo/*.md')
    .pipe(remarkable([options]))
    .pipe(remarkable.unescape()) //<= optionally decode entities after converting to markdown
    .pipe(app.dest('bar'));
});
```

_(`.md` file extensions are automatically converted to `.html`)_

## Gulp usage

Visit [remarkable](http://github.com/jonschlinkert/remarkable) for all available features and options.

```js
var gulp = require('gulp');
var remarkable = require('assemble-remarkable');

gulp.task('remarkable', function() {
  return gulp.src('foo/*.md')
    .pipe(remarkable([options]))
    .pipe(remarkable.unescape()) //<= optionally decode entities after converting to markdown
    .pipe(gulp.dest('bar'));
});
```

_(`.md` file extensions are automatically converted to `.html`)_

## Options

This plugin uses the following defaults:

_(All options are passed to [remarkable](https://github.com/jonschlinkert/remarkable), and all other defaults besides those listed below are the same as remarkable's defaults.)_

```js
var defaults = {
  html: true,
  linkify: true,
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, code).value;
      } catch (err) {}
    }

    try {
      return hljs.highlightAuto(code).value;
    } catch (err) {}
    return code;
  }
};
```

### options.highlight

_(Differs from remarkable defaults)_

[highlight.js](https://highlightjs.org/) is used for highlighting code examples by default. Override this or disable it by setting `options.highlight` to `false` or any value supported by remarkable.

```js
// disable highlighting
remarkable({highlight: false});

// custom highlighting
remarkable({
  highlight: function() {
    // do highlighting stuff
  }
});
```

## About

### Related projects

* [breakdance](https://www.npmjs.com/package/breakdance): Breakdance is a node.js library for converting HTML to markdown. Highly pluggable, flexible and easy… [more](http://breakdance.io) | [homepage](http://breakdance.io "Breakdance is a node.js library for converting HTML to markdown. Highly pluggable, flexible and easy to use. It's time for your markup to get down.")
* [gulp-html-toc](https://www.npmjs.com/package/gulp-html-toc): Gulp plugin for html-toc, for generating a HTML table of contents. | [homepage](https://github.com/jonschlinkert/gulp-html-toc "Gulp plugin for html-toc, for generating a HTML table of contents.")
* [gulp-htmlmin](https://www.npmjs.com/package/gulp-htmlmin): gulp plugin to minify HTML. | [homepage](https://github.com/jonschlinkert/gulp-htmlmin#readme "gulp plugin to minify HTML.")
* [gulp-remarkable](https://www.npmjs.com/package/gulp-remarkable): Gulp plugin for Remarkable - Markdown parser done right. Fast and easy to extend. Supports… [more](https://github.com/johnotander/gulp-remarkable) | [homepage](https://github.com/johnotander/gulp-remarkable "Gulp plugin for Remarkable - Markdown parser done right. Fast and easy to extend. Supports CommonMark.")
* [remarkable](https://www.npmjs.com/package/remarkable): Markdown parser, done right. 100% Commonmark support, extensions, syntax plugins, high speed - all in… [more](https://github.com/jonschlinkert/remarkable) | [homepage](https://github.com/jonschlinkert/remarkable "Markdown parser, done right. 100% Commonmark support, extensions, syntax plugins, high speed - all in one.")

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

Please read the [contributing guide](.github/contributing.md) for advice on opening issues, pull requests, and coding standards.

### Building docs

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

### Running tests

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

### Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](https://twitter.com/jonschlinkert)

### License

Copyright © 2017, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.6.0, on June 04, 2017._