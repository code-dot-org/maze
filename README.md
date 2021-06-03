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

1. In /maze: npm login with an authorized npm account. If necessary, create one under your own email, login with our shared dev account and add your new account to the org. After logging in, you may need to authorize your machine (follow the prompt given).

    npm login
    npm adduser (if necessary)

2. In /maze: 

    git checkout main
    git pull

3. Verify yarn build and yarn test run as expected.

4. Update the version (which also publishes to npm):

    npm version [major|minor|patch|premajor|preminor|prepatch].

5. Verify there is a new commit on /maze/main with the updated version number. 

6. in @code-dot-org/: 

    git checkout -b [maze-updates-we-are-incorporating]
    cd apps
    yarn add @code-dot-org/maze@my.new.version (ex: yarn add @code-dot-org/maze@2.7.0)
 
7. Verify yarn.lock and package.json have been updated.

8. Commit and push changes, and open and merge a PR.
