/*
 * Build Script
 * ============================================================================
 * author: Jack Galilee
 * ============================================================================
 * Provides task for minifying the library by concatenating and uglifying the
 * files in the specified order.
 */
var minify = require('jake-uglify').minify;

// Default task to minify the javascript library for use in other applications.
task('default', ['sobjects.min.js']);
desc('Minifiy sObjects.js source directory.');
minify({'sobjects.min.js': [
  'src/SOQL.js',
  'src/sObjectRecord.js',
  'src/sObjectClass.js',
  'src/sObjects.js'
]});
