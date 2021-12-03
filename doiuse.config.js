// -----------------------------------------------------------------------------
//  CONFIG: DOIUSE
// -----------------------------------------------------------------------------
//
//  We use the "doiuse" npm module for displaying the information about
//  the CSS features we used, if the browsers don't support them yet.
//
//  See https://www.npmjs.com/package/doiuse for more options.
//


require('colors');


module.exports = {
    ignore: [
        'text-size-adjust', // Experimental thing. Missed in FF and Safari.
        'css-appearance',   // All browsers have partial support of this thing.
        'multicolumn',      // All browsers have partial support of this thing.
    ],


    onFeatureUsage(info) {
        const selector = info.usage.parent.selector;
        const property = `${info.usage.prop}: ${info.usage.value}`;

        let status = info.featureData.caniuseData.status.toUpperCase();

        if (info.featureData.missing) {
            status = 'NOT SUPPORTED'.red;
        } else if (info.featureData.partial) {
            status = 'PARTIAL SUPPORT'.yellow;
        }

        console.log(`\n${status}:\n\n    ${selector} {\n        ${property};\n    }\n`);
    }
};

