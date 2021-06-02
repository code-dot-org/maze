# maze

[![npm version](https://img.shields.io/npm/v/@code-dot-org/maze.svg)](https://www.npmjs.com/package/@code-dot-org/maze)
[![Travis Build Status](https://img.shields.io/travis/code-dot-org/maze.svg)](https://travis-ci.org/code-dot-org/maze/)
[![codecov](https://codecov.io/gh/code-dot-org/maze/branch/main/graph/badge.svg)](https://codecov.io/gh/code-dot-org/maze)

Standalone repo for the Maze app type
### Setup Your Project

Check this project out from source:

    git clone git@github.com:code-dot-org/maze.git
    cd maze
    
Next, inside the project, you need to install the project's various dependencies.

    yarn install
    
Now you should be able to run all the tests:

    yarn test
    
And spin up a development build of your new project:

    yarn build

### Publishing a new version

1. In /maze: yarn login with an authorized npm account. If necessary, create one under your own email, login with dev account and add your new account to the org. After yarn login, you may need to also authorize your machine with npm adduser (follow the propmt given).

2. In /maze: 

    git checkout main

3. Verify yarn build and yarn test run as expected.

4. Update the version:

    npm version [major|minor|patch|premajor|preminor|prepatch].

5. Publish the new version:

    npm publish

6. Verify there is a new commit on main with the updated version number. 

7. in @code-dot-org/: 

    git checkout -b [maze-updates-we-are-incorporating]
    cd apps
    yarn add @code-dot-org/maze@my.new.version (ex: yarn add @code-dot-org/maze@2.7.0)
 
8. Verify yarn.lock and package.json have been updated.

9. Commit and push changes, and open and merge a PR.
