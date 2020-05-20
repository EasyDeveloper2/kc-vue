
const config = require("./build/config");
let plugins = {
    "postcss-preset-env": {
        stage: 4  // 0 非官方草案 1 编辑草案或早期工作草案 2 工作草案 3 候选版本 4 推荐标准
      },
      'autoprefixer': {
      
      }
}

// 是否支持按照屏幕宽度适配
config.supportFlexible&&(plugins["postcss-pxtorem"]={
    rootValue: 75, // // 设计稿宽度的1/10
    selectorBlackList: ['weui', 'mu'], // 忽略转换正则匹配项
    propList: ['*'] 
})


module.exports = {
    plugins: plugins
};