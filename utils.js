'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('extend-shallow', 'extend');
require('highlight.js', 'hljs');
require('plugin-error', 'PluginError');
require('remarkable', 'Remarkable');
require('through2', 'through');
require('unescape', 'decode');
require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;
