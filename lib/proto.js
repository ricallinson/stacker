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

/*global window: true*/

'use strict';

/*!
 * Connect - HTTPServer
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/*
 * Module dependencies
 */

var parse = require('url').parse;

// prototype

var app = module.exports = {};

// environment

//var env = process.env.NODE_ENV || 'development';

/*
 * Store the current runtime
 */

var runtime = typeof window === 'undefined' ? 'server' : 'client';

/**
 * Utilize the given middleware `handle` to the given `route`,
 * defaulting to _/_. This "route" is the mount-point for the
 * middleware, when given a value other than _/_ the middleware
 * is only effective when that segment is present in the request's
 * pathname.
 *
 * For example if we were to mount a function at _/admin_, it would
 * be invoked on _/admin_, and _/admin/settings_, however it would
 * not be invoked for _/_, or _/posts_.
 *
 * Examples:
 *
 *      var app = connect();
 *      app.use(connect.favicon());
 *      app.use(connect.logger());
 *      app.use(connect.static(__dirname + '/public'));
 *
 * If we wanted to prefix static files with _/public_, we could
 * "mount" the `static()` middleware:
 *
 *      app.use('/public', connect.static(__dirname + '/public'));
 *
 * This api is chainable, so the following is valid:
 *
 *      connect
 *        .use(connect.favicon())
 *        .use(connect.logger())
 *        .use(connect.static(__dirname + '/public'))
 *        .listen(3000);
 *
 * @param {String|Function} route path or callback
 * @param {Function} fn callback
 * @return {Server} for chaining
 * @api public
 */

app.use = function (route, fn, targetRuntime) {
    // default route to '/'
    if (typeof route !== 'string') {
        targetRuntime = fn;
        fn = route;
        route = '/';
    }

    // wrap sub-apps
    if (fn && 'function' === typeof fn.handle) {
        var server = fn;
        fn.route = route;
        fn = function (req, res, next) {
            server.handle(req, res, next);
        };
    }

    // catch all other fn types
    if ('function' !== typeof fn) {
        throw new Error();
    }

    // strip trailing slash
    if ('/' === route[route.length - 1]) {
        route = route.slice(0, -1);
    }

    // add the middleware
    if (!targetRuntime || targetRuntime === runtime) {
        this.stack.push({
            route: route,
            handle: fn
        });
    }

    return this;
};

/**
 * Handle server requests, punting them down
 * the middleware stack.
 *
 * @api private
 */

app.handle = function (req, res, out) {
    var stack = this.stack,
        removed = '',
        index = 0;

    function next(err) {
        var layer,
            path,
            c,
            msg,
            arity;

        req.url = removed + req.url;
        req.originalUrl = req.originalUrl || req.url;
        removed = '';

        // next callback
        layer = stack[index];
        // bump the index for next time
        index = index + 1;

        // all done
        if (!layer || res.headerSent) {
            // delegate to parent
            if (out) {
                out(err);
                return;
            }

            // unhandled error
            if (err) {
                // default to 500
                if (res.statusCode < 400) {
                    res.statusCode = 500;
                }

                // respect err.status
                if (err.status) {
                    res.statusCode = err.status;
                }

                msg = err.stack || err.toString();
                // production gets a basic error message
                //        var msg = 'production' == env
                //          ? http.STATUS_CODES[res.statusCode]
                //          : err.stack || err.toString();

                // log to stderr in a non-test env
//                if ('test' != env) console.error(err.stack || err.toString());
//                if (res.headerSent) {
//                    req.socket.destroy();
//                    return;
//                }
//                res.setHeader('Content-Type', 'text/plain');
//                res.setHeader('Content-Length', Buffer.byteLength(msg));
//                if ('HEAD' === req.method) {
//                    res.end();
//                    return;
//                }

                res.end(msg);
            } else {
                res.statusCode = 404;
//                res.setHeader('Content-Type', 'text/plain');
//                if ('HEAD' == req.method) return res.end();
                res.end('Cannot ' + req.method + ' ' + req.url);
            }
            return;
        }

        try {
            path = parse(req.url).pathname;

            if (path === undefined) {
                path = '/';
            }

            // skip this layer if the route doesn't match.
            if (0 !== path.indexOf(layer.route)) {
                next(err);
                return;
            }

            c = path[layer.route.length];
            if (c && '/' !== c && '.' !== c) {
                next(err);
                return;
            }

            // Call the layer handler
            // Trim off the part of the url that matches the route
            removed = layer.route;
            req.url = req.url.substr(removed.length);

            // Ensure leading slash
            if ('/' !== req.url[0]) {
                req.url = '/' + req.url;
            }

            arity = layer.handle.length;

            if (err) {
                if (arity === 4) {
                    layer.handle(err, req, res, next);
                } else {
                    next(err);
                }
            } else if (arity < 4) {
                layer.handle(req, res, next);
            } else {
                next();
            }
        } catch (e) {
            next(e);
        }
    }
    next();
};

/*
 * Starts the server
 */

app.listen = function (port) {
    var self = this,
        server,
        ashReq,
        ashRes;

    if (self.routing) {
        self.use(self.routing);
    }

    /*
     * Are we on the server or the client?
     */

    if (runtime === 'server') {
        server = require('connect').createServer();
        server.use(require('knot').node(process.cwd()));
        server.use(function (req, res) {
            req.runtime = 'server';
            self.handle(req, res);
        });
        server.listen(port);
    } else {
        server = require('./http/index').createServer(function (req, res) {
            ashReq = require('./http/Request').create(req);
            ashRes = require('./http/Response').create(res);
            ashReq.runtime = 'client';
            self.handle(ashReq, ashRes);
        });
        server.listen('body');
    }
};
