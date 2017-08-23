const path = require('path')
const fs = require('fs-extra')
const config = require('./config')

// 清空输出目录
fs.emptyDirSync(path.resolve(__dirname, '../dist'))

// 编译 js
const rollup = require('rollup')
const uglifyJS = require('uglify-js')
const pkg = require('../package.json')

const buble = require('rollup-plugin-buble')
const nodeResolve = require('rollup-plugin-node-resolve')
const cjs = require('rollup-plugin-commonjs')

// 输出 cjs 和 es 格式的文件时，将第三方依赖作为外部依赖
rollup.rollup({
  input: config.input,
  plugins: [
    config.tp,
    buble()
  ],
  external: Object.keys(pkg.dependencies)
}).then(bundle => {
  // 输出 es 格式
  bundle.write({
    file: config.esOutputPath,
    format: 'es',
    banner: config.banner
  })

  // 输出 cjs 格式
  bundle.write({
    file: config.cjsOutputPath,
    format: 'cjs',
    banner: config.banner
  })
})

// 输出 umd 格式的文件时，将第三方依赖打包进去
rollup.rollup({
  input: config.input,
  plugins: [
    nodeResolve(),
    cjs(),
    config.tp,
    buble()
  ]
}).then(bundle => {
  // 输出 umd 格式
  bundle.generate({
    format: 'umd',
    name: config.name,
    banner: config.banner
  }).then(({ code }) => {
    fs.writeFile(config.umdOutputPath, code)
    fs.writeFile(config.umdMinOutputPath, uglifyJS.minify(code, { output: { comments: /^!/ } }).code)
  })
})
