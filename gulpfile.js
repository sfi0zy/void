// -----------------------------------------------------------------------------
//  GULPFILE
// -----------------------------------------------------------------------------
//
//  All steps of the building process are here.
//



const gulp         = require('gulp');
const $            = require('gulp-load-plugins')();
const fs           = require('fs');
const path         = require('path');
const argv         = require('yargs').argv;
const semver       = require('semver');
const webpack      = require('webpack-stream');
const critical     = require('critical').stream;
const browserSync  = require('browser-sync').create();

const dss             = require('./gulp-plugins/gulp-dss.js');
const SVGPlaceholders = require('./gulp-plugins/gulp-svg-placeholders');
const validate        = require('./gulp-plugins/gulp-w3c-validate');


require('colors');


const pkg         = JSON.parse(fs.readFileSync('./package.json'));
const ENVIRONMENT = argv.production ? 'production' : 'development';



// -----------------------------------------------------------------------------
//  INFORMATION ABOUT THIS PROJECT
// -----------------------------------------------------------------------------
//
//  The process begins with displaying information about the current project.
//  This is a very good idea, because the log includes a lot of information
//  which helps us to understand where can be a problem if the build fails.
//  Also, the build log can be used in conversations and no needed to describe
//  what project we are talking about, what versions of dependencies are used etc.
//


// Current time
console.log(`${(new Date()).toString().white}\n`);

// Node.js version
if (semver.satisfies(process.version, pkg.engines.node)) {
    console.log('Node %s (recommended %s)\n'.green, process.version, pkg.engines.node);
} else {
    console.log('(!) Node %s (recommended %s)\n'.red, process.version, pkg.engines.node);
}

// Console command that starts the gulp
console.log(`> ${argv.$0} ${argv._}`);

// Current environment
console.log(ENVIRONMENT.toUpperCase().yellow);

// Version of this package
console.log(`${pkg.name.red} ${pkg.version.green}\n`);

// Target browsers
console.log('%s\n'.blue, pkg.browserslist);




// -----------------------------------------------------------------------------
//  LIST AND SAVE THE DEPENDENCIES
// -----------------------------------------------------------------------------
//
// Sometimes we want to know the real versions of the main dependencies in
// the project. Package-lock file is not human-friendly, so we save the current
// versions of the dependencies right in the package.json. We'll must update
// them manually in the future, but the most of promotional projects
// don't require long-term support. So we can freeze the dependencies and
// never update them.
//


console.log('DEPENDENCIES:');

Object.keys(pkg.dependencies).forEach((dependency) => {
    const depPackage = JSON.parse(
        fs.readFileSync(
            path.join('node_modules', dependency, 'package.json'), 'utf-8'));

    if (depPackage._requested.registry) {
        pkg.dependencies[dependency] = depPackage.version;
        console.log('NPM %s@%s'.green, dependency, depPackage.version);
    } else {
        pkg.dependencies[dependency] = depPackage._resolved;
        console.log('--- %s@%s'.green, dependency, depPackage._resolved);
    }
});


console.log('\nDEV DEPENDENCIES:');

Object.keys(pkg.devDependencies).forEach((dependency) => {
    const depPackage = JSON.parse(
        fs.readFileSync(
            path.join('node_modules', dependency, 'package.json'), 'utf-8'));

    if (depPackage._requested.registry) {
        pkg.devDependencies[dependency] = depPackage.version;
        console.log('NPM %s@%s'.green, dependency, depPackage.version);
    } else {
        pkg.devDependencies[dependency] = depPackage._resolved;
        console.log('--- %s@%s'.green, dependency, depPackage._resolved);
    }
});


const newPackageJSON = JSON.stringify(pkg, null, 2);

fs.writeFileSync(path.join('package.json'), newPackageJSON, 'utf-8');

console.log('\n\n\n');




// -----------------------------------------------------------------------------
//  GULP TASKS
// -----------------------------------------------------------------------------
//
//  We prefer to use the small tasks for the different logical actions.
//



// -----------------------------------------------------------------------------
//  ACTIONS
// -----------------------------------------------------------------------------


gulp.task('void:clean-dist', () => {
    return gulp.src('./dist/*', { read: false })
        .pipe($.clean());
});



gulp.task('void:lint-js', () => {
    return gulp.src('./src/**/*.js')
        .pipe($.eslint())
        .pipe($.eslint.format());
});



