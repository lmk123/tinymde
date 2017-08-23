const path = require('path')
const typescript = require('rollup-plugin-typescript2')
const pkg = require('../package.json')

module.exports = {
  input: path.resolve(__dirname, '../src/index.ts'),
  name: 'MDE',
  tp: typescript({
    useTsconfigDeclarationDir: true
  }),
  esOutputPath: path.resolve(__dirname, '../dist/mde.es.js'),
  cjsOutputPath: path.resolve(__dirname, '../dist/mde.common.js'),
  umdOutputPath: path.resolve(__dirname, '../dist/mde.js'),
  umdMinOutputPath: path.resolve(__dirname, '../dist/mde.min.js'),
  banner: [
    '/*!',
    ' * mde.js v' + pkg.version,
    ' * https://github.com/lmk123/mde',
    ' * Released under the MIT License.',
    ' */'
  ].join('\n')
}
