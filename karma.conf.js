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
    karmaTypescriptConfig: {
      reports: {
        html: 'coverage',
        lcovonly: 'coverage'
      },
      compilerOptions: {
        lib: ['dom', 'es2015']
      }
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: true,
    concurrency: Infinity
  }

  if(process.env.TRAVIS) {
    options.browser = ['Sauce']
    options.reporters = options.reporters.concat(['coveralls', 'dots', 'saucelabs'])
    options.singleRun = true
    options.autoWatch = false
  } else {
    options.browsers = ['Chrome']
  }

  config.set(options)
}
