var minify = require('jake-uglify').minify;

task('default', ['sobjects.min.js']);

desc('Minifiy sObjects.js source directory.');

minify({'sobjects.min.js': [
  'src/SOQL.js',
  'src/sObjectRecord.js',
  'src/sObjectClass.js',
  'src/sObjects.js'
]});
