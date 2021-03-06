/**
 * @file 运行配置
 * @author BIFE
 * */
const path = require('path');

function resolve (dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    outputDir: 'dist',
    publicPath: './',
    assetsDir: '',
    productionSourceMap: false,
    devServer: {
        port: 8088,
        https: false,
        disableHostCheck: true,
    },
    chainWebpack: config => {
        // alias
        config.resolve.alias
            .set('@', resolve('src'))
            .set('views', resolve('src/views'))
            .set('mock', resolve('mock'))
            .end();
        config.module
            .rule('worker-loader')
            .test(/\.worker\.js$/)
            .use('worker-loader')
            .loader('worker-loader')
            .options({ 
                inline: 'fallback',
                filename: '[name].[contenthash].worker.js' 
            })
            .end()
        config.output.globalObject('this');
        // font files
        // const fontRule = config.module.rule('fonts');
        // fontRule.uses.clear();
        // fontRule
        //     .use('file-loader')
        //     .loader('file-loader')
        //     .options({
        //         name: 'fonts/[name].[ext]',
        //         publicPath: `${VUE_APP_PUBLIC_PATH}`,
        //         outputPath: ''
        //     })
        //     .end();
    },
    // 全局引入 less 变量文件 variate.less
    pluginOptions: {
        "style-resources-loader": {
          preProcessor: "less",
          patterns: [path.resolve(__dirname, "src/assets/styles/variate.less")]
        }
    },
};
