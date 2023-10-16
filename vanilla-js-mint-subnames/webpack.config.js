const path = require('path');

module.exports = {
  entry: './src/main.js', // Specify the entry point of your application
  output: {
    filename: 'bundle.js', // Specify the output file name
    path: path.resolve(__dirname, 'dist'), // Specify the output directory
  },
};