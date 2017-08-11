const path = require('path')
const fs = require('fs-extra')

// 清空输出目录
fs.emptyDirSync(path.resolve(__dirname, '../dist'))

// 编译 js
const rollup = require('rollup')
const uglifyJS = require('uglify-js')
const pkg = require('../package.json')

const config = require('../rollup.config')
const typescript = require('rollup-plugin-typescript2')
const nodeReslove = require('rollup-plugin-node-resolve')
const cjs = require('rollup-plugin-commonjs')

const banner = [
  '/*!',
  ' * mde.js v' + pkg.version,
  ' * https://github.com/lmk123/mde',
  ' * Released under the MIT License.',
  ' */'
].join('\n')

// 输出 cjs 和 es 格式的文件时，将第三方依赖作为外部依赖
rollup.rollup({
  entry: config.entry,
  plugins: [typescript()],
  external: ['tiny-emitter']
}).then(bundle => {
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

// 输出 umd 格式的文件时，将第三方依赖打包进去
rollup.rollup({
  entry: config.entry,
  plugins: [cjs(), nodeReslove(), typescript()]
}).then(bundle => {
  // 输出 umd 格式
  const { code } = bundle.generate({
    format: 'umd',
    moduleName: config.moduleName,
    banner
  })

  fs.writeFile(path.resolve(__dirname, '../dist/mde.js'), code)
  fs.writeFile(path.resolve(__dirname, '../dist/mde.min.js'), uglifyJS.minify(code, { output: { comments: /^!/ } }).code)
})
