const webpack           = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 环境变量配置，dev / online
const WEBPACK_ENV       = process.env.WEBPACK_ENV || 'dev';

// 获取 html-webpack-plugin参数方法
const getHtmlConfig = function (name,title) {
    return {
        template    : './webapp/view/' + name + '.html',
        filename    : 'view/' + name + '.html',
        favicon     : './favicon.ico',
        title       : title,
        inject      : true,
        hash        : true,
        chunks      : ['f.vendor', name],
        minify      : {
            // 压缩html
            removeComments: true,       //移除HTML中的注释
            collapseWhitespace: true   //删除空白符与换行符
        }
    };
};

// webpack config
const config = {
    cache: true,
    // 生成sourcemap,便于开发调试
    devtool: "#source-map",
    // 入口文件
    entry: {
        'f.vendor'              : ['./webapp/js/app.js','./webapp/js/lib/f.utils.js','./webapp/js/lib/f.data.js','./webapp/js/lib/f.core.js','./webapp/js/lib/wx_api.js'],

        'index'                 : ['./webapp/js/module/page/index.js'],

        'product/index'         : ['./webapp/js/module/product/product_index.js'],
        'product/detail'        : ['./webapp/js/module/product/product_detail.js'],
        'product/record'        : ['./webapp/js/module/product/product_record.js'],
        'product/capital'       : ['./webapp/js/module/product/product_capital.js'],
        'product/protocol_dq'   : ['./webapp/js/module/product/product_protocol.js'],
        'product/protocol_hq'   : ['./webapp/js/module/product/product_protocol.js'],
        'product/info'          : ['./webapp/js/module/product/product_info.js'],
        'product/confirm'       : ['./webapp/js/module/product/product_confirm.js'],

        'page/activity'         : ['./webapp/js/module/page/activity.js'],
        'page/bank_list'        : ['./webapp/js/module/page/bank_list.js'],
        'page/download'         : ['./webapp/js/module/page/download.js'],
        'page/notice_detail'    : ['./webapp/js/module/page/notice_detail.js'],

        'my/index'              : ['./webapp/js/module/my/my_index.js'],
        'my/wallet'             : ['./webapp/js/module/my/my_wallet.js'],
        'my/personal'           : ['./webapp/js/module/my/my_personal'],
        'my/mine'               : ['./webapp/js/module/my/my_mine'],
        'my/recharge'           : ['./webapp/js/module/my/my_recharge.js'],
        'my/bills'              : ['./webapp/js/module/my/my_bills.js'],
        'my/billsmood'          : ['./webapp/js/module/my/my_billsmood.js'],
        'my/cardstock'          : ['./webapp/js/module/my/my_cardstock.js'],
        'my/carddetails'        : ['./webapp/js/module/my/my_carddetails.js'],
        'my/othercard'          : ['./webapp/js/module/my/my_othercard.js'],
        'my/message'            : ['./webapp/js/module/my/my_message.js'],
        'my/bindcard'           : ['./webapp/js/module/my/my_bindcard.js'],
        'my/address'            : ['./webapp/js/module/my/my_address.js'],

        'help/index'            : ['./webapp/js/module/help/help_index.js'],
        'help/type'             : ['./webapp/js/module/help/help_type.js'],
        'help/search'           : ['./webapp/js/module/help/help_search.js'],
        'help/detail'           : ['./webapp/js/module/help/help_detail.js'],

        'about/index'           : ['./webapp/js/module/about/about_index.js'],
        'about/security'        : ['./webapp/js/module/about/about_security.js'],
        'about/event'           : ['./webapp/js/module/about/about_index.js'],
        'about/honour'          : ['./webapp/js/module/about/about_index.js'],

        'channel/invite'        : ['./webapp/js/module/channel/invite.js'],
        'channel/regist'        : ['./webapp/js/module/channel/regist.js'],

        'login'                 : ['./webapp/js/module/user/login.js'],
        'logon'                 : ['./webapp/js/module/user/logon.js'],

        'user/forget-pwd-next'  : ['./webapp/js/module/user/forget-pwd.js'],
        'user/forget-pwd'       : ['./webapp/js/module/user/forget-pwd.js'],
        'user/pwd-manager'      : ['./webapp/js/module/user/pwd-manager.js'],
        'user/recommend'        : ['./webapp/js/module/user/recommend.js'],
        'user/reset-login-pwd'  : ['./webapp/js/module/user/reset-pwd.js'],
        'user/reset-trade-pwd'  : ['./webapp/js/module/user/reset-pwd.js'],
    },
    output: {
        path        : __dirname + '/dist/',
        publicPath  : 'dev' === WEBPACK_ENV ? '/dist/' : 'http://192.168.1.53:3002/dist/',
        filename    : 'js/[name]-build.min.js'
    },
    externals: {
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
    },
    module: {
        loaders: [{
            test    : /\.css$/,
            loader  : ExtractTextPlugin.extract('style-loader', 'css-loader')
        }, {
            test    : /\.(gif|png|jpg)\??.*$/,
            loader  : 'url-loader',
            query   : {
                /*
                 *  limit=10000 ： 8kb
                 *  图片大小小于10kb 采用内联的形式，否则输出图片
                 * */
                limit   : 10,
                name    : 'resource/[name].[ext]'
            }
        }, {
            //文件加载器，处理文件静态资源
            test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader',
            query:{
                limit   : 10,
                name    : 'resource/[name].[ext]'
            }
        }, {
            test    : /\.(string)$/,
            loader  : 'html-loader',
            query   : {
                minimize                : true,
                removeAttributeQuotes   : true
            }
        }]
    },
    resolve:{
        //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        extensions: ['', '.js', '.json', '.css'],

        // 模块别名定义，方便后续直接引用别名，无须多写长长的地址
        alias:{
            node_modules    : __dirname + '/node_modules',
            plugins         : __dirname + '/webapp/plugins',
            css_path        : __dirname + '/webapp/css',
            js_path         : __dirname + '/webapp/js',
        }
    },
    plugins: [

        // 把css单独打包到文件里
        new ExtractTextPlugin('css/[name]-build.min.css'),

        // html模板的处理
        new HtmlWebpackPlugin(getHtmlConfig('index')),

        new HtmlWebpackPlugin(getHtmlConfig('product/index')),
        new HtmlWebpackPlugin(getHtmlConfig('product/detail')),
        new HtmlWebpackPlugin(getHtmlConfig('product/capital')),
        new HtmlWebpackPlugin(getHtmlConfig('product/info')),
        new HtmlWebpackPlugin(getHtmlConfig('product/protocol_hq')),
        new HtmlWebpackPlugin(getHtmlConfig('product/protocol_dq')),
        new HtmlWebpackPlugin(getHtmlConfig('product/record')),
        new HtmlWebpackPlugin(getHtmlConfig('product/confirm')),

        new HtmlWebpackPlugin(getHtmlConfig('page/activity')),
        new HtmlWebpackPlugin(getHtmlConfig('page/download')),
        new HtmlWebpackPlugin(getHtmlConfig('page/bank_list')),
        new HtmlWebpackPlugin(getHtmlConfig('page/notice_detail')),

        new HtmlWebpackPlugin(getHtmlConfig('my/index')),
        new HtmlWebpackPlugin(getHtmlConfig('my/wallet')),
        new HtmlWebpackPlugin(getHtmlConfig('my/personal')),
        new HtmlWebpackPlugin(getHtmlConfig('my/mine')),
        new HtmlWebpackPlugin(getHtmlConfig('my/recharge')),
        new HtmlWebpackPlugin(getHtmlConfig('my/bills')),
        new HtmlWebpackPlugin(getHtmlConfig('my/billsmood')),
        new HtmlWebpackPlugin(getHtmlConfig('my/cardstock')),
        new HtmlWebpackPlugin(getHtmlConfig('my/carddetails')),
        new HtmlWebpackPlugin(getHtmlConfig('my/othercard')),
        new HtmlWebpackPlugin(getHtmlConfig('my/message')),
        new HtmlWebpackPlugin(getHtmlConfig('my/bindcard')),
        new HtmlWebpackPlugin(getHtmlConfig('my/address')),

        new HtmlWebpackPlugin(getHtmlConfig('help/index')),
        new HtmlWebpackPlugin(getHtmlConfig('help/type')),
        new HtmlWebpackPlugin(getHtmlConfig('help/search')),
        new HtmlWebpackPlugin(getHtmlConfig('help/detail')),

        new HtmlWebpackPlugin(getHtmlConfig('about/index')),
        new HtmlWebpackPlugin(getHtmlConfig('about/security')),
        new HtmlWebpackPlugin(getHtmlConfig('about/chairman')),
        new HtmlWebpackPlugin(getHtmlConfig('about/event')),
        new HtmlWebpackPlugin(getHtmlConfig('about/honour')),
        new HtmlWebpackPlugin(getHtmlConfig('about/aboutus')),


        new HtmlWebpackPlugin(getHtmlConfig('channel/invite')),
        new HtmlWebpackPlugin(getHtmlConfig('channel/regist')),

        new HtmlWebpackPlugin(getHtmlConfig('login')),
        new HtmlWebpackPlugin(getHtmlConfig('logon')),

        new HtmlWebpackPlugin(getHtmlConfig('user/forget-pwd-next')),
        new HtmlWebpackPlugin(getHtmlConfig('user/forget-pwd')),
        new HtmlWebpackPlugin(getHtmlConfig('user/pwd-manager')),
        new HtmlWebpackPlugin(getHtmlConfig('user/recommend')),
        new HtmlWebpackPlugin(getHtmlConfig('user/reset-login-pwd')),
        new HtmlWebpackPlugin(getHtmlConfig('user/reset-trade-pwd')),

        // 独立通用模块到 js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            // 将公共模块提取，生成名为`common`的chunk
            name:'f.vendor' // 把依赖移动到主文件
            //children:  true, // 寻找所有子模块的共同依赖
            //minChunks: 2, // 设置一个依赖被引用超过多少次就提取出来
        })
    ]
};
if ('dev' === WEBPACK_ENV) {
    config.entry.common.push('webpack-dev-server/client?http//192.168.1.53:3002/');
}

module.exports = config;