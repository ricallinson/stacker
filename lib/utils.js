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
 * Trim white space from a string
 */

function trim(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

/**
 * Merge object b with object a.
 *
 *     var a = { foo: 'bar' }
 *       , b = { bar: 'baz' };
 *
 *     utils.merge(a, b);
 *     // => { foo: 'bar', bar: 'baz' }
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api private
 */

exports.merge = function (a, b) {
    var key;
    if (a && b) {
        for (key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
    }
    return a;
};

/**
 * Flatten the given `arr`.
 *
 * @param {Array} arr
 * @param {Array} ret
 * @return {Array}
 * @api private
 */

exports.flatten = function (arr, ret) {

    var len = arr.length,
        i;

    ret = ret || [];

    for (i = 0; i < len; i = i + 1) {
        if (Array.isArray(arr[i])) {
            exports.flatten(arr[i], ret);
        } else {
            ret.push(arr[i]);
        }
    }
    return ret;
};

/*
 * Takes the given string and returns an object
 *
 * Values supported:
 * 
 *  lang:en,region:GB,device:iphone
 *  "lang:en,region:GB, device:iphone"
 *  "lang:en, region: GB, device:iphone"
 *
 * Object returned:
 *
 *  {
 *      lang: "en",
 *      region: "GB",
 *      device: "iphone"
 *  }
 */
exports.extractContext = function (str) {

    var context = {};

    if (typeof str !== 'string') {
        throw new Error('The conext string provided was not valid.');
    }

    str.split(',').forEach(function (item) {
        if (item) {
            var pair = item.split(':');
            context[trim(pair[0])] = trim(pair[1]);
        }
    });

    return context;
};
