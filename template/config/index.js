'use strict'
// Template version: {{ template_version }}
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const fs = require('fs')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // set the proxy config
      '/api': {
        target: 'http://example.com',
        changeOrigin: true,
        // rewrite the path, if you use nginx to do the proxy, you should also rewrite the path.Well, you can change
        // this config by yourself.
        pathRewrite: {
          '^/api': ''
        }
        // if the request requires cookie, use the config: 
        // onProxyReq: function(proxyReq, req, res) {
        //   proxyReq.setHeader('cookie', 'the cookie you want')
        // }
      }
    },
    // set the mock api's response config
    before(app) {

      // if the server is running for test the online api, we should close the mock resposne
      if (process.env.PROXY) {
        return
      }

      // if you change the REQUEST_HOST in /src/config/index.js, you should change this config
      app.get('/api/*', (req, res) => {
        let paramsName = req.params[0]
        if (paramsName.includes('.')) {
          paramsName = paramsName.split('.')[0]
        }
        paramsName += '.json'
        let mockFile = path.join(__dirname, '../mock/', paramsName)
        let result = JSON.parse(fs.readFileSync(mockFile))

        {{#if_eq requestNpm "axios"}}
        res.json(result)          
        {{/if_eq}}
        {{#if_eq requestNpm "jsonp"}}
        if (req.query.callback) {
          res.jsonp(result)
        } else {
          res.json(result)          
        }
        {{/if_eq}}
        {{#if_eq requestNpm "two"}}
        if (req.query.callback) {
          res.jsonp(result)
        } else {
          res.json(result)          
        }
        {{/if_eq}}
      })
      {{#if_eq requestNpm "axios"}}
      app.post('/api/*', (req, res) => {
        let paramsName = req.params[0]
        if (paramsName.includes('.')) {
          paramsName = paramsName.split('.')[0]
        }
        paramsName += '.json'
        let mockFile = path.join(__dirname, '../mock/', paramsName)
        let result = JSON.parse(fs.readFileSync(mockFile))

        res.json(result)
      })
      {{/if_eq}}
      {{#if_eq requestNpm "two"}}
      app.post('/api/*', (req, res) => {
        let paramsName = req.params[0]
        if (paramsName.includes('.')) {
          paramsName = paramsName.split('.')[0]
        }
        paramsName += '.json'
        let mockFile = path.join(__dirname, '../mock/', paramsName)
        let result = JSON.parse(fs.readFileSync(mockFile))

        res.json(result)
      })
      {{/if_eq}}
      // get mock Image, path: '/mock/img/example.jpg'
      app.get('/mock/img/:name', (req, res) => {
        let fileName = req.params.name

        var options = {
          root: path.join(__dirname, '../mock/img/'),
          dotfiles: 'deny',
          headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
          }
        }

        res.sendFile(fileName, options)
      })

      // well, you can also set the response for some request, or use mockJS
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    {{#lint}}// Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,
    {{/lint}}

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
