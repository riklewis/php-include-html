Description
===========

Scan PHP files in Gulp and process include and require statements to inline HTML snippets.


Requirements
============

* [Gulp](https://gulpjs.com) -- v3.9.1 or newer


Install
=======

    npm install php-include-html


Examples
========

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


Configuration options
==========

* **verbose**: Will output additional messages to the console (boolean - default: false)
* **path**: The base path of files if not same as gulpfile (string - default: "")
