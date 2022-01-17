// -----------------------------------------------------------------------------
//  CONFIG: POSTCSS
// -----------------------------------------------------------------------------
//
//  We use PostCSS after the LESS preprocessor. In other words, we use
//  LESS syntax and run PostCSS after it to check the CSS we got.
//
//  See https://postcss.org/ for more information.
//


require('colors');


module.exports = {
    plugins: [
        // This plugin can list IDs in the CSS.
        // We shouldn't use them and it shows to us all of them
        // during the building process.
        require('list-selectors').plugin((list) => {
            console.log('\n\n');

            list.simpleSelectors.ids.forEach((id) => {
                console.log(`${'ID'.red}:\n\n    ${id} {\n        . . .\n    }`);
            });

            console.log('\n');
        }),


        // This plugin lists all CSS rules that are not supported in the
        // target browsers listed in package.json.
        require('doiuse')(
            require('./doiuse.config.js')
        ),


        // This one compresses our CSS after all manipulations.
        // This is the latest step of modifying of the CSS.
        require('cssnano')({
            preset: ['default', {
                discardComments: {
                    removeAll: true
                }
            }]
        })
    ]
};

