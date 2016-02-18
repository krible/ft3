var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var ghPages = require('gulp-gh-pages');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');


gulp.task('bower', function() {
    return gulp.src(mainBowerFiles(), { base: './vendor' })
      //  .pipe(uglify())
        .pipe(gulp.dest('./dist/vendor'))
});

gulp.task('controllers', function() {
    return gulp.src('./controllers/**/*.js')
        .pipe(gulp.dest('./dist/controllers'))
});

gulp.task('css', function() {
    return gulp.src('./css/**/*.css')
        .pipe(gulp.dest('./dist/css'))
});

gulp.task('images', function() {
    return gulp.src('./images/**/*.*')
        .pipe(gulp.dest('./dist/images'))
});

gulp.task('js', function() {
    return gulp.src('./js/**/*.js')
        .pipe(gulp.dest('./dist/js'))
});

gulp.task('views', function() {
    return gulp.src('./views/**/*.html')
        .pipe(gulp.dest('./dist/views'))
});

gulp.task('root', function() {
    return gulp.src(['./index.html', './helper.js', './lb-services.js', './app.js'])
        .pipe(gulp.dest('./dist'))
});

gulp.task('tilda', function() {
    return gulp.src('./tilda/**/*.*')
        .pipe(gulp.dest('./dist/tilda'))
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['bower', 'controllers', 'css', 'images', 'js', 'views', 'tilda', 'root']);


gulp.task('deploy', ['default'], function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});
