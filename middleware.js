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

  return function(file, next) {
    if (file.isNull()) {
      next();
      return;
    }

    if (path.extname(file.history[0]) !== '.md') {
      next();
      return;
    }

    var md = opts.remarkable || new Remarkable(opts);
    var str = md.render(file.contents.toString());
    file._renderedMarkdown = true;
    file.contents = new Buffer(str);
    file.extname = '.html';
    next();
  };
};

/**
 * Decode template delimiters that were encoded/escaped when
 * markdown was converted.
 */

module.exports.unescape = function(options) {
  return function(file, next) {
    if (file._renderedMarkdown !== true) {
      next();
      return;
    }

    file.contents = new Buffer(unescape(file.contents.toString()));
    next(null, file);
  };
};

function unescape(str) {
  var regex = /(?:\{{2,4}(.+?)\}{2,4}|&lt;%(.+)?%&gt;|\$\{(.+)?\})/g;
  return str.replace(regex, function(m) {
    return decode(m, 'all');
  });
}
