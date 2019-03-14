const path = require('path');
module.exports = {
  entry: './src/browser.js',
  output: {
    filename: './AIJAS.js',
    path: path.resolve(__dirname, 'dist'),
  }
};