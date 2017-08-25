const livereload = require('rollup-plugin-livereload')
const serve = require('rollup-plugin-serve')
const config = require('./config')

module.exports = {
  input: config.input,
  plugins: [
    config.tp,
    serve({
      open: true,
      contentBase: ''
    }),
    livereload()
  ],
  output: {
    file: config.umdOutputPath,
    format: 'iife',
    name: config.name
  }
}
