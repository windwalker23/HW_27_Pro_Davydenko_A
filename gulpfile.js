const { src, dest, series, parallel, watch } = require('gulp');
const fileinclude = require('gulp-file-include');
const del = require("del");
const browserSync = require('browser-sync').create();

const clean = function(cb) {
  del(["dist"]);

  cb();
} 

function browsersync() {
	browserSync.init({
		server: { baseDir: 'src/' }, 
		notify: false, 
		online: true 
	})
}

const build = function() {
  src(['src/*.html', 'src/*.js'])
  .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
  }))
  .pipe(dest('dist'))

}

const browser = () => {
  browserSync.init({
      server: {
          baseDir: "./dist"
      }
  });

  watch('src/*.html').on('change', build);
}

exports.build = build;
exports.browser = browser;
exports.default = parallel(clean, build, browser);