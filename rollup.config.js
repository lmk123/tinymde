const path = require('path')
const typescript = require('rollup-plugin-typescript2')
const nodeResolve = require('rollup-plugin-node-resolve')
const cjs = require('rollup-plugin-commonjs')

module.exports = {
  entry: path.resolve(__dirname, './src/index.ts'),
  dest: 'dist/mde.js',
  plugins: [
    cjs(),
    nodeResolve(),
    typescript({
      useTsconfigDeclarationDir: true
    })
  ],
  format: 'iife',
  moduleName: 'MDE'
}
