# uncleJia

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

## 网站目录
- [HOME](https://lele-yuan.github.io/uncleJia)
- [AutoComplete](https://lele-yuan.github.io/uncleJia/#/AutoComplete)
- [ExcelTable](https://lele-yuan.github.io/uncleJia/#/excel)
- [indexedDB](https://lele-yuan.github.io/uncleJia/#/indexedDB))

## 引入全局less文件
### 安装loader
`yarn add less less-loader style-resources-loader vue-cli-plugin-style-resources-loader -D`
### 配置 vue.config.js
```
module.exports = {
    ...
    pluginOptions: {
        "style-resources-loader": {
            preProcessor: "less",
            patterns: [path.resolve(__dirname, "src/assets/styles/variate.less")]
        }
    },
}
```
