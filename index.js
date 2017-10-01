var fs = require("fs");
var util = require("gulp-util");
var path = require("path");
var through = require("through2");
var vinyl = require("vinyl");
var PluginError = util.PluginError;
var options = {};
var onceArray = [];

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
      //return cb();
    }
    if(options.verbose) {
      console.log("[php-include-html] processing "+file.relative+"...");
    }
    onceArray = []; //reset each file
    var fout = processFile(file);
    this.push(fout);
    cb();
  });
  return stream;
}

function processFile(file) {
  var regex = /<\?(php){0,1}\s+(?:(require_once|include_once|require|include)[^;]*?['"](.+?)['"].*?;)\s*\?>/gmi;
  var cont = file.contents.toString();
  var res = null;
  while((res = regex.exec(file.contents))!==null) {
    var rori = String(res[2]).substr(0,7); //"require"/"include"
    var once = (String(res[2]).length > 7); //true/false
    var fnam = res[3];
    if(once && onceArray[fnam]) {
      cont = cont.replace(res[0],"");
      if(options.verbose) {
        console.log("[php-include-html] not "+rori+"d: "+fnam+" (already "+rori+"d)");
      }
    }
    else {
      onceArray[fnam] = rori;
      var floc = path.normalize(path.join(options.path,fnam));
      try {
        var newf = fs.readFileSync(floc);
        var resf = processFile(new vinyl({path:floc,contents:new Buffer(newf.toString())}));
        cont = cont.replace(res[0],resf.contents.toString());
        if(options.verbose) {
          console.log("[php-include-html] "+rori+"d: "+fnam);
        }
      }
      catch(e) {
        if(options.verbose) {
          console.log("[php-include-html] failed "+rori+": "+fnam);
        }
      }
    }
  }
  file.contents = new Buffer(cont);
  return file;
}

module.exports = phpIncludeHtml;
