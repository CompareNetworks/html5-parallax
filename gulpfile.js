'use strict';
// Generated on 2014-04-15 using generator-gulp-webapp 0.0.6

var gulp = require('gulp');
var zip = require('gulp-zip');
var open = require('open');
var wiredep = require('wiredep').stream;
var jsonminify = require('gulp-jsonminify');

// Load plugins
var $ = require('gulp-load-plugins')();


// Styles
gulp.task('styles', function () {
    return gulp.src(['app/styles/*.scss', 'app/data/presentation-content/universal/*.scss'])
        .pipe($.rubySass({
            style: 'expanded',
            loadPath: ['app/bower_components']
        }))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('app/styles'))
        .pipe($.size());
});

// Scripts
gulp.task('scripts', function () {
    return gulp.src(['app/scripts/**/*.js', '!app/scripts/move.js', '!app/scripts/idangerous.swiper.progress.js'])
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter('default'))
        .pipe($.size());
});

// HTML
gulp.task('html', ['styles', 'scripts'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');

    return gulp.src('app/*.html')
        .pipe($.useref.assets())
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

// Images
gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size());
});

gulp.task('fonts', function () {
    return gulp.src('app/styles/fonts/**/*')
        .pipe(gulp.dest('dist/styles/fonts'));
});

// Clean
gulp.task('clean', function () {
    return gulp.src(['dist/styles', 'dist/scripts', 'dist/images', 'dist/fonts', 'dist/data'], { read: false }).pipe($.clean());
});

// Build
gulp.task('build', ['html', 'images', 'fonts', 'minify', 'copy_data']);

// Default task
gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

// Connect
gulp.task('connect', function () {
    $.connect.server({
        root: ['app'],
        port: 9000,
        livereload: true
    });
});

// Open
gulp.task('serve', ['connect', 'styles'], function () {
    open("http://localhost:9000");
});

// Inject Bower components
gulp.task('wiredep', function () {
    gulp.src('app/styles/*.scss')
        .pipe(wiredep({
            directory: 'app/bower_components',
            ignorePath: 'app/bower_components/'
        }))
        .pipe(gulp.dest('app/styles'));

    gulp.src('app/*.html')
        .pipe(wiredep({
            directory: 'app/bower_components',
            ignorePath: 'app/'
        }))
        .pipe(gulp.dest('app'));
});

// Watch
gulp.task('watch', ['connect', 'serve'], function () {
    // Watch for changes in `app` folder
    gulp.watch([
        'app/*.html',
        'app/styles/**/*.scss',
        'app/scripts/**/*.js',
        'app/images/**/*'
    ], function (event) {
        return gulp.src(event.path)
            .pipe($.connect.reload());
    });

    // Watch .scss files
    gulp.watch('app/styles/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('app/scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('app/images/**/*', ['images']);

    // Watch bower files
    gulp.watch('bower.json', ['wiredep']);
});

// Zip Build File
gulp.task('zip', function () {
    var allSrc = ['**/*'];
    return gulp.src(allSrc, {cwd: __dirname + "/dist"})
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('compiled'));
});

// Minify Data JSON
gulp.task('minify', function () {
    gulp.src(['app/data/*.json'])
        .pipe(jsonminify())
        .pipe(gulp.dest('dist/data'));
});

// Copy Data Content.
gulp.task('copy_data', function () {
    gulp.src(['app/data/presentation-content/**/*'])
        .pipe(gulp.dest('dist/data/presentation-content'));
});
