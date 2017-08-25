const path = require('path')
const typescript = require('rollup-plugin-typescript2')
const pkg = require('../package.json')

module.exports = {
  input: path.resolve(__dirname, '../src/index.ts'),
  name: 'TinyMDE',
  tp: typescript({
    useTsconfigDeclarationDir: true
  }),
  esOutputPath: path.resolve(__dirname, '../dist/tinymde.esm.js'),
  cjsOutputPath: path.resolve(__dirname, '../dist/tinymde.common.js'),
  umdOutputPath: path.resolve(__dirname, '../dist/tinymde.js'),
  umdMinOutputPath: path.resolve(__dirname, '../dist/tinymde.min.js'),
  banner: [
    '/*!',
    ' * tinymde.js v' + pkg.version,
    ' * https://github.com/lmk123/tinymde',
    ' * Released under the MIT License.',
    ' */'
  ].join('\n')
}
