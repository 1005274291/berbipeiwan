const HtmlWebPackPlugin = require("html-webpack-plugin")
const path = require("path")
const webpack = require("webpack")
const TerserPlugin = require("terser-webpack-plugin")//uglifyjs的分支
const BundleAnalyZerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin//分析压缩体积
// const HappyPack=require("happypack") //开启多进程
//根据cpu数量创建线程池
// const happyThreadPool=HappyPack.ThreadPool({size:OscillatorNode.cpus().length})
module.exports = {
    optimization: {//配置压缩
        minimizer: [new TerserPlugin({
            //加快构建速度
            cache: true, //是否缓存
            parallel: true,//是否开启多线程压缩
            terserOptions: {
                compress: {
                    unused: true,//无用代码去掉
                    drop_debugger: true,//去掉断点
                    drop_console: true,//去掉打印
                    dead_code: true//去掉无用代码
                }
            }
        })]
    },
    resolve: {
        extensions: [".jsx", ".js", "json","css","less"] //不用写后缀名
    },
    entry: path.resolve(__dirname, "src/index.js"),
    module: {
        noParse: /node_modules\/(jquery\.js)/,//不解析的文件中不应该包含import,require,define等模块化语句
        rules: [
            // {
            //     test:/\.jsx?$/,
            //     include:path.resolve("src"),
            //     use:[
            //         "thread-loader"//开启多线程构建
            //     ]
            // },
            {
                test: /\.jsx?$/,
                //不去编译node_moudules中的文件
                exclude: /node_moudules/,//include 确定要编译的文件正则
                use: {
                    loader: "babel-loader",
                    options: {
                        babelrc: false,
                        presets: [
                            require.resolve("@babel/preset-react"),
                            [require.resolve("@babel/preset-env", { module: false })]
                        ],
                        plugins: [
                            ["@babel/plugin-proposal-class-properties"],
                            ["babel-plugin-transform-async-to-generator"],
                            [   
                                "import",
                                {
                                    "style": "css",
                                    "libraryName": "antd-mobile"
                                }
                            ],
                            // '@babel/plugin-proposal-class-properties',
                        ],
                        cacheDirectory: true  //每次的编译结果是否缓存
                    }
                }
            },
            {
                test: /\.css$/,
                use: [//从后往前加载
                    "style-loader",//样式加载
                    "css-loader"//解析css
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    "file-loader"
                ]
            },
            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "less-loader"
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: path.resolve(__dirname, "src/index.html"),
            filename: "index.html"
        }),
        new webpack.HotModuleReplacementPlugin(),//HMR
        new BundleAnalyZerPlugin(),
        // ["import",{"libraryName":"antd-mobile"}]
        // new HappyPack({
        //     id:"jsx",
        //     threads:happyThreadPool,//使用什么线程池
        //     loaders:["babel-loader"]//对什么loader起作用 有些不支持
        // })
    ],
    devServer: {
        port: "3000",
        hot: true//无刷新页面更新数据(热更新)
    }
}