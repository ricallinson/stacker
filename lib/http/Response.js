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

'use strict';

/*
 * Module dependencies
 */

var utils = require('../utils');

/*
 * Functions and attributes to mock out
 */
var func = ['writeContinue', 'writeHead', 'setHeader', 'getHeader', 'removeHeader', 'write', 'end', 'addTrailers'],
    attr = ['statusCode'];

/*
 * The prototype for the response
 */

var response = {};

response.error = function (data) {
    this.res.end(data);
};

response.flush = function (data) {
    this.res.write(data);
};

response.done = function (data) {
    this.flush(data);
    this.res.end();
};

/*
 * Mock all ServerResponse functions
 */

func.forEach(function (func) {
    response[func] = function () {
        throw new Error('Function "' + func + '" not supported.');
    };
});

/*
 * Mock all ServerResponse attributes
 */

attr.forEach(function (attr) {
    response[attr] = '';
});

/*
 * Expose a create function for the Request
 */

exports.create = function (res) {

    var handler = {};

    utils.merge(handler, response);

    handler.res = res;

    return handler;
};