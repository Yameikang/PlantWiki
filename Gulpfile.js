var gulp = require('gulp');
var watch = require('gulp-watch');
var path = 'PlantWiki-ymk/test/*.js';
gulp.task('watch', function () {
    gulp.watch(['PlantWiki-ymk/**/*.js', 'PlantWiki-ymk/*.js'], ['mocha']);
});
var mocha = require('gulp-mocha');
gulp.task('mocha', function () {
    return gulp.src(path, {read: false}).pipe(mocha({reporter: 'spec'}));
});
gulp.task('default', ['mocha', 'watch']);
// gulp-mocha needs filepaths so you can't have any plugins before it