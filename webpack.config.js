const debug             = false;
const webpack           = require('webpack');
const url               = debug ? 'http://192.168.1.53:8010' : 'https://www.fangjinnet.com';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 环境变量配置，dev / online
const WEBPACK_ENV       = process.env.WEBPACK_ENV || 'dev';

// 获取 html-webpack-plugin参数方法
const getHtmlConfig = function (name,title) {
    return {
        template    : './webapp/view/' + name + '.html',
        filename    : 'view/' + name + '.html',
        //favicon     : './favicon.ico',
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
    // 入口文件
    entry: {
        'f.vendor'              : ['./webapp/js/app.js','./webapp/js/lib/wx.core.js','./webapp/js/lib/wx.apps.js','./webapp/js/lib/wx_api.js'],

        'index'                 : ['./webapp/js/module/page/index.js'],

        'product/index'         : ['./webapp/js/module/product/index.js'],
        'product/detail'        : ['./webapp/js/module/product/detail.js'],
        'product/record'        : ['./webapp/js/module/product/record.js'],
        'product/capital'       : ['./webapp/js/module/product/capital.js'],
        'product/protocol_dq'   : ['./webapp/js/module/product/protocol.js'],
        'product/protocol_hq'   : ['./webapp/js/module/product/protocol.js'],
        'product/info'          : ['./webapp/js/module/product/info.js'],
        'product/confirm'       : ['./webapp/js/module/product/confirm.js'],

        'page/activity'         : ['./webapp/js/module/page/activity.js'],
        'page/bank_list'        : ['./webapp/js/module/page/bank_list.js'],
        'page/download'         : ['./webapp/js/module/page/download.js'],
        'page/notice_detail'    : ['./webapp/js/module/page/notice_detail.js'],

        'wallet/index'          : ['./webapp/js/module/wallet/index.js'],
        'wallet/recharge'       : ['./webapp/js/module/wallet/recharge.js'],
        'wallet/cards'          : ['./webapp/js/module/wallet/cards.js'],
        'wallet/card-detail'    : ['./webapp/js/module/wallet/card-detail.js'],
        'wallet/bills'          : ['./webapp/js/module/wallet/bills.js'],
        'wallet/bill-detail'    : ['./webapp/js/module/wallet/bill-detail.js'],
        'wallet/othercard'      : ['./webapp/js/module/wallet/othercard.js'],

        'my/index'              : ['./webapp/js/module/my/index.js'],
        'my/personal'           : ['./webapp/js/module/my/personal'],
        'my/message'            : ['./webapp/js/module/my/message.js'],
        'my/bindcard'           : ['./webapp/js/module/my/bindcard.js'],
        'my/address'            : ['./webapp/js/module/my/address.js'],
        'my/forget-pwd-next'    : ['./webapp/js/module/my/forget-pwd.js'],
        'my/forget-pwd'         : ['./webapp/js/module/my/forget-pwd.js'],
        'my/pwd-manager'        : ['./webapp/js/module/my/pwd-manager.js'],
        'my/recommend'          : ['./webapp/js/module/my/recommend.js'],
        'my/invite-record'      : ['./webapp/js/module/my/invite-record.js'],
        'my/reset-login-pwd'    : ['./webapp/js/module/my/reset-pwd.js'],
        'my/reset-trade-pwd'    : ['./webapp/js/module/my/reset-pwd.js'],

        'help/index'            : ['./webapp/js/module/help/index.js'],
        'help/type'             : ['./webapp/js/module/help/type.js'],
        'help/search'           : ['./webapp/js/module/help/search.js'],
        'help/detail'           : ['./webapp/js/module/help/detail.js'],

        'about/index'           : ['./webapp/js/module/about/index.js'],
        'about/chairman'        : ['./webapp/js/module/about/index.js'],
        'about/security'        : ['./webapp/js/module/about/security.js'],
        'about/event'           : ['./webapp/js/module/about/index.js'],
        'about/honour'          : ['./webapp/js/module/about/index.js'],
        'about/aboutus'         : ['./webapp/js/module/about/index.js'],

        'channel/invite'        : ['./webapp/js/module/channel/invite.js'],
        'channel/regist'        : ['./webapp/js/module/channel/regist.js'],

        'login'                 : ['./webapp/js/module/my/login.js'],
        'logon'                 : ['./webapp/js/module/my/logon.js'],
    },
    output: {
        path        : __dirname + '/dist/',
        publicPath  : 'dev' === WEBPACK_ENV ? '/dist/' : 'http://m.fangjinnet.com/dist/',
        filename    : 'js/[name]-build.min.js',
        chunkFilename: 'js/[id].chunk.js'
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
                name    : 'image/[name].[hash:8].[ext]'
            }
        }, {
            //文件加载器，处理文件静态资源
            test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader',
            query:{
                limit   : 10,
                name    : 'css/fonts/[name].[hash:8].[ext]'
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
            view_path       : __dirname + '/app/view',
            plugins         : __dirname + '/webapp/js/plugins',
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

        new HtmlWebpackPlugin(getHtmlConfig('wallet/index')),
        new HtmlWebpackPlugin(getHtmlConfig('wallet/recharge')),
        new HtmlWebpackPlugin(getHtmlConfig('wallet/cards')),
        new HtmlWebpackPlugin(getHtmlConfig('wallet/card-detail')),
        new HtmlWebpackPlugin(getHtmlConfig('wallet/bills')),
        new HtmlWebpackPlugin(getHtmlConfig('wallet/bill-detail')),
        new HtmlWebpackPlugin(getHtmlConfig('wallet/othercard')),

        new HtmlWebpackPlugin(getHtmlConfig('my/index')),
        new HtmlWebpackPlugin(getHtmlConfig('my/personal')),
        new HtmlWebpackPlugin(getHtmlConfig('my/address')),
        new HtmlWebpackPlugin(getHtmlConfig('my/forget-pwd-next')),
        new HtmlWebpackPlugin(getHtmlConfig('my/forget-pwd')),
        new HtmlWebpackPlugin(getHtmlConfig('my/pwd-manager')),
        new HtmlWebpackPlugin(getHtmlConfig('my/reset-login-pwd')),
        new HtmlWebpackPlugin(getHtmlConfig('my/reset-trade-pwd')),
        new HtmlWebpackPlugin(getHtmlConfig('my/message')),
        new HtmlWebpackPlugin(getHtmlConfig('my/bindcard')),
        new HtmlWebpackPlugin(getHtmlConfig('my/recommend')),
        new HtmlWebpackPlugin(getHtmlConfig('my/invite-record')),

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

        // 独立通用模块到 js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            // 将公共模块提取，生成名为`common`的chunk
            name:'f.vendor' // 把依赖移动到主文件
            //children:  true, // 寻找所有子模块的共同依赖
            //minChunks: 2, // 设置一个依赖被引用超过多少次就提取出来
        }),

        new webpack.HotModuleReplacementPlugin()
    ]
};
if ('dev' === WEBPACK_ENV) {
    config.entry.common.push('webpack-dev-server/client?http//192.168.1.53:3002/');
}

module.exports = config;
