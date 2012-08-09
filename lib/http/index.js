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

/*global window: true, document: true, navigator: true*/

'use strict';

/*
 * Module dependencies
 */

var parse = require('url').parse;

/*
 * A client side version of HttpServer
 */

function HttpServer(handle) {

    function domLoaded(callback) {
        /* Internet Explorer */
        /*@cc_on
        @if (@_win32 || @_win64)
            document.write('<script id="ieScriptLoad" defer src="//:"><\/script>');
            document.getElementById('ieScriptLoad').onreadystatechange = function() {
                if (this.readyState == 'complete') {
                    callback();
                }
            };
        @end @*/
        /* Mozilla, Chrome, Opera */
        if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', callback, false);
        } else if (/KHTML|WebKit|iCab/i.test(navigator.userAgent)) {
            /* Safari, iCab, Konqueror */
            var DOMLoadTimer = setInterval(function () {
                if (/loaded|complete/i.test(document.readyState)) {
                    callback();
                    clearInterval(DOMLoadTimer);
                }
            }, 10);
        } else {
            /* Other web browsers */
            window.onload = callback;
        }
    }

    /*
     * Get all the input key/values from a form node
     */
    function getFormFields(form) {

        var fields = {},
            inputs,
            input,
            i;

        inputs = form.getElementsByTagName('input');

        for (i in inputs) {
            if (inputs.hasOwnProperty(i)) {
                input = inputs[i];
                if (input.name) {
                    fields[input.name] = input.value;
                }
            }
        }

        return fields;
    }

    /*
     * Convert a POST form to a GET url
     */
    function formPostToGet(req) {

        var key,
            val;

        if (req.url.indexOf('?') >= 0) {
            req.url += '&';
        } else {
            req.url += '?';
        }

        for (key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                val = req.body[key];
                req.url += key + '=' + val + '&';
            }
        }

        req.url = req.url.slice(0, -1); // Remove the last '&'
        req.body = {};
        return req;
    }

    function addListeners(response) {

        var links = document.getElementsByTagName('a'),
            forms = document.getElementsByTagName('form'),
            idl,
            idf,
            onClick,
            onSubmit;

        onClick = function (e) {
            var req = {
                    method: 'GET',
                    url: parse(e.target.href).path,
                    body: {}
                };

            e.preventDefault();

            handle(req, response());
        };

        onSubmit = function (e) {
            var req = {
                    method: e.target.method.toUpperCase(),
                    url: parse(e.target.action).path,
                    body: getFormFields(e.target)
                };

            if (req.method === 'GET') {
                req = formPostToGet(req);
            }

            e.preventDefault();

            handle(req, response());
        };

        for (idl = 0; idl < links.length; idl = idl + 1) {
            links[idl].addEventListener('click', onClick);
        }

        for (idf = 0; idf < forms.length; idf = idf + 1) {
            forms[idf].addEventListener('submit', onSubmit);
        }
    }

    function response() {
        var buffer = '';
        return {
            write: function (data) {
                if (typeof data !== 'undefined') {
                    buffer += data;
                }
            },
            end: function (data) {
                if (typeof data !== 'undefined') {
                    document.body.innerHTML = buffer + data;
                    addListeners(response);
                }
            }
        };
    }

    domLoaded(function () {
        console.log('DOM Ready');
        addListeners(response);
    });
}

HttpServer.prototype.listen = function (node) {
    console.log('Listening on "' + node + '"');
};

exports.createServer = function (handle) {
    return new HttpServer(handle);
};
