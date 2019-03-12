const path = require('path');
module.exports = {
  entry: './src/browser.js',
  output: {
    filename: './dist/AIJAS.js',
    path: path.resolve(__dirname, 'dist'),
  }
};