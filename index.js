var fs = require("fs");
var util = require("gulp-util");
var path = require("path");
var through = require("through2");
var PluginError = util.PluginError;
var options = {};
var onceArray = [];
var version = "1.4.5"; /* must match package.json file */

function phpIncludeHtml(opts) {
  options = opts;
  if(!options || options.toString()!=="[object Object]") {
    options = {};
  }
  if(typeof(options.path)!=="string") {
    options.path = "";
  }
  var stream = through.obj(function(file,enc,cb) {
    if(file.isNull()) {
      this.push(file);
      return cb();
    }
    if(!file.isBuffer()) {
      this.emit("error",new PluginError("php-include-html","Sorry, streams are not supported in php-include-html"));
    }
    if(options.verbose) {
      console.log("[php-include-html@"+version+"] processing "+file.relative+"...");
    }
    onceArray = []; //reset each file
    var cont = processContents(file.contents.toString());
    file.contents = Buffer.from(cont);
    this.push(file);
    return cb();
  });
  return stream;
}

function processContents(orig) {
  var regex = /<\?(php){0,1}\s+(?:(require_once|include_once|require|include)[^;]*?['"](.+?)['"].*?;{0,1})\s*\?>/gmi;
  var cont = orig;
  var res = null;
  while((res = regex.exec(orig))) {
    var rori = String(res[2]).substr(0,7); //"require"/"include"
    var once = (String(res[2]).length > 7); //true/false
    var text = res[0];
    var fnam = res[3];
    if(once && onceArray[fnam]) {
      cont = cont.replace(text,"");
      if(options.verbose) {
        console.log("[php-include-html@"+version+"] not "+rori+"d: "+fnam+" (already "+rori+"d)");
      }
    }
    else {
      onceArray[fnam] = rori;
      var floc = path.normalize(path.join(options.path,fnam));
      try {
        var newf = fs.readFileSync(floc).toString();
        var resf = processContents(newf);
        cont = cont.replace(text,resf);
        if(options.verbose) {
          console.log("[php-include-html@"+version+"] "+rori+"d: "+fnam);
        }
      }
      catch(e) {
        if(options.verbose) {
          console.log("[php-include-html@"+version+"] failed "+rori+": "+fnam);
        }
      }
    }
  }
  return cont;
}
module.exports = phpIncludeHtml;
