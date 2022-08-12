// -----------------------------------------------------------------------------
//  GULP W3C VALIDATOR
// -----------------------------------------------------------------------------
//
//  This plugin validates the compiled pages using the W3C validator.
//
//  See more information about the W3C API here:
//  https://validator.w3.org/docs/api.html
//


const path    = require('path');
const through = require('through');
const http    = require('follow-redirects').http;

const { structuredDataTest } = require('structured-data-testing-tool');


require('colors');


function useW3CValidator(file, callback) {
    const filename = path.relative('.', file.path);
    const html = file.contents.toString();

    const options = {
        host: 'html5.validator.nu',
        path: '/?out=json',
        method: 'POST',
        headers: {
            'Content-type': 'text/html; charset=utf-8',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36'
        }
    };

    const request = http.request(options, (response) => {
        response.setEncoding('utf8');

        let result = '';

        response.on('data', (chunk) => {
            result += chunk;
        });

        response.on('end', () => {
            messages = JSON.parse(result).messages;
            printW3CMessages(filename, messages);
            callback();
        });
    }).on('error', (err) => {
        console.log('SOMETHING IS WRONG WITH W3C VALIDATOR!'.red);
        console.log(err);
    });

    request.write(html);
    request.end();
}


function printW3CMessages(filename, messages) {
    console.log(`\n\n---\nW3C: processing file...\n./${filename}`);

    messages.forEach((message) => {
        switch (message.type) {
            case 'info': {
                if (message.subType === 'warning') {
                    console.log(`W3C [info]: ${filename}: line ${message.lastLine}:`.yellow);
                    console.log(message.message.yellow);
                } else {
                    console.log(`W3C [info]: ${filename}: line ${message.lastLine}:`.blue);
                    console.log(message.message.blue);
                }
                break;
            }
            case 'error': {
                console.log(`W3C [error]: ${filename}: line ${message.lastLine}:`.red);
                console.log(message.message.red);
                break;
            }
            default: {
                console.log(`W3C: ${filename}: line ${message.lastLine}:`.magenta);
                console.log(message.message.magenta);
                break;
            }
        }

        console.log(message.extract);
    });
}


function useStructuredDataTestingTool(file) {
    const filename = path.relative('.', file.path);
    const html = file.contents.toString();

    structuredDataTest(html)
    .then((response) => {
        printStructuredDataMessages(filename, response);
    });
}


function printStructuredDataMessages(filename, result) {
    console.log(`Structured data testing tool: processing file...\n./${filename}`);

    if (result.schemas.length > 0) {
        console.log(`Schemas found: ${result.schemas.join(',')}`);

        const passed = result.passed.length;
        const failed= result.failed.length;
        const warnings = result.warnings.length;

        if (passed > 0) {
            console.log(`Passed: ${passed}`.green);
        } else {
            console.log('Passed: 0');
        }

        if (warnings > 0) {
            console.log(`Warnings: ${warnings}`.yellow);
        } else {
            console.log('Warnings: 0');
        }

        if (failed > 0) {
            console.log(`Failed: ${failed}`.red);
        } else {
            console.log('Failed: 0');
        }

        if (result.failed.length > 0) {
            result.failed.forEach((fail) => {
                console.log(`Error:\n${fail}`.red);
            });
        }
    } else {
        console.log(`No schemas found`);
    }
}



module.exports = function validate() {
    return through(function(file) {
        this.queue(file);

        useW3CValidator(file, () => {
            useStructuredDataTestingTool(file);
        });
    });
};

