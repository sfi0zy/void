// -----------------------------------------------------------------------------
//  UTILS
// -----------------------------------------------------------------------------
//
//  Here we store the common utils. These functions are too small to create
//  modules for every of them.
//


function generateRandomString(length = 8) {
    const possibleChars = 'abcdefghijklmnopqrstuvwxyz0123456789';

    let str = '';

    for (let i = 0; i < length; i++) {
        str += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    }

    return str;
}


function compileTemplate(template, data) {
    return template.replace(/{{\s*(\w*)\s*}}/g, (str, key) => {
        return (key in data) ? data[key] : '';
    });
}


// -----------------------------------------------------------------------------


const UTILS = {
    generateRandomString,
    compileTemplate
};


export default UTILS;

