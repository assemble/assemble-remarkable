'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var File = require('vinyl');
var assert = require('assert');
var remarkable = require('..');

var cwd = path.join.bind(path, __dirname);
function read(filepath) {
  return fs.readFileSync(filepath, 'utf8');
}
function fixture(name) {
  return cwd('fixtures', name + '.md');
}
function expected(name) {
  return read(cwd('expected', name + '.html'));
}

describe('assemble-remarkable', function() {
  it('should not fail when file does not exist', function(cb) {
    var stream = remarkable();
    var buffer = [];

    stream.write(new File({
      base: __dirname,
      path: __dirname + '/file.txt'
    }));

    stream.on('data', function(file) {
      buffer.push(file);
    });

    stream.on('end', function() {
      assert(buffer[0].extname, '.txt');
      cb();
    });

    stream.end();
  });

  it('should convert a markdown file to HTML', function(cb) {
    unit('file', {}, cb);
  });

  it('should unescape handlebars templates by default', function(cb) {
    unit('unescape-hbs', {}, cb);
  });

  it('should unescape ejs templates by default', function(cb) {
    unit('unescape-ejs', {}, cb);
  });

  it('should unescape es6 templates by default', function(cb) {
    unit('unescape-es6', {}, cb);
  });

  it('should linkify by default', function(cb) {
    unit('linkify', {}, cb);
  });

  it('should highlight by default', function(cb) {
    unit('highlight', {}, cb);
  });
});

function unit(filename, options, cb) {
  var stream = remarkable(options)
  var buffer = [];

  var filepath = fixture(filename);
  stream.write(new File({
    base: cwd(),
    path: filepath,
    contents: fs.readFileSync(filepath)
  }))

  stream.pipe(remarkable.unescape());
  stream.on('data', function(file) {
    buffer.push(file);
  });

  stream.on('end', function() {
    assert.equal(buffer.length, 1);
    assert.equal(buffer[0].contents.toString(), expected(filename));
    cb();
  });

  stream.end();
}
