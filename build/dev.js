const cjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const livereload = require('rollup-plugin-livereload')
const serve = require('rollup-plugin-serve')
const config = require('./config')

module.exports = {
  input: config.input,
  plugins: [
    cjs(),
    nodeResolve(),
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
