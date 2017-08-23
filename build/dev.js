const cjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const config = require('./config')

module.exports = {
  input: config.input,
  plugins: [
    cjs(),
    nodeResolve(),
    config.tp
  ],
  output: {
    file: config.umdOutputPath,
    format: 'iife',
    name: config.name
  }
}
