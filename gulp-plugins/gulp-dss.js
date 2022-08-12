// -----------------------------------------------------------------------------
//  GULP DSS
// -----------------------------------------------------------------------------
//
//  This plugin generates the docs for UI components using the comments in CSS
//  (or LESS in our case) files.
//


const fs         = require('fs');
const dss        = require('dss');
const pug        = require('pug');
const path       = require('path');
const File       = require('gulp-util').File;
const through    = require('through');


module.exports = function gulpDSS(options) {
    const files = [];
    const template = fs.readFileSync(`${options.templatePath}/index.pug`, 'utf-8');

    Object.keys(options.parsers).forEach((key) => {
        dss.parser(key, options.parsers[key]);
    });


    function process(file) {
        const filename = path.relative('.', file.path);
        console.log(`DSS: processing file (${filename})...`);

        dss.parse(file.contents.toString(), {}, (parsed) => {
            parsed.file = path.relative('.', file.path);

            if (parsed.blocks) {
                parsed.blocks.forEach((block) => {
                    if (block.markup) {
                        const example = 'include ../index.pug\n' + block.markup.example;

                        block.markup.compiled = pug.render(example, {
                            pretty: true,
                            basedir: '.',
                            filename: parsed.file
                        });
                    }
                });
            }

            files.push(parsed);
        });
    }


    function end() {
        const html = pug.render(template, {
            pkg: options.pkg,
            pretty: true,
            filename: 'src/docs/index.pug',
            basedir: '.',
            files
        });

        this.emit('data', new File({
            path: 'index.html',
            contents: Buffer.from(html, 'utf-8')
        }));

        this.emit('end');
    }


    return through(process, end);
};

