var projectName = "ui-starter-kit"; // Change this

// Paths. Change to suit the project's needs.
const paths = {
    srcPages: 'src/pages/',
    srcSass:  'src/scss/',
    srcJs:    'src/assets/js/',
    srcImg:   'src/assets/img/',
    srcFonts: 'src/assets/fonts/',
    srcIcons: 'src/assets/icons/',
    
    destPages: 'public/',
    destCss:   'public/assets/css/',
    destJs:    'public/assets/js/',
    destImg:   'public/assets/img/',
    destFonts: 'public/assets/fonts/',
    destIcons: 'public/assets/img/',
};

const port = 8686;

const { src, dest, series, parallel, watch } = require('gulp');
const ap          = require('autoprefixer');
const cssnano     = require('cssnano');
const connect     = require('gulp-connect');
const dirSync     = require('gulp-directory-sync');
const nunjucksRender = require('gulp-nunjucks-render');
const postcss     = require('gulp-postcss');
const prettify    = require('gulp-prettify');
const gulpSass    = require('gulp-sass');
const svgSprite   = require('gulp-svg-sprite');
const sourcemaps  = require('gulp-sourcemaps');

const path = require('path');

// Sass (with sourcemaps)
function sass() {
    return src( paths.srcSass + '**/*.scss' )
        .pipe(sourcemaps.init()) // have to init sourcemaps before running sass
        .pipe(gulpSass().on('error', gulpSass.logError))
        .pipe(gulpSass({outputStyle: 'expanded'})) // Converts Sass to CSS with gulp-sass
        .pipe(sourcemaps.write('./maps'))
        .pipe(dest( paths.destCss ))
}

// Sass (without sourcemaps)
function sassSolo() {
    console.log('Generating CSS without sourcemap...');
    return src(paths.srcSass + '**/*.scss')
        .pipe(gulpSass().on('error', gulpSass.logError))
        .pipe(gulpSass({outputStyle: 'expanded'})) // Converts Sass to CSS with gulp-sass
        .pipe(dest(paths.destCss))
}

// Autoprefixer for CSS
function autoprefixer() {
    console.log('Running autoprefixer...');
    
    var plugins = [
        ap({
            cascade: false
        })
    ];
    
    return src(paths.destCss + '*.css')
        .pipe(postcss(plugins))
        .pipe(dest(paths.destCss));
}

// Minification of CSS
function minifyCss() {
    console.log('Minifying CSS...');
    
    var plugins = [
        cssnano()
    ];
    
    return src(paths.destCss + '*.css')
        .pipe(postcss(plugins))
        .pipe(dest(paths.destCss));
}

// HTML pages
function pages() {
    return src([
            paths.srcPages + '**/*.njk',
            '!' + paths.srcPages + 'templates/**/*.njk'
        ])
        .pipe(nunjucksRender({
            path: paths.srcPages
        }))
        .pipe(prettify({indent_size: 2}))
        .pipe(dest( paths.destPages ));
}

// SVG icons sprite
function icons() {
    var spriteName = 'project-icons.svg'; // Change this

    config = {
        svg : {
            namespaceIDs: false
        },
        shape : {
            id : {
                generator: function(name, file) {
                    // Split on path separator, get the last piece, slice out the extension (.svg) from that piece
                    id = name.split(path.sep).pop().slice(0, -4);
                    return id;
                }
            }
        },
        mode : {
            symbol : {
                dest: "",
                sprite: spriteName
            }
        }
    };
    
    console.log("Taking source SVGs from " + paths.srcIcons + " and making SVG sprite " + spriteName + "...");
    
    return src( paths.srcIcons + "**/*.svg" )
        .pipe(svgSprite( config ))
        .on('error', function(error) {
            console.log(error)
        })
        .pipe(dest( paths.destIcons ));
}

// Images
function syncImages() {
    return src(paths.srcImg + '**/*')
        .pipe(dest(paths.destImg));
}

// JS
function syncJs(cb) {
    return src(paths.srcJs + '**/*')
        .pipe(dest(paths.destJs));
}

// Fonts
function syncFonts(cb) {
    return src(paths.srcFonts + '**/*')
        .pipe(dest(paths.destFonts));
}

// For livereloading the changes in the browser
function reload() {
    return src(paths.destPages)
        .pipe(connect.reload());
}

// Serve the destDir
function serve(cb) {
    connect.server({
        root: paths.destPages,
        port: port,
        livereload: false
    });
    
    cb();
    
    watch(paths.srcSass  + '**/*.scss', series(sass)); 
    watch(paths.srcPages + '**/*.njk' , series(pages));
    watch(paths.srcImg   + '**/*'     , series(syncImages));
    watch(paths.srcJs    + '**/*'     , series(syncJs));
    watch(paths.srcFonts + '**/*'     , series(syncFonts));
    watch(paths.srcIcons + '**/*'     , series(icons));
}

// Same as serve(), but with livereload
function autoserve(cb) {
    connect.server({
        root: paths.destPages,
        port: port,
        livereload: true
    });
    
    cb();
    
    watch(paths.srcSass  + '**/*.scss', series(sass, reload)); 
    watch(paths.srcPages + '**/*.njk' , series(pages, reload));
    watch(paths.srcImg   + '**/*'     , series(syncImages, reload));
    watch(paths.srcJs    + '**/*'     , series(syncJs, reload));
    watch(paths.srcFonts + '**/*'     , series(syncFonts, reload));
    watch(paths.srcIcons + '**/*'     , series(icons, reload));
}

exports.sass = sass;
exports.sassSolo = sassSolo;
exports.autoprefixer = series(sassSolo, autoprefixer);
exports.minify = series(sassSolo, autoprefixer, minifyCss);
exports.pages = pages;
exports.icons = icons;
exports.fonts = syncFonts;
exports.img = syncImages;
exports.js = syncJs;
exports.serve = serve;
exports.autoserve = autoserve;
