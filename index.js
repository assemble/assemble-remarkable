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

  return utils.through.obj(function(file, enc, next) {
    if (file.isNull()) {
      next(null, file);
      return;
    }

    if (path.extname(file.history[0]) !== '.md') {
      next(null, file);
      return;
    }

    try {
      var md = opts.remarkable || new utils.Remarkable(opts);
      var str = md.render(file.contents.toString());
      file._renderedMarkdown = true;
      file.contents = new Buffer(str);
      file.extname = '.html';
    } catch (err) {
      this.emit('error', new utils.PluginError('remarkable', err, {fileName: file.path}));
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
  return utils.through.obj(function(file, enc, next) {
    if (file._renderedMarkdown !== true) {
      next(null, file);
      return;
    }
    try {
      var str = file.contents.toString();
      file.contents = new Buffer(unescapeFn(str));
    } catch (err) {
      this.emit('error', new utils.PluginError('unescape', err, {fileName: file.path}));
      return;
    }
    next(null, file);
  });
};

function unescapeFn(str) {
  var regex = /(?:\{{2,4}(.+?)\}{2,4}|&lt;%(.+)?%&gt;|\$\{(.+)?\})/g;
  return str.replace(regex, function(m) {
    return utils.decode(m, 'all');
  });
}
