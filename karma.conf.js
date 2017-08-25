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
    options.reporters.push('dots')
    options.karmaTypescriptConfig.reports = {
      lcovonly: {
        dir: 'coverage',
        subdirectory: 'lcov'
      }
    }
  } else {
    options.browsers.push('Chrome', 'Safari')
    // Safari 有点慢
    options.captureTimeout = 120000
    options.browserNoActivityTimeout = 20000
  }

  config.set(options)
}
