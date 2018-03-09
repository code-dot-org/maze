module.exports = {
  "parser": "babel-eslint",

  "parserOptions": {
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "modules": true,
      "ecmaVersion": 6,
      "experimentalObjectRestSpread": true
    }
  },

  "plugins": [
    "babel",
  ],
  "extends": [
    "eslint:recommended",
  ],

  "env": {
    "browser": true,
    "es6": true,
    "jest": true,
    "node": true,
  },

  "rules": {
    "no-unused-vars": ['error', {"args": 'none'}],
  }
};
