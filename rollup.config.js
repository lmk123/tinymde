const path = require('path')
const typescript = require('rollup-plugin-typescript2')
const nodeReslove = require('rollup-plugin-node-resolve')
const cjs = require('rollup-plugin-commonjs')

module.exports = {
  entry: path.resolve(__dirname, './src/index.ts'),
  dest: 'dev.js',
  plugins: [cjs(), nodeReslove(), typescript()],
  format: 'iife',
  moduleName: 'mde'
}
