Description
===========

Scan PHP files in Gulp and process include and require statements to inline HTML snippets. The following are all handled...
* include
* require
* include_once
* require_once

Status
======

[![NPM Version](http://img.shields.io/npm/v/php-include-html.svg?style=flat)](https://www.npmjs.org/package/php-include-html) [![Stability](https://img.shields.io/badge/stability-stable-brightgreen.svg?style=flat)](https://github.com/riklewis/php-include-html) [![Dependencies](http://img.shields.io/david/riklewis/php-include-html.svg?style=flat)](https://david-dm.org/riklewis/php-include-html) [![Development Dependencies](http://img.shields.io/david/dev/riklewis/php-include-html.svg?style=flat)](https://david-dm.org/riklewis/php-include-html?type=dev) [![Build Status](http://img.shields.io/travis/riklewis/php-include-html.svg?style=flat)](https://travis-ci.org/riklewis/php-include-html)
[![Coverage Status](http://img.shields.io/coveralls/riklewis/php-include-html.svg?style=flat)](https://coveralls.io/r/riklewis/php-include-html?branch=master)

Requirements
============

* [Gulp](https://gulpjs.com) - v3.9.1 or newer


Install
=======

    npm install php-include-html --save-dev


Examples
========

* gulpfile.js
```javascript
  var gulp = require("gulp");
  var pump = require("pump");
  var phpinc = require("php-include-html");
  var phpFiles = ["index.php"];

  gulp.task("php",function(cb) {
    pump([
      gulp.src(phpFiles),
      phpinc({verbose:true}),
      gulp.dest("build")
    ],cb);
  });
```

* index.php
```html
  <!DOCTYPE html>
  <html lang="en-gb">
    <head>
      <title>php-include-html</title>
<?php include("head.php");?>
    </head>
    <body>
      <!-- etc -->
    </body>
  </html>
```

* head.php
```html
      <meta name="viewport" content="width=device-width,initial-scale=1.0">
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
```  


Configuration options
=====================

* **verbose**: Will output additional messages to the console (boolean - default: false)
* **path**: The base path of files if not same as gulpfile (string - default: "")

Treat me to a beer!
===================

[![PayPal](https://img.shields.io/badge/PayPal-Donate-blue.svg)](https://www.paypal.me/riklewis)
