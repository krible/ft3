var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var prompt = require('gulp-prompt');
var ghPages = require('gulp-gh-pages');
var concat = require('gulp-concat');
var minify = require('gulp-minify-css');
var uglify = require('gulp-uglify');


gulp.task('head', function () {
  console.log("   ______________   ______    __                  __       __          ");
  console.log("  / __/_  __/_  /  /_  __/__ / /__ ___  ___  ____/ /____ _/ /____  ____");
  console.log(" / _/  / / _/_ <    / / / -_) / -_) _ \\/ _ \\/ __/ __/ _ `/ __/ _ \\/ __/");
  console.log("/_/   /_/ /____/   /_/  \\__/_/\\__/ .__/\\___/_/  \\__/\\_,_/\\__/\\___/_/   ");
  console.log("                                /_/                                    ");
  console.log("Krible Project");
});


gulp.task('bower', function() {
    return gulp.src(mainBowerFiles(), { base: './vendor' })
        .pipe(gulp.dest('./dist/vendor'))
});

gulp.task('bowerjs', function() {
    return gulp.src('./dist/vendor/**/*.js' )
        .pipe(uglify())
        .pipe(gulp.dest('./dist/vendor'))
});

gulp.task('bowercss', function() {
    return gulp.src('./dist/vendor/**/*.css' )
        .pipe(minify())
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
    return gulp.src(['./index.html', './helper.js', './lb-services.js', './app.js', './404.html'])
        .pipe(gulp.dest('./dist'))
});

gulp.task('tilda', function() {
    return gulp.src('./tilda/**/*.*')
        .pipe(gulp.dest('./dist/tilda'))
});

// The default task (called when you run `gulp` from cli)
gulp.task('buld', ['head', 'bower', 'bowerjs', 'bowercss', 'controllers', 'css', 'images', 'js', 'views', 'tilda', 'root']);


gulp.task('default', ['buld'], function() {
  return gulp.src('./dist/**/*')
    .pipe(prompt.confirm('Push to gh-pages branch?'))
    .pipe(ghPages());
});
