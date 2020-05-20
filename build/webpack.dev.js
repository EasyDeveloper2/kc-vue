
const path = require("path");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack');
const fs = require('fs');
const config = require('./config');

module.exports = {
   mode:'development', 
   entry:{
       main:path.resolve(__dirname,'../src/main.js')
   },
   output:{
       path:path.resolve(__dirname,'../dist'),
       filename:'[name].js'
   },
   module:{
       rules:[
          {
              test:/\.js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env'],
                  plugins: ['@babel/transform-runtime']
                }
              }
          },
          {
              test:/\.css$/,
              use:[
                  {loader:'style-loader'},
                  {loader:'css-loader'},
                  {loader:'postcss-loader'}
              ]
          },
          {
              test:/\.less$/,
              use:[
                  {loader:'style-loader'},
                  {loader:'css-loader'},
                  {loader:'postcss-loader'},
                  {loader:'less-loader'},
                  
                 
              ]
          },
          {
              test:/\.vue$/,
              use:[
                  {loader:'vue-loader'}
              ]
          },
          {
              test:/\.(png|jpg|jpeg|svg|gif|ttf)$/,
              loader:'url-loader'
          }
       ]
   },
   plugins:[
       new CleanWebpackPlugin(),
       new HtmlWebpackPlugin({
           template:path.resolve(__dirname,'../public/index.html'),
           filename:'index.html',
           title:config.appName,
           // 根据类型定制化浏览器头部
           head:fs.readFileSync(path.resolve(__dirname,`../public/head.${config.appType}.html`)),
           minify:{
            html5:true,
            collapseWhitespace:true,
            preserveLineBreaks:false,
            minifyCSS:true,
            minifyJS:true,
            removeComments:true
          }
       }),
       new webpack.NamedModulesPlugin(),
       new webpack.HotModuleReplacementPlugin(),
       new VueLoaderPlugin()
   ],
   devServer:{
       port:8088,
       hot:true,
       contentBase:'../dist'
   }
}