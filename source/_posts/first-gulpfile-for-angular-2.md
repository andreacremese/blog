---
title: First gulpfile for angular 2
date: 2016-09-21 16:37:27
tags:
	- JS
	- typescript
	- NG2
---


Angular 2 came out a few days ago and I am really excited be implementing on a Line of Business App. First stop was the very funny and entertaining **tour of heroes** tutorial but, as soon as that was done, I found myself "yearning" to start with the a pipeline to have NG2 operational in the dev team.

First step is automate transpiling, copying and livereload, a musts for development. Also, I noticed that after a few components were added, the `app/` folder grew dramatically. 

After a bit of tinkering, I came up with a `gulpfile` that:

- Keeps the workspace clean (who wants `.js.map` and `.js` files in the way in a NG2 and typescript project??).
- Allows for livereload.
- Waits to reload after the transpiling & copying to the bin folder is done.



```
// fist gulp file for NG2 - am sure it will grow very substantially.
const gulp = require('gulp');
const del = require('del');
const shell = require('gulp-shell');
const server = require('gulp-server-livereload');
const livereload = require('gulp-livereload');

gulp.task('clean', function () {
  return del('bin/**/*');
});

gulp.task('copyFiles', ['transpile'], function () {
    gulp.src(['app/**/*.html', 'app/**/*.css'])
    .pipe(gulp.dest('bin'))
    .pipe(livereload());
})

gulp.task('transpile', ['clean'], shell.task('tsc'));

gulp.task('livereload', ['copyFiles'], function() {
  livereload.listen();
  gulp.watch('app/*', ['copyFiles']);
});

// this is the entry point
gulp.task('webserver', ['livereload'], function() {
  gulp.src('.')
    .pipe(server({
        livereload : true,
        directoryListing: false,
        open: true,
        port: 8000,
        fallback: 'index.html'
    }));
});

gulp.task('default',['webserver']);
```
I have tried for a bit to use a gulp typescript and I decided for the time being to remain with tsc, so here's the `tsconfig.json` file.

```
// matching tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "moduleResolution": "node",
    "sourceMap": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "removeComments": false,
    "noImplicitAny": false,
    "outDir": "./bin"
  },
  "exclude": [
    "node_modules"
  ]
}
```
