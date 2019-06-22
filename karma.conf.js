// Karma configuration
// Generated on Wed Jun 12 2019 08:17:53 GMT+0200 (Central European Summer Time)
var webpackConfig = require('./webpack.test.config');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'src/**/*.ts'
    ],
    exclude: [
    ],
    preprocessors: {
      "src/**/*.test.ts": ["webpack"]
    },
    reporters: ["progress"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity,
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    },
    webpackServer: {
      noInfo: true
    },
  })
}
