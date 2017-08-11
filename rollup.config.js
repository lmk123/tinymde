const path = require('path')
const buble = require('rollup-plugin-buble')

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  dest: 'dev.js',
  plugins: [buble()],
  format: 'umd',
  moduleName: 'mde'
}
