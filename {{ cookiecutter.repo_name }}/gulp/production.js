import fs from 'fs'
import gulp from 'gulp'
import rev from 'gulp-rev'
import revReplace from 'gulp-rev-replace'
import htmlmin from 'gulp-htmlmin'
import cleancss from 'gulp-clean-css'
import purifycss from 'gulp-purifycss'
import uglify from 'gulp-uglify'
import header from 'gulp-header'

const BANNER = fs.readFileSync('banner.txt', 'utf8').replace('@date', (new Date()))


gulp.task('rev', () =>
  gulp.src(['public/**/*', '!**/*.html', '!**/*.txt', '!**/*.ico'])
    .pipe(rev())
    .pipe(gulp.dest('public/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('public/')))

gulp.task('rev:replace', ['rev'], () => {
  const manifest = gulp.src('public/rev-manifest.json')
  return gulp.src('public/**/*')
    .pipe(revReplace({
      manifest,
    }))
    .pipe(gulp.dest('public/'))
})

gulp.task('purifycss', () =>
  gulp.src('public/**/*.css')
    .pipe(purifycss(['public/**/*.js', 'public/**/*.html']))
    .pipe(gulp.dest('public/')))

gulp.task('minify:html', () =>
  gulp.src(['public/**/*.html'])
    .pipe(htmlmin({
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: {
        preserveComments: 'license',
        compressor: {
          screw_ie8: true,
        },
      },
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
    }))
    .pipe(gulp.dest('public/')))

gulp.task('minify:css', () =>
  gulp.src('public/**/*-*.css')
    .pipe(cleancss())
    .pipe(header(BANNER))
    .pipe(gulp.dest('public/')))

gulp.task('minify:js', () =>
  gulp.src('public/**/*-*.js')
    .pipe(uglify({
      preserveComments: 'license',
      compressor: {
        screw_ie8: true,
      },
      output: {
        preamble: BANNER,
      }
    }))
    .pipe(gulp.dest('public/')))
