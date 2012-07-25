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

var app = require('stack/lib/index').createServer();

app.get('/', function (req, res) {

    var html,
        body;

    body = '<h4>GET Link</h4> \
        <a href="/">Link Test</a> \
        <h4>GET Form</h4> \
        <form action="/" method="get"> \
            <input type="text" name="s" value="s"> \
            <div> \
                <input type="text" name="f" value="f"> \
                <input type="submit"> \
            </div> \
        </form> \
        <h4>POST Form</h4> \
        <form action="/" method="POST"> \
            <input type="text" name="s" value="s"> \
            <div> \
                <input type="text" name="f" value="f"> \
                <input type="submit"> \
            </div> \
        </form>';

    html = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"> \
        <html> \
          <head> \
            <title>Ash Knot Test</title> \
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> \
            <script type="text/javascript" src="/knot/process.js"></script> \
            <script type="text/javascript"> \
                process(function(exports, require, module) {require("./app");}); \
            </script> \
          </head> \
          <body>' + body + '</body> \
        </html>';

    console.log('You are here.');

    if (req.runtime === 'server') {
        res.done(html);
    } else {
        res.done(body);
    }
});

app.listen(3000);