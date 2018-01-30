var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer'); // 处理css中浏览器兼容的前缀  
var rename = require('gulp-rename'); //重命名  
var sass = require('gulp-sass'); //sass
var uglify = require('gulp-uglify'); //js压缩  
var imagemin = require('gulp-imagemin'); //图片压缩 
var Config = require('./gulpfile.config.js');
//添加hash
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector')
//======= gulp build 打包资源 ===============
function prod() {
    /** 
     * HTML处理 
     */
    gulp.task('html', function () {
        return gulp.src(['./rev/*/*.json',Config.html.src]).pipe(revCollector()).pipe(gulp.dest(Config.html.dist));
    });
    /** 
     * assets文件夹下的所有文件处理 
     */
    gulp.task('assets', function () {
        return gulp.src(Config.assets.src).pipe(gulp.dest(Config.assets.dist));
    });
    /** 
     * CSS样式处理 
     */
    gulp.task('css', function () {
        return gulp.src(Config.css.src).pipe(autoprefixer('last 2 version'))
            .pipe(gulp.dest(Config.css.dist)).pipe(rename({
                suffix: '.min'
            })).pipe(sass({
                outputStyle:'compressed'
            }))//执行压缩 
            .pipe(rev()).pipe(gulp.dest(Config.css.dist)).pipe(rev.manifest())  
            .pipe(gulp.dest('./rev/css')); ;
    });
    /** 
     * SASS样式处理 
     */
    gulp.task('sass', function () {
        return gulp.src(Config.sass.src).pipe(autoprefixer('last 2 version')).pipe(sass()).pipe(gulp.dest(Config.sass.dist)).pipe(rename({
                suffix: '.min'
            })).pipe(sass({
                outputStyle:'compressed'
            }))//执行压缩  
            .pipe(rev()).pipe(gulp.dest(Config.sass.dist)).pipe(rev.manifest())  
            .pipe(gulp.dest('./rev/scss')); ;
    });
    /** 
     * js处理 
     */
    gulp.task('js', function () {
        return gulp.src(Config.js.src).pipe(gulp.dest(Config.js.dist)).pipe(rename({
            suffix: '.min'
        })).pipe(uglify()).pipe(rev()).pipe(gulp.dest(Config.js.dist)).pipe(rev.manifest())  
        .pipe(gulp.dest('./rev/js')); 
      
    });
    /** 
     * 图片处理 
     */
    gulp.task('images', function () {
        return gulp.src(Config.img.src).pipe(imagemin({
            optimizationLevel: 3
            , progressive: true
            , interlaced: true
        })).pipe(gulp.dest(Config.img.dist));
    });
    gulp.task('build', ['html', 'css', 'sass', 'js', 'assets', 'images']);
}
module.exports = prod;