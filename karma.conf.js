module.exports = function (config) {
  const options = {
    basePath: '',
    frameworks: ['jasmine', 'karma-typescript'],
    files: [
      'src/**/*.ts',
      'test/**/*.spec.ts'
    ],
    preprocessors: {
      '**/*.ts': ['karma-typescript']
    },
    reporters: ['progress', 'karma-typescript'],
    // karma-coveralls 必须要有 karma-coverage 的配置才能找到 lcov 文件
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },
    karmaTypescriptConfig: {
      reports: {
        html: 'coverage',
        lcovonly: {
          dir: 'coverage',
          subdirectory: 'lcov' // 让生成的 lcov 文件位置匹配 karma-coverage 的配置
        }
      },
      compilerOptions: {
        lib: ['dom', 'es2015']
      }
    },
    browsers: ['PhantomJS'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: true
  }

  if(process.env.TRAVIS) {
    options.reporters.push('coverage', 'coveralls', 'dots')
  } else {
    options.browsers.push('Chrome', 'Safari')
    // Safari 有点慢
    options.captureTimeout = 120000
    options.browserNoActivityTimeout = 20000
  }

  config.set(options)
}
