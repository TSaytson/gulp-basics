import gulp from 'gulp'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
import less from 'gulp-less'
import LessPluginCleanCSS from 'less-plugin-clean-css'
import concat from 'gulp-concat'
import ts from 'gulp-typescript'
import uglify from 'gulp-uglify'
import imagemin from 'gulp-imagemin'
import htmlmin from 'gulp-htmlmin'
import browserSync from 'browser-sync'
import jshint from 'gulp-jshint'

const sass = gulpSass(dartSass);
const cleanCss = new LessPluginCleanCSS({ advanced: true });

function tsTask() {
  return gulp.src('src/ts/*.ts')
    .pipe(ts({
      noImplicitAny: true,
      outFile: 'index.js'
    }))
    .pipe(gulp.dest('tmp/js'))
}

function minJsTask() {
  return gulp.src('tmp/js/*.js')
    .pipe(concat('index.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'))
}

function imagesMinTask() {
  return gulp.src('src/assets/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/assets/images'))
}

function htmlMinTask() {
  return gulp.src('src/html/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('.'))
}

function sassTask() {
  return gulp.src('src/styles/sass/*.sass')
    .pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(concat('index.min.css'))
    .pipe(gulp.dest('./build/styles/'))
}

function lessTask() {
  return gulp.src('src/styles/less/*.less')
    .pipe(less({plugins: [cleanCss]}))
    .pipe(concat('less.min.css'))
  .pipe(gulp.dest('build/styles'))
}

function lint() { // when not using typescript
  return gulp.src('tmp/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
  .pipe(jshint.reporter('fail'))
}

function watch() {
  console.log('Gulp Watch is working...')
  gulp.watch('src/styles/sass/*.sass', sassTask)
  gulp.watch('src/styles/less/*.less', lessTask)
  gulp.watch('src/ts/*.ts', gulp.series(tsTask, minJsTask))
  gulp.watch('src/assets/images/*', imagesMinTask)
  gulp.watch('src/html/*.html', htmlMinTask)
}

function build(done) {
  return gulp.series(tsTask, minJsTask, imagesMinTask, htmlMinTask, sassTask, lessTask)(done)
}

function serve() {
  browserSync({
    server: {
      baseDir: './'
    },
    open: false,
    notify: true,
  });
  build()
  watch()
  gulp.watch(['*.html', 'build/styles/*.css', 'build/js/*.js', 'build/assets/images/*'])
    .on('change', browserSync.reload)
}

gulp.task(lint) // when not using typescript
gulp.task(tsTask)
gulp.task(minJsTask)
gulp.task(imagesMinTask)
gulp.task(htmlMinTask)
gulp.task(sassTask)
gulp.task(watch)
gulp.task(build)
gulp.task(serve)

gulp.task('default',
  gulp.series(build, watch));