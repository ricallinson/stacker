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

/*jslint nomen: true*/

'use strict';

/*
 * Module dependencies
 */

var proto = require('./proto'),
    utils = require('./utils');

/*
 * Version
 */

var version = '0.1.0';

/*
 * Define the createServer() function
 *
 * @public
 * @method createServer
 * @param {object} context
 */

function createServer(context) {

    function app(req, res) {
        app.handle(req, res);
    }

    utils.merge(app, proto);

    app.context = context || {};
    app.route = '/';
    app.routing = exports.router(app);
    app.stack = [];

    return app;
}

/*
 * Expose the version
 */

exports.version = version;

/*
 * Expose the createServer()
 */

exports.createServer = createServer;

/**
 * Lazy-load bundled middleware with getters.
 *
 * Note: this is an array as we cannot read the filesystem from the client
 */

['router'].forEach(function (name) {
    exports.__defineGetter__(name, function () {
        return require('./middleware/' + name);
    });
});
