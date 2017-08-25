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
    coverageReporter: {
      type: 'lcov', // lcov or lcovonly are required for generating lcov.info files
      dir: 'coverage/'
    },
    karmaTypescriptConfig: {
      reports: {
        html: 'coverage',
        lcovonly: {
          dir: 'coverage',
          subdirectory: 'lcov'
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
  }

  config.set(options)
}