gulp.task('void:compile-js', () => {
    return gulp.src('./src/main.js')
        .pipe(webpack(require('./webpack.config.js')[ENVIRONMENT]))
        .pipe($.rename('main.min.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
});



gulp.task('void:lint-less', () => {
    return gulp.src('./src/**/*.less')
        .pipe($.stylelint({
            failAfterError: false,
            reporters: [
                { formatter: 'string', console: true }
            ]
        }));
});


gulp.task('void:compile-less', () => {
    return gulp.src('./src/main.less')
        .pipe($.if(ENVIRONMENT === 'development', $.sourcemaps.init()))
        .pipe($.less())
        .pipe($.postcss())
        .pipe($.if(ENVIRONMENT === 'development', $.sourcemaps.write()))
        .pipe($.rename('main.min.css'))
        .pipe($.size({ showFiles: true }))
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
});



gulp.task('void:generate-favicon', (done) => {
    $.realFavicon.generateFavicon(
        require('./favicon.config.js'), () => {
            done();
        }
    );
    done();
});



gulp.task('void:copy-images', () => {
    return gulp.src('src/bin/images/*')
        .pipe(gulp.dest('dist/bin/images'))
        .pipe(browserSync.stream());
});



gulp.task('void:copy-3d', () => {
    return gulp.src('src/bin/3d/*')
        .pipe(gulp.dest('dist/bin/3d'))
        .pipe(browserSync.stream());
});



gulp.task('void:copy-fonts', () => {
    return gulp.src('src/bin/fonts/*')
        .pipe(gulp.dest('dist/bin/fonts'))
        .pipe(browserSync.stream());
});


gulp.task('void:generate-placeholders', () => {
    return gulp.src('dist/bin/images/*.{jpg,png}')
        .pipe(SVGPlaceholders())
        .pipe(gulp.dest('./dist/bin/images'));
});



gulp.task('void:build-pages', () => {
    return gulp.src('src/pages/**/*.pug')
        .pipe($.pug({
            locals: {
                pkg,
            },
            pretty: true
        }))
        .pipe($.realFavicon.injectFaviconMarkups(
            JSON.parse(fs.readFileSync('faviconData.json')).favicon.html_code))
        .pipe($.injectSvg())
        .pipe(critical(require('./critical.config.js')))
        .pipe(gulp.dest('./dist'))
        .pipe($.if(ENVIRONMENT === 'production', validate()))
        .pipe(browserSync.stream());
});



gulp.task('void:build-docs', () => {
    return gulp.src('./src/ui-components/**/*.less')
        .pipe(dss({
            pkg,
            templatePath: './src/docs',
            parsers: require('./dss.parsers.js'),
            outputPath: './dist/docs/'
        }))
        .pipe($.injectSvg())
        .pipe(gulp.dest('./dist/docs/'))
        .pipe($.if(ENVIRONMENT === 'production', validate()))
        .pipe(browserSync.stream());
});



// -----------------------------------------------------------------------------
//  ALL ACTIONS TOGETHER
// -----------------------------------------------------------------------------
//
//  The order is important here. CSS must be generated before HTML, because
//  the critical CSS for HTML can't be obtained without CSS, SVG placeholders
//  must be created before docs and pages because we inline SVG right into the
//  pages and these images must be ready when we compile HTML, etc.
//

gulp.task('void', gulp.series(
    'void:clean-dist',
    'void:lint-js',
    'void:compile-js',
    'void:lint-less',
    'void:compile-less',
    'void:generate-favicon',
    'void:copy-images',
    'void:copy-3d',
    'void:copy-fonts',
    'void:generate-placeholders',
    'void:build-pages',
    'void:build-docs',
));



// -----------------------------------------------------------------------------
//  BROWSER SYNC
// -----------------------------------------------------------------------------

gulp.task('browser-sync', () => {
    browserSync.init({
        server: './dist',
        files: ['./src/**']
    });


    gulp.watch([
        './src/**/*.js',
        './src/**/*.glsl',
    ], gulp.series('void:compile-js'));


    gulp.watch([
        './src/**/*.less',
    ], gulp.series(
        'void:lint-less',
        'void:compile-less',
        'void:build-docs'
    ));


    gulp.watch([
        './src/bin/images/*'
    ], gulp.series(
        'void:copy-images',
        'void:generate-placeholders'
    ));


    gulp.watch([
        './src/bin/3d/*'
    ], gulp.series('void:copy-3d'));


    gulp.watch([
        './src/bin/fonts/*'
    ], gulp.series('void:copy-fonts'));


    gulp.watch([
        './src/**/*.pug'
    ], gulp.series('void:build-pages'));


    gulp.watch([
        './src/**/*.pug'
    ], gulp.series('void:build-docs'));
});



// -----------------------------------------------------------------------------
//  DEFAULT TASK
// -----------------------------------------------------------------------------

gulp.task('default', (done) => {
    switch (ENVIRONMENT) {
        case 'production': {
            gulp.series(
                'void',
            )();

            break;
        }

        case 'development': {
            gulp.series(
                'void',
                'browser-sync'
            )();

            break;
        }

        default: {
            break;
        }
    }

    done();
});

