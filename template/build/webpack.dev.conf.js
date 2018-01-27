'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

// +++   use fs to open files
const fs = require('fs')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    // +++  set the mock api's response config
    before(app) {

      // if the server is running for test the online api, we should close the mock resposne
      if (config.dev.isProxy) {
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
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
