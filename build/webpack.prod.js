
const path = require("path");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin= require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const config = require("./config");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const PurifyCSSPlugin = require("purifycss-webpack");
const glob = require('glob');
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin

const fs = require('fs');
const threadLoader = {
    loader:"thread-loader",
    options:{
        workers: 4,
    }
}

const plugins = [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
      template:path.resolve(__dirname,'../public/index.html'),
      filename:'index.html',
      title:config.appName,
      head:fs.readFileSync(path.resolve(__dirname,`../public/head.${config.appType}.html`)),
      flexible:config.supportFlexible?fs.readFileSync(path.resolve(__dirname,`../node_modules/lib-flexible/flexible.js`)):'',
      cdn:config.useCND?fs.readFileSync(path.resolve(__dirname,`../public/cdn.txt`)):'',
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

  // 热更新模块插件
  new webpack.HotModuleReplacementPlugin(),
  // 处理vue文件插件
  new VueLoaderPlugin(),
  // 压缩css
  new OptimizeCSSAssetsPlugin({
   assetNameRegExp: /\.css$/g,
   cssProcessor: require('cssnano'),
   cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
   canPrint: true
  }),

  new MiniCssExtractPlugin(
   {
     filename: "[name].[hash:8].css",
     chunkFilename: "css/[name].[hash:8].css"
   }
  ),
  // 分割js代码
  new webpack.optimize.AggressiveSplittingPlugin({
       minSize: 30000, // 字节，分割点。默认：30720
       maxSize: 50000, // 字节，每个文件最大字节。默认：51200
       chunkOverhead: 0, // 默认：0
       entryChunkMultiplicator: 1, // 默认：1
  })
//    new ExtractTextPlugin({
//     filename:'[name].[hash:8].css'
//    })
  // 剔除未使用的css
//    new PurifyCSSPlugin({
//        paths:glob.sync(path.resolve(__dirname, '../src/*.vue'))
//    })
]

// 添加包分析工具
if(config.openBundleAnalyzer){
   plugins.push(new BundleAnalyzerPlugin())
}


let externals = {}
if(config.useCND){
  externals= {
    'vue':'Vue',
    'vue-router':'VueRouter',
    'vuex':'Vuex'
  }
}



 const webpackConfig = {
   mode:'production', 
   entry:{
       main:path.resolve(__dirname,'../src/main.js')
   },
   output:{
       path:path.resolve(__dirname,'../dist'),
       filename:'[name].[hash:8].bundle.js'
   },
   module:{
       rules:[
          {
              test:/\.js$/,
              exclude: /(node_modules|bower_components)/,
              use: [
                threadLoader,  
                {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env'],
                  plugins: ['@babel/transform-runtime']
                }
              }]
          },
          {
              test:/\.css$/,
              use:[
                MiniCssExtractPlugin.loader,
                {loader:'css-loader'},
                {loader:'postcss-loader'}, 
            ]
              
          },
          {
            test:/\.less$/,
            use:[
                MiniCssExtractPlugin.loader,
                {loader:'css-loader'},
                {loader:'postcss-loader'},
                {loader:'less-loader'},
            ]
          },
          {
              test:/\.vue$/,
              use:[
                  threadLoader,  
                  {loader:'vue-loader'}
              ]
          },
          {
              test:/\.(png|jpg|jpeg|svg|gif|ttf)$/,
              loader:'url-loader'
          }
       ]
   },
   plugins:plugins,
   externals,
   optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 100 // 修改了这里
    }
  },
   devtool: 'source-map',
}

module.exports = config.showSpeed? smp.wrap(webpackConfig):webpackConfig