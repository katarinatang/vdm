var fs           = require('fs'),
    gulp         = require('gulp'),
    sass         = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    compass      = require('gulp-compass'),
    minifycss    = require('gulp-minify-css'),
    concat       = require('gulp-concat'),
    wrap         = require('gulp-wrap'),
    fileinclude  = require('gulp-file-include'),
    rename       = require('gulp-rename'),
    flatten      = require('gulp-flatten'),
    svgstore     = require('gulp-svgstore'),
    svgmin       = require('gulp-svgmin'),
    sourcemaps   = require('gulp-sourcemaps'),
    gutil        = require('gulp-util'),
    uglify       = require('gulp-uglify'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    path         = require('path')

/**
 * Config
 */
var config = {
  ports : {
    webserver  : 4000,
    livereload : 4002
  },
  debug : true
}


/**
 * Asset Paths
 */
var paths = {
  app        : './app/',
  components : './app/components/',
  assets     : './app/assets/',
  css        : './app/assets/css',
  js         : './app/assets/js',
  src        : './app/src/',
  partials   : './app/partials/',
}



/**
 * TASK: Express Server
 */
gulp.task('express', function() {
  var express = require('express')
  var app = express()
  app.use(require('connect-livereload')({ port: config.ports.livereload }))
  app.use(express.static(__dirname + '/app'))
  app.listen( config.ports.webserver )

  gutil.log( gutil.colors.black.bgYellow( ' EXPRESS SERVER RUNNING ' ), gutil.colors.bgCyan.black( ' http://localhost:' + config.ports.webserver + ' ') )
})


/**
 * TASK: Live Reload
 */
var tinylr
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')()
  tinylr.listen( config.ports.livereload )
})


/**
 * TASK: Styles
 */
gulp.task('styles', function() {
  return sass( paths.assets + 'sass/', { style: 'expanded' })
    .on('error', logError)
    .pipe(sourcemaps.init())
    .pipe(gulp.dest( paths.assets + '/css' ))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest( paths.assets + '/css' ))
})


/**
 * TASK: Partials
 */
gulp.task('partials', function() {
  return gulp.src([ paths.src + '**/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: './app/partials/'
    }))
    .pipe(rename({
      extname : ''
    }))
    .pipe(rename({
      extname : '.html'
    }))
    .pipe(gulp.dest(paths.app))
})



/**
 * TASK: Build
 */
gulp.task('build', function() {
  
})




/**
 * TASK: Watch
 */
gulp.task('watch', function() {
  gulp.watch(['./app/assets/**/*.scss'], ['styles'], notifyLiveReload)
  gulp.watch(['./app/src/*.html', './app/partials/*.tpl.html'], ['partials'])
  gulp.watch(['./app/src/*.html', './app/partials/*.tpl.html']) // @removed notifyLiveReload
  gulp.watch(['./app/assets/**/*.css'], notifyLiveReload)
})

gulp.task('default', [
  'express', 
  'livereload', 
  'partials', 
  'styles', 
  'watch'
], function() {

})



/**
 * Private Methods
 *
 * notifyLiveReload()
 * logError()
 * formatError()
 */

/**
 * Debugging Methods
 */
function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname + '/app', event.path)

  tinylr.changed({
    body: {
      files: [fileName]
    }
  })

  // Get filename from path
  var filename = event.path.match(/\/[^\/]+$/g)[0].replace('/', '')

  // Logging
  gutil.log( gutil.colors.black.bgGreen( ' ' + event.type.toUpperCase() + ' '), gutil.colors.yellow( filename ) )

}
function logError(error) {

    var err = formatError(error)

    // Logging
    gutil.log( gutil.colors.bgRed(' ERROR '), gutil.colors.bgBlue( ' ' + err.plugin + ' ' ), gutil.colors.black.bgWhite( ' ' + err.message + ' ' ) )
    gutil.beep()

    this.emit('end')

    function formatError(obj) {

      var obj     = obj || {},
          msg     = obj.message || obj[0],
          plugin  = obj.plugin || null

      // clean up
      msg = msg.replace('error ', '')

      return {
        message: msg,
        plugin : plugin
      }

    }
}