'use strict';

var path = require('path');
var hljs = require('highlight.js');
var extend = require('extend-shallow');
var PluginError = require('plugin-error');
var Remarkable = require('remarkable');
var decode = require('unescape');
var through = require('through2');

/**
 * convert markdown to HTML
 */

module.exports = function(options) {
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

  var opts = extend({}, defaults, options);

  return through.obj(function(file, enc, next) {
    if (file.isNull()) {
      next(null, file);
      return;
    }

    if (path.extname(file.history[0]) !== '.md') {
      next(null, file);
      return;
    }

    try {
      var md = opts.remarkable || new Remarkable(opts);
      var str = md.render(file.contents.toString());
      file._renderedMarkdown = true;
      file.contents = new Buffer(str);
      file.extname = '.html';
    } catch (err) {
      this.emit('error', new PluginError('remarkable', err, {fileName: file.path}));
      return;
    }
    next(null, file);
  });
};

/**
 * Decode template delimiters that were encoded/escaped when
 * markdown was converted.
 */

module.exports.unescape = function(options) {
  return through.obj(function(file, enc, next) {
    if (file._renderedMarkdown !== true) {
      next(null, file);
      return;
    }
    try {
      var str = file.contents.toString();
      file.contents = new Buffer(unescapeFn(str));
    } catch (err) {
      this.emit('error', new PluginError('unescape', err, {fileName: file.path}));
      return;
    }
    next(null, file);
  });
};

function unescapeFn(str) {
  var regex = /(?:\{{2,4}(.+?)\}{2,4}|&lt;%(.+)?%&gt;|\$\{(.+)?\})/g;
  return str.replace(regex, function(m) {
    return decode(m, 'all');
  });
}
