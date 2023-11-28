/**
 * @file 运行配置
 * @author BIFE
 * */
const path = require('path');
const fs = require('fs');
const join = path.join;//拼接路径

function resolve (dir) {
    return join(__dirname, dir);
}

const devConfig = {
    publicPath: './',
    assetsDir: '',
    productionSourceMap: false,
    devServer: {
        port: 8088,
        https: false,
        disableHostCheck: true,
    },
    pages: {
        index: {
            entry: 'examples/main.ts',
            template: 'public/index.html',
            filename: 'index.html'
        }
    },
    chainWebpack: config => {
        // alias
        config.resolve.alias
            .set('@', resolve('examples'))
            .set('views', resolve('examples/views'))
            .set('mock', resolve('mock'))
            .end();
        config.module
            .rule('js')
            .include.add('/packages')
            .end()
            .include.add('/packages')
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
    },
    // 全局引入 less 变量文件 variate.less
    pluginOptions: {
        "style-resources-loader": {
          preProcessor: "less",
          patterns: [path.resolve(__dirname, "examples/assets/styles/variate.less")]
        }
    }
}

function getEntries(path) {
    let files = fs.readdirSync(resolve(path));
    const entries = files.reduce((ret, item) => {
        const itemPath = join(path, item)
        const isDir = fs.statSync(itemPath).isDirectory();
        if (isDir) {
            ret[item] = resolve(join(itemPath, 'index.js'))
        } else {
            const [name] = item.split('.')
            ret[name] = resolve(`${itemPath}`)
        }
        return ret
    }, {})
    console.log(entries);
    return entries
}
const packageConfig = {
    outputDir: 'lib',
    productionSourceMap: false,
    configureWebpack: {
        entry: { 
            ...getEntries('packages')
        },
        output: {
            filename: '[name]/index.js',
            libraryTarget: 'commonjs2'
        }
    },
    css: {
        sourceMap: true,
        extract: {
            filename: 'style/index.css' //在lib文件夹中建立style文件夹中，生成对应的css文件。
        }
    },
    chainWebpack: config => {
        config.module
            .rule('js')
            .include
            .add('/packages')
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
        config.optimization.delete('splitChunks');
        config.plugins.delete('copy');
        config.plugins.delete('html');
        config.plugins.delete('preload');
        config.plugins.delete('prefetch');
        config.plugins.delete('hmr');
        config.entryPoints.delete('app');
    },
    // 全局引入 less 变量文件 variate.less
    pluginOptions: {
        "style-resources-loader": {
          preProcessor: "less",
          patterns: [path.resolve(__dirname, "examples/assets/styles/variate.less")]
        }
    }
}

console.log('process.env: ', process.env);
module.exports = process.env.NODE_ENV === 'package' ? packageConfig : devConfig;
