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
import shell from 'gulp-shell'

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
    .pipe(gulp.dest('dist/js'))
}

function imagesMinTask() {
  return gulp.src('src/assets/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/assets/images'))
}

function htmlMinTask() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
}

function sassTask() {
  return gulp.src('src/styles/sass/*.sass')
    .pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(concat('index.min.css'))
    .pipe(gulp.dest('dist/styles'))
}

function lessTask() {
  return gulp.src('src/styles/less/*.less')
    .pipe(less({plugins: [cleanCss]}))
    .pipe(concat('less.min.css'))
  .pipe(gulp.dest('dist/styles'))
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
  gulp.watch('src/*.html', htmlMinTask)
}

function clean() {
  return gulp.src('*.js', { read: false })
  .pipe(shell('rm -rf dist && rm -rf tmp'))
}

function deploy(done) {
  return gulp.series(tsTask, minJsTask, imagesMinTask, htmlMinTask, sassTask, lessTask)(done)
}

function serve() {
  browserSync({
    server: {
      baseDir: 'dist/'
    },
    open: false,
    notify: true,
  });
  deploy()
  watch()
  gulp.watch(['dist/*.html', 'dist/styles/*.css', 'dist/js/*.js', 'dist/assets/images/*'])
    .on('change', browserSync.reload)
}

gulp.task(lint) // when not using typescript
gulp.task(tsTask)
gulp.task(minJsTask)
gulp.task(imagesMinTask)
gulp.task(htmlMinTask)
gulp.task(sassTask)
gulp.task(watch)
gulp.task(clean)
gulp.task(deploy)
gulp.task(serve)

gulp.task('default',
  gulp.series(deploy, watch));