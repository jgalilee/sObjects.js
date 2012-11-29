/*
 * Build Script
 * ============================================================================
 * author: Jack Galilee
 * ============================================================================
 */
var path = require('path');
var minify = require('jake-uglify').minify;

desc('runs jasmine test suite');
task('default', function() {
  var childProcess = require('child_process')
  var phantomjs = 'phantomjs';
  var testRunner = path.resolve('lib/run_jasmine_test.coffee');
  var testPage = path.resolve('lib/test_runner.html');
  var process = phantomjs + " " + testRunner + " " + testPage;
  console.log(process)
  childProcess.exec(process, function(error, stdout, stderr) {
    if(error) {
     console.log(error.stack);
    };
    console.log(stdout);
    console.log(stderr);
  });
});

desc('outputs minified javascript file sobjects.min.js');
task('build', ['sobjects.min.js']);
minify({'sobjects.min.js': [
  'src/SOQL.js',
  'src/sObjectRecord.js',
  'src/sObjectClass.js',
  'src/sObjects.js'
]});
