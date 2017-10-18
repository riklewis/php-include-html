var fs = require("fs");
var util = require("gulp-util");
var path = require("path");
var es = require("event-stream");
var expect = require("chai").expect;
var sinon = require("sinon");
var phpinc = require("../");

describe("php-include-html",function() {
  it("should be awesome",function() {
    expect(1).to.equal(1); //always true
  });
  describe("isNull()",function() {
    it("should do nothing",function(done) {
      var temp = new util.File(null);
      var stream = phpinc();
      stream.write(temp);
      stream.once("data",function(file) {
        expect(file.isNull()).to.be.true;
        expect(file.contents).to.be.null;
        done();
      });
    });
  });
  describe("isSteam()",function() {
    it("should throw an error - not supported",function(done) {
      var temp = new util.File({contents:es.readArray(["stream","with","those","contents"])});
      var stream = phpinc();
      expect(function() {
        stream.write(temp);
      }).to.throw("not supported");
      done();
    });
  });
  describe("isBuffer()",function() {
    it("should *not* change other php code",function(done) {
      var floc = path.normalize(process.cwd()+"/index.php");
      var temp = new util.File({contents:new Buffer("<html><?php echo('test');?></html>"),path:floc});
      var stream = phpinc();
      stream.write(temp);
      stream.once("data",function(file) {
        expect(file.isBuffer()).to.be.true;
        expect(file.contents.toString()).to.contain("echo('test');");
        done();
      });
    });
    describe("Function: include",function() {
      it("should include a file once (double quotes and brackets)",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php include(\"test/fixtures/test.php\");?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          done();
        });
      });
      it("should include a file once (single quotes and brackets)",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php include('test/fixtures/test.php');?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          done();
        });
      });
      it("should include a file once (double quotes, no brackets)",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php include \"test/fixtures/test.php\";?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          done();
        });
      });
      it("should include a file once (single quotes, no brackets)",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php include 'test/fixtures/test.php';?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          done();
        });
      });
      it("should include a file twice",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php include 'test/fixtures/test.php';?><?php include 'test/fixtures/test.php';?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php\ncontents of test.php");
          done();
        });
      });
      it("should include a file thrice",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php include 'test/fixtures/test.php';?><?php include 'test/fixtures/test.php';?><?php include 'test/fixtures/test.php';?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php\ncontents of test.php\ncontents of test.php");
          done();
        });
      });
      it("should include a file recursively",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php include(\"test/fixtures/test2.php\");?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("Test2.php includes contents of test.php");
          done();
        });
      });
    });
    describe("Function: require",function() {
      it("should include a file once (double quotes and brackets)",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php require(\"test/fixtures/test.php\");?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          done();
        });
      });
      it("should include a file once (single quotes and brackets)",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php require('test/fixtures/test.php');?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          done();
        });
      });
      it("should include a file once (double quotes, no brackets)",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php require \"test/fixtures/test.php\";?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          done();
        });
      });
      it("should include a file once (single quotes, no brackets)",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php require 'test/fixtures/test.php';?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          done();
        });
      });
      it("should include a file twice",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php require 'test/fixtures/test.php';?><?php require 'test/fixtures/test.php';?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php\ncontents of test.php");
          done();
        });
      });
      it("should include a file thrice",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php require 'test/fixtures/test.php';?><?php require 'test/fixtures/test.php';?><?php require 'test/fixtures/test.php';?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php\ncontents of test.php\ncontents of test.php");
          done();
        });
      });
      it("should include a file recursively",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php require 'test/fixtures/test2.php';?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("Test2.php includes contents of test.php");
          done();
        });
      });
    });
    describe("Function: include_once",function() {
      it("should include a file once (double quotes and brackets)",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php include_once(\"test/fixtures/test.php\");?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          done();
        });
      });
      it("should include a file once (single quotes and brackets)",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php include_once('test/fixtures/test.php');?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          done();
        });
      });
      it("should include a file once (double quotes, no brackets)",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php include_once \"test/fixtures/test.php\";?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          done();
        });
      });
      it("should include a file once (single quotes, no brackets)",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php include_once 'test/fixtures/test.php';?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          done();
        });
      });
      it("should *not* include a file twice",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php include_once 'test/fixtures/test.php';?><?php include_once 'test/fixtures/test.php';?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          expect(file.contents.toString()).to.not.contain("contents of test.php\ncontents of test.php");
          done();
        });
      });
      it("should *not* include a file thrice",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php include_once 'test/fixtures/test.php';?><?php include_once 'test/fixtures/test.php';?><?php include_once 'test/fixtures/test.php';?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          expect(file.contents.toString()).to.not.contain("contents of test.php\ncontents of test.php");
          done();
        });
      });
      it("should include a file recursively",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php include_once 'test/fixtures/test2.php';?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("Test2.php includes contents of test.php");
          done();
        });
      });
    });
    describe("Function: require_once",function() {
      it("should include a file once (double quotes and brackets)",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php require_once(\"test/fixtures/test.php\");?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          done();
        });
      });
      it("should include a file once (single quotes and brackets)",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php require_once('test/fixtures/test.php');?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          done();
        });
      });
      it("should include a file once (double quotes, no brackets)",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php require_once \"test/fixtures/test.php\";?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          done();
        });
      });
      it("should include a file once (single quotes, no brackets)",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php require_once 'test/fixtures/test.php';?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          done();
        });
      });
      it("should *not* include a file twice",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php require_once 'test/fixtures/test.php';?><?php require_once 'test/fixtures/test.php';?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          expect(file.contents.toString()).to.not.contain("contents of test.php\ncontents of test.php");
          done();
        });
      });
      it("should *not* include a file thrice",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php require_once 'test/fixtures/test.php';?><?php require_once 'test/fixtures/test.php';?><?php require_once 'test/fixtures/test.php';?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          expect(file.contents.toString()).to.not.contain("contents of test.php\ncontents of test.php");
          done();
        });
      });
      it("should include a file recursively",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php require_once 'test/fixtures/test2.php';?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("Test2.php includes contents of test.php");
          done();
        });
      });
    });
    describe("Option: path",function() {
      it("should include a file using the specified path",function(done) {
        var floc = path.normalize(process.cwd()+"/test/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php include(\"fixtures/test.php\");?></html>"),path:floc});
        var stream = phpinc({path:"test"});
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          done();
        });
      });
      it("should include a file and ignore path specified as array",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php include(\"test/fixtures/test.php\");?></html>"),path:floc});
        var stream = phpinc({path:[]});
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          done();
        });
      });
      it("should include a file and ignore path specified as object",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php include(\"test/fixtures/test.php\");?></html>"),path:floc});
        var stream = phpinc({path:{}});
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          done();
        });
      });
      it("should include a file and ignore path specified as boolean",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php include(\"test/fixtures/test.php\");?></html>"),path:floc});
        var stream = phpinc({path:true});
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          done();
        });
      });
      it("should *not* include a file if the specified path doesn't exist",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php include(\"test/should/fail.php\");?></html>"),path:floc});
        var stream = phpinc({path:"fail"});
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("test/should/fail.php");
          done();
        });
      });
    });
    describe("Option: verbose",function() {
      var sandbox;
      beforeEach(function() {
        sandbox = sinon.sandbox.create();
        sandbox.spy(console,"log");
      });
      afterEach(function() {
        sandbox.restore();
      });
      it("should include a file with verbose messaging off by default",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php include(\"test/fixtures/test.php\");?></html>"),path:floc});
        var stream = phpinc();
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          expect(console.log.notCalled).to.be.true;
          done();
        });
      });
      it("should include a file with verbose messaging off",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php include(\"test/fixtures/test.php\");?></html>"),path:floc});
        var stream = phpinc({verbose:false});
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          expect(console.log.notCalled).to.be.true;
          done();
        });
      });
      it("should include a file with verbose messaging on",function(done) {
        var floc = path.normalize(process.cwd()+"/index.php");
        var temp = new util.File({contents:new Buffer("<html><?php include(\"test/fixtures/test.php\");?><?php include_once(\"test/fixtures/test.php\");?><?php include(\"test/should/fail.php\");?></html>"),path:floc});
        var stream = phpinc({verbose:true});
        stream.write(temp);
        stream.once("data",function(file) {
          expect(file.isBuffer()).to.be.true;
          expect(file.contents.toString()).to.contain("contents of test.php");
          expect(console.log.called).to.be.true;
          done();
        });
      });
    });
  });
});
