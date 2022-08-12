# Void

![version](https://img.shields.io/github/package-json/v/sfi0zy/void?style=flat-square) ![license](https://img.shields.io/github/license/sfi0zy/void?style=flat-square)


This is a boilerplate designed for static promotional websites. It's based on Pug templates, LESS, PostCSS and ES6+. No SPA frameworks included.

![Void](/src/bin/images/main.png)



## Features

The main tools in the boilerplate are:

- **For HTML:**
    - Pug preprocessor
    - W3C validator
    - Structured data testing tool
    - Inline SVG images
- **For CSS:**
    - LESS
    - Stylelint
    - PostCSS
    - Doiuse (warns us, if we used unsupported CSS properties)
    - Critical CSS extraction
    - Golden Canon Grid
- **For JS:**
    - Webpack + Babel (preset-env)
    - ESlint
    - SonarJS
    - Structure for the project with events, UI components, flags e.t.c.
- **Others:**
    - Favicon generator
    - SVG placeholders generator (for lazy-loaded images)
    - Docs generator for UI components (based on DSS)
    - GLSL loader
    - Web Font Loader

These tools and detailed comments in the pre-created files with the structure of the project help us to develop websites fast and keep the code clean.



## Getting started

Node v16.16.0 is recommended.

At first, you need to clone the Void and install the dependencies. There are almost 50 dependencies, so it may take some time.

```sh
git clone https://github.com/sfi0zy/void.git my-awesome-project
cd my-awesome-project
npm i
```

Now you can use the one of the two modes.

The development mode with BrowserSync and sourcemaps (the generated docs are served at ```/docs/``` url).

```sh
npm run dev
```

The production mode with ESLint and W3C validator:

```sh
npm run prod
```

That's all you need to start the development of your awesome project.



## Structure

The structure of the Void is quite simple. We have a ```window.APP``` object. It's a global thing that includes everything - dependencies, polyfills, modules, ui components, etc. You can look at it in the console.

![App structure](/app-structure.svg)


We use it everywhere and it helps to keep the same structure in different projects. And it helps to debug the code as well because we see all events and components in one place.

The logical parts of the APP can be enabled or disabled using the APP.FLAGS object.

**All ideas and conventions are explained in the comments in the source code, so if you're interested in using of Void, you'd better read them.**



## Dependencies

The full list of the dependencies with descriptions can be found in the docs template in ```/src/docs/``` or in the docs page, generated during the build process.



## Browser support

The boilerplate is created for modern evergreen browsers, but technically the browser support depends not on the boilerplate, but on your code. If you'll use CSS or JS features, which are not supported by browsers, you have to add the polyfills manually. The number of them is infinite and it's a terrible idea to add them all to the boilerplate itself.

The browserslist for the doiuse and other tools is defined in the ```package.json```.


## Practical usage

The basic process of development looks like this:

1. Clone the repository.
2. Check the information in ```package.json``` and change the origins for git, if you need to.
3. Install the dependencies with ```npm i```.
4. Uncomment the pre-installed dependencies you want to use in ```/src/core/js/dependencies.js``` (or add your own ones).
5. Do the same thing with the polyfills in ```/src/core/js/polyfills.js```.
6. Put your images, fonts and 3d models into ```/src/bin/```.
7. Start the development server with ```npm run dev```.
8. Check the settings for Web Font Loader in ```/src/main.js/```.
9. Add your non-UI code as modules to ```/src/modules/``` (use the VoidGenerator as an example).
10. Import your modules to the ```MODULES``` field of the ```APP``` in ```/src/main.js```.
11. Add the global styles, constants for LESS and your color scheme into the files in ```/src/core/less/```.
12. Add your UI components to ```/src/ui-components/``` (use Void as an example and V as an empty template).
13. Import your UI components to the ```UI``` field of the ```APP``` in ```/src/main.js```, in ```/src/main.less``` and ```/src/ui-components/index.pug```.
14. Add your pages to ```/src/pages/```. Subdirectories are available.
15. Run ```npm run prod``` to activate the production build.
16. If all is OK, get the ```/dist/``` directory ant put it on your server.

**You can use ```console.log(APP)``` any time to obtain all the information about the loaded dependencies and polyfills, registered and created components, events, etc.**



## Have any questions or found a new bug?

Feel free to open an issue in this repository.

A number of errors and warnings are "predefined" for every type of code in the project (3 for HTML, 1 for LESS, 3 for JS). If you see all of them in your first build after ```npm i```, it means that all linters, validators and analysers work. It's not a bug, it's a dummy test to make sure they are not broken. Just enjoy the detailed, colorful log.



## License

MIT License

Copyright (c) 2021-2022 Ivan Bogachev <sfi0zy@gmail.com>

ヾ( °-°)シﾟ`･｡･°*♪･ﾟ’☆

