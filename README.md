# maze

[![npm version](https://img.shields.io/npm/v/@code-dot-org/maze.svg)](https://www.npmjs.com/package/@code-dot-org/maze)
[![Travis Build Status](https://img.shields.io/travis/code-dot-org/maze.svg)](https://travis-ci.org/code-dot-org/maze/)
[![codecov](https://codecov.io/gh/code-dot-org/maze/branch/master/graph/badge.svg)](https://codecov.io/gh/code-dot-org/maze)

Standalone repo for the Maze app type

Setup steps
```
git clone git@github.com:code-dot-org/maze.git
cd maze
nvm install (if required)
npm install
npm run build:dev
```

Steps to make changes locally in maze and to view changes in the apps build
- Set up a symlink in the apps/node_modules to point at your local changes.  
- Run "npm run build" in maze to the apps build picks up local changes the next time it builds.
```
In the maze directory
run yarn link

In the apps directory
yarn link "@code-dot-org/maze" 
ls -l node_modules/@code-dot-org to verify maze is linked
```

Add a debugger to one the files to verify that you can view changes in chrome dev tools
- If the file is not visible in "Sources" tab, do the following:
```
cd dist
open webpack.config.js
add devtool: "cheap-module-eval-source-map" to the file
- check that the source map is added by running the command "less main.js"
save
npm run build:dev
```
