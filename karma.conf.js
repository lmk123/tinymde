module.exports = function (config) {
  // https://github.com/vuejs/vue/blob/dev/test/unit/karma.sauce.config.js#L22
  const customLaunchers = {
    // the cool kids
    sl_chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 7'
    },
    sl_firefox: {
      base: 'SauceLabs',
      browserName: 'firefox'
    },
    sl_mac_safari: {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.10'
    },
    // ie family
    sl_ie_9: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 7',
      version: '9'
    },
    sl_ie_10: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8',
      version: '10'
    },
    sl_ie_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11'
    },
    sl_edge: {
      base: 'SauceLabs',
      browserName: 'MicrosoftEdge',
      platform: 'Windows 10'
    },
    // mobile
    sl_ios_safari_9: {
      base: 'SauceLabs',
      browserName: 'iphone',
      version: '10.3'
    },
    sl_android_6_0: {
      base: 'SauceLabs',
      browserName: 'android',
      version: '6.0'
    }
  }

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
    options.reporters = options.reporters.concat(['coverage', 'coveralls', 'dots', 'saucelabs'])
    options.sauceLabs = {
      startConnect: false,
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
      testName: 'TinyMDE Unit Tests'
    }
    options.customLaunchers = customLaunchers
    options.browsers = Object.keys(customLaunchers)
    options.singleRun = true
    options.autoWatch = false
  } else {
    options.browsers = ['Chrome']
  }

  config.set(options)
}
