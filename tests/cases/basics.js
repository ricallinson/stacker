//    (The MIT License)
//
//    Copyright (c) 2012 Richard S Allinson <rsa@mountainmansoftware.com>
//
//    Permission is hereby granted, free of charge, to any person obtaining
//    a copy of this software and associated documentation files (the
//    'Software'), to deal in the Software without restriction, including
//    without limitation the rights to use, copy, modify, merge, publish,
//    distribute, sublicense, and/or sell copies of the Software, and to
//    permit persons to whom the Software is furnished to do so, subject to
//    the following conditions:
//
//    The above copyright notice and this permission notice shall be
//    included in all copies or substantial portions of the Software.
//
//    THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
//    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
//    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
//    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
//    CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
//    TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
//    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/*global describe: true, it: true*/

'use strict';

var assert = require("assert");
var stacker = require('stacker');

describe('stacker', function () {
	describe('stacker', function () {
        it('stacker should be an object', function () {
            assert.equal(typeof stacker, 'object');
        });
    });
    describe('stacker.version', function () {
        it('version should be a string', function () {
            assert.equal(typeof stacker.version, 'string');
        });
    });
    describe('stacker.router', function () {
        it('router should be a function', function () {
            assert.equal(typeof stacker.router({}), 'function');
        });
    });
});

describe('stacker.createServer', function () {
    describe('app.use', function () {
        it('app.use should be a function', function () {
            var app = stacker.createServer();
            assert.equal(typeof app.use, 'function');
        });
    });
    describe('app.handle', function () {
        it('app.handle should be a function', function () {
            var app = stacker.createServer();
            assert.equal(typeof app.handle, 'function');
        });
    });
    describe('app.listen', function () {
        it('app.listen should be a function', function () {
            var app = stacker.createServer();
            assert.equal(typeof app.listen, 'function');
        });
    });
});
