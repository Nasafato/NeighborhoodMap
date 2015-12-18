var gulp = require('gulp'); 

// Include Our Plugins
var jshint = require('gulp-jshint');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var htmlreplace = require('gulp-html-replace');


var path = {
  HTML: 'src/index.html',
  CSS: 'src/css/*.css',
  JS: 'src/js/*.js',
  MINIFIED_OUT: 'build.min.js',
  OUT: 'build.js',
  MINIFIED_CSS_OUT: 'style.min.css',
  CSS_OUT: 'style.css',
  DEST: 'dist',
  DEST_BUILD: 'dist/build',
  DEST_SRC: 'dist/src',
  ENTRY_POINT: './src/js/app.js'
};

// Lint Task
gulp.task('lint', function() {
    return gulp.src('src/js/app.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('css', function() {
    return gulp.src(path.CSS)
        .pipe(minifyCSS())
        .pipe(concat(path.MINIFIED_CSS_OUT))
        .pipe(gulp.dest(path.DEST_BUILD));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(path.JS)
        .pipe(concat(path.OUT))
        .pipe(gulp.dest(path.DEST_BUILD))
        .pipe(rename(path.MINIFIED_OUT))
        .pipe(uglify())
        .pipe(gulp.dest(path.DEST_BUILD));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(path.JS, ['lint', 'scripts']);
    gulp.watch(path.CSS, ['css']);
});

gulp.task('replaceHTML', function() {
    gulp.src(path.HTML)
        .pipe(htmlreplace({
            'js': 'build/' + path.MINIFIED_OUT,
            'css': 'build/' + path.MINIFIED_CSS_OUT
        }))
        .pipe(gulp.dest(path.DEST))
})

// Default Task
gulp.task('default', ['lint', 'css', 'scripts', 'replaceHTML', 'watch']);