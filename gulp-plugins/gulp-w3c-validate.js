// -----------------------------------------------------------------------------
//  GULP W3C VALIDATE
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


require('colors');


function printMessages(filename, messages) {
    console.log(filename);

    messages.forEach((message) => {
        switch (message.type) {
            case 'info': {
                if (message.subType === 'warning') {
                    console.log('W3C [info]:'.yellow);
                    console.log(`${filename}: line ${message.lastLine}:`.yellow);
                    console.log(message.message.yellow);
                } else {
                    console.log('W3C [info]:'.blue);
                    console.log(`${filename}: line ${message.lastLine}:`.blue);
                    console.log(message.message.blue);
                }
                break;
            }
            case 'error': {
                console.log('W3C [error]:'.red);
                console.log(`${filename}: line ${message.lastLine}:`.red);
                console.log(message.message.red);
                break;
            }
            default: {
                console.log('W3C:'.magenta);
                console.log(`${filename}: line ${message.lastLine}:`.magenta);
                console.log(message.message.magenta);
                break;
            }
        }

        console.log(message.extract);
        console.log('\n');
    });
}


module.exports = function validate() {
    function process(file) {
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
                printMessages(filename, messages);
            });
        }).on('error', (err) => {
            console.log('SOMETHING IS WRONG WITH W3C VALIDATOR!'.red);
            console.log(err);
        });

        request.write(html);
        request.end();
    }


    function end() {
        this.emit('end');
    }


    return through(process, end);
};

