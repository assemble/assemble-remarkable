'use strict';

var path = require('path');
var utils = require('./utils');

/**
 * convert markdown to HTML
 */

module.exports = function(options) {
  var defaults = {
    html: true,
    linkify: true,
    highlight: function(code, lang) {
      if (lang && utils.hljs.getLanguage(lang)) {
        try {
          return utils.hljs.highlight(lang, code).value;
        } catch (err) {}
      }

      try {
        return utils.hljs.highlightAuto(code).value;
      } catch (err) {}
      return code;
    }
  };

  var opts = utils.extend({}, defaults, options);

  return function(file, next) {
    if (file.isNull()) {
      next();
      return;
    }

    if (path.extname(file.history[0]) !== '.md') {
      next();
      return;
    }

    var md = opts.remarkable || new utils.Remarkable(opts);
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
    return utils.decode(m, 'all');
  });
}
