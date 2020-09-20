# UI starter kit

The UX team at Synergy-IT work on static HTML/CSS files in the initial stages of a project either to prototype ideas or to develop static UI for the developers to build on. This repository is a starter kit for such HTML and CSS authoring projects.

## How to use this repository for a new project

Follow these steps:

1. Download this repository using the "Download" button above.
1. Extract its contents, and make the following changes:
    - Rename the directory from `ui-starter-kit` to whatever the project name is.
    - Remove `README.md` (this file), and rename `README-sample.md` to `README.md`.
    - In the new `README.md`, replace `[Project name]` with the project name.
1. Initialize a new Git repository for the project and push the above changes there.
1. Start working! (See the new `README.md`)

There are other changes too that may/should be made in `package.json`, `gulpfile.js`, and other source files; most (but not all) are marked with "Change this" comments.

# Notes about this repository (and our process, in general)

Following are some notes explaining the contents of this repository and our workflow.

## Prerequisites

You should have [Node.js](https://nodejs.org/) installed. The LTS (long term support) version is recommended.

We use [gulp](https://gulpjs.com/) to automate our HTML and CSS build steps, as well as for other things. It is available as a Node.js package and can be installed via npm (the default package manager for Node.js):

```
# Install gulp-cli as a global package
$ npm install gulp-cli -g
```

Other npm package dependencies are listed in `package.json`. You can install them via:

```
# Make sure you are in the same directory as package.json
$ npm install
```

The above command will create a `node_modules/` directory. (It is ignored in version control via `.gitignore`.)

More information about npm can be found in its [official docs](https://docs.npmjs.com/).

## File structure

```
ui-starter-kit
├── public/
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css
│   │   ├── fonts/
│   │   ├── img/
│   │   └── js/
│   └── *.html
├── src/
│   ├── assets/
│   │   ├── fonts/
│   │   ├── icons/
│   │   │   └── *.svg
│   │   ├── img/
│   │   └── js/
│   ├── pages/
│   │   ├── templates/
│   │   │   ├── macros/
│   │   │   │   └── *.njk
│   │   │   ├── partials/
│   │   │   │   └── *.njk
│   │   │   └── layout.njk
│   │   └── *.njk
│   └── scss/
│       ├── blocks/
│       ├── vendor/
│       ├── *.scss
│       └── style.scss
├── README-sample.md
├── README.md
├── gulpfile.js
├── package-lock.json
└── package.json
```

The `src/` directory contains all the source files and assets. The `public/` directory contains the generated HTML and CSS files, as well as copied assets (fonts, images, JS etc.)

`{package|package-lock}.json` files are used by `npm install` for installing the required packages.

`gulpfile.js` includes the tasks for building HTML pages and CSS, as well as for automating some other tasks.

**Note:** All the `gulp <task>` commands below should be run from the same directory where `gulpfile.js` resides.


## HTML

To generate the HTML pages from the source templates in `src/pages/`, run:

```
$ gulp pages
```

We use the [Nunjucks](https://mozilla.github.io/nunjucks/) templating engine. The above command will take all the `*.njk` templates from `src/pages/`, generate HTML pages, run them through [gulp-prettify](https://www.npmjs.com/package/gulp-prettify) for pretty output, and save them in the `public/` directory.

## CSS

To generate the CSS from source Sass files in `src/sass`, run:

```
$ gulp sass
```

The above will create `style.css` in `public/assets/css/` directory. It will also create a `maps` directory in there that will contains the sourcemap for easier debugging in browser's developer tools.

To generate CSS without sourcemaps, run:

```
$ gulp sassSolo
```

And finally, the following command should be run before committing CSS changes to Git:

```
$ gulp autoprefixer
```

This will generate `style.css` without sourcemaps, and then use [Autoprefixer](https://github.com/postcss/autoprefixer) to add vendor prefixes to CSS rules.

## Images, fonts, and JS

The following three tasks are related to images, fonts, and JS, respectively:

```
$ gulp img
$ gulp fonts
$ gulp js
```

All of them simply copy the contents of `src/assets/img/`, `src/assets/fonts/`, and `src/assets/js/` to respective directories in `public`. (See also the [related issue](https://gitlab.com/synergy-it/ui-starter-kit/issues/1).)

## SVG icons sprite

The `src/assets/icons/` directory contains all the icons in SVG format. Each SVG file contains a single icon. In order to generate a single SVG sprite that contains all the icons, run:

```
$ gulp icons
```

This will generate the SVG sprite (using [gulp-svg-sprite](https://github.com/jkphl/gulp-svg-sprite)) in `src/assets/img/` directory. It will be copied to the `public/assets/img` directory via the `img` gulp task.

## Development flow

The usual development flow starts by running:

```
$ gulp serve
```

This starts a local web server, reachable at `http://localhost:<port>`, and serves the `public/` directory.

It also starts watching the following files for any changes and then runs the respective gulp task on every change:

| Files watched           | gulp task |
|-------------------------|-----------|
| `src/scss/**/*.scss`    | sass      |
| `src/pages/**/*.njk`    | pages     |
| `src/assets/fonts/**/*` | fonts     |
| `src/assets/icons/**/*` | icons     |
| `src/assets/img/**/*`   | img       |
| `src/assets/js/**/*`    | js        |

Thus, we work on our source Nunjucks or Sass files; upon saving, the respective gulp tasks generate the output; and we refresh the browser to see the results.


In order to avoid manually refreshing the browser, use `autoserve`:

```
$ gulp autoserve
```

This is the same as `serve`, except the browser is also refreshed automatically with each change.
