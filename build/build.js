const path = require('path')
const fs = require('fs-extra')

// 清空输出目录
fs.emptyDirSync(path.resolve(__dirname, '../dist'))

// 编译 js
const rollup = require('rollup')
const buble = require('rollup-plugin-buble')
// TODO 后面可能会用上，所以 package.json 里暂时不删
// const nodeReslove = require('rollup-plugin-node-resolve')
// const cjs = require('rollup-plugin-commonjs')
const scss = require('rollup-plugin-scss')
const uglifyJS = require('uglify-js')
const pkg = require('../package.json')

const banner = [
  '/*!',
  ' * mde.js v' + pkg.version,
  ' * https://github.com/lmk123/mde',
  ' * Released under the MIT License.',
  ' */'
].join('\n')

rollup.rollup({
  entry: path.resolve(__dirname, '../src/index.js'),
  plugins: [buble()]
}).then(bundle => {
  // 输出 umd 格式
  const { code } = bundle.generate({
    format: 'umd',
    moduleName: 'mde',
    banner
  })

  fs.writeFile(path.resolve(__dirname, '../dist/mde.js'), code)
  fs.writeFile(path.resolve(__dirname, '../dist/mde.min.js'), uglifyJS.minify(code, { output: { comments: /^!/ } }).code)

  // 输出 es 格式
  bundle.write({
    dest: path.resolve(__dirname, '../dist/mde.esm.js'),
    format: 'es',
    banner
  })

  // 输出 cjs 格式
  bundle.write({
    dest: path.resolve(__dirname, '../dist/mde.common.js'),
    format: 'cjs',
    banner
  })
})
