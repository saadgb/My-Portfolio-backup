# [Project name]

This is the repository for static UI (HTML files, CSS, and other assets) for [project name].

## Building and serving the files

You should have [Node.js](https://nodejs.org/) installed. The LTS (long term support) version is recommended.

The main task runner is [Gulp](https://gulpjs.com/). HTML files are generated from [Nunjucks](https://mozilla.github.io/nunjucks/) templates and post-processed for pretty formatting (via [gulp-prettify](https://www.npmjs.com/package/gulp-prettify). CSS is generated from [Sass](http://sass-lang.com/) files and post-processed using [Autoprefixer](https://github.com/postcss/autoprefixer).

Run the following commands to get up and running:

```
# Install the dependencies
npm install

# Serve the site at http://localhost:<port> (<port> may be changed in gulpfile.js), and
# start watching for changes. On each change, a respective gulp task (e.g., to build CSS 
# from Sass sources) will be triggered. See gulpfile.js for details.
gulp serve
```

If you want to live reload the changes without manually refreshing the browser, use `autoserve`:

```
# Serve the site at http://localhost:<port> (<port> may be changed in gulpfile.js), and
# start watching for changes. On each change, a respective gulp task (e.g., to build CSS 
# from Sass sources) will be triggered, and the browser will be refreshed automatically. 
# See gulpfile.js for details.
gulp autoserve
```
