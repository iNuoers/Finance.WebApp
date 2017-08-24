/*
* @Author: mr.ben
* @Date:   2017-07-21 16:35:42
* @Last Modified by:   mr.ben
* @Last Modified time: 2017-07-21 16:43:17
*/
'use strict';

require('node_modules/font-awesome/css/font-awesome.min.css');
require('node_modules/weui/dist/style/weui.min.css');
require('../../css/base.css');
require('../../css/core.css');

// 关于跳转 看这个 http://www.huaguo.cn/m/js/v2/g_event_api.js

var F = {
    config: {
        serverHost: 'https://api.fangjinnet.com:1000/api',

        apiMethod: {
            // 首页数据
            homeData: "AppHomeData",
            // 产品列表
            productList: "ProductList",
            // 产品详情
            productDetail: "ProductDetail",
            // 产品购买记录
            productBuyRecord: "BuyRecord",
            // 产品购买排行榜
            productBuyRank: "ProductBuyRank",
            // 产品类型
            productTypeList: "GetProductTypes",

            // 活动列表
            activityList: "NewActivityList",

            // 帮助类别
            getHelpType: "GetHelpType",
            // 帮助中心
            helpCenterList: "HelpCenterListForPC",

            // 我的好友
            getFriendList: "GetFriendList"

        }
    },

    cache: {
        isLogin: false,
        glb_user_phone: '',
        glb_user_token: '',
        glb_user_avator: ''
    },

    // 本地缓存
    storage: {
        /**
         * 
         * @param {} key 
         * @returns {} 
         */
        getItem: function (key) {
            //假如浏览器支持本地存储则从localStorage里getItem，否则乖乖用Cookie
            return window.localStorage ? localStorage.getItem(key) : cookie.get(key);
        },
        /**
         * 
         * @param {} key 
         * @param {} val 
         * @returns {} 
         */
        setItem: function (key, val) {
            //假如浏览器支持本地存储则调用localStorage，否则乖乖用Cookie
            if (window.localStorage) {
                localStorage.setItem(key, val);
            } else {
                cookie.set(key, val);
            }
        },
        /**
         * 
         * @param {} key 
         * @returns {} 
         */
        delItem: function (key) {
            //假如浏览器支持本地存储则调用localStorage，否则乖乖用Cookie
            if (window.localStorage) {
                localStorage.removeItem(key);
            } else {
                cookie.remove(key, val);
            }
        },
        /**
         * 
         * @returns {} 
         */
        clearItem: function () {
            if (window.localStorage) {
                localStorage.clear();
            }
        }
    },
    // 网络请求
    request: function (param) {
        var _this = this;
        $.ajax({
            url: param.url || '',
            data: param.data || '',
            type: param.method || 'get',
            async: param.async || true,
            cache: param.cache || true,
            dataType: param.type || 'json',
            complete: param.complete,
            beforeSend: param.beforeSend,
            crossDomin: true,
            xhrFields: {
                withCredentials: false
            },
            timeout: param.timeout || 1000 * 60 * 10,
            success: function (res) {
                // 请求成功
                if (0 === res.s) {
                    typeof param.success === 'function' && param.success(res.d, res.es);
                }
                // 没有登录状态，需要强制登录
                else if (101 === res.status) {
                    _this.doLogin();
                }
                // 请求数据错误
                else if (1 <= res.s) {
                    typeof param.error === 'function' && param.error(res.es);
                } else {
                    typeof param.hideLoading === 'function' && param.hideLoading();
                }
            },
            error: function (err, status) {
                //如果出现timeout，不做处理
                if (status === "timeout") {
                    if (console) {
                        console.log("ajax超时！  url=" + param.url);
                    }
                } else if (status === "abort") {
                    if (console) {
                        console.log("ajax客户端终止请求！  url=" + param.url);
                    }
                }
                typeof param.error === 'function' && param.error(err.statusText);
            }
        });
    },
    String: {
        // 修剪两端空白字符和换行符
        trim: function (s) {
            return s.replace(/(^\s*)|(\s*$)|(\n)/g, "");
        },
        // 修剪左端空白字符和换行符
        leftTrim: function (s) {
            return s.replace(/(^\s*)|(^\n)/g, "");
        },
        // 修剪右端空白字符和换行符
        rightTrim: function (s) {
            return s.replace(/(\s*$)|(\n$)/g, "");
        },
        // 格式化数字
        numberFormat: function (s, l) {
            if (!l || l < 1) l = 3;
            s = String(s).split(".");
            s[0] = s[0].replace(new RegExp('(\\d)(?=(\\d{' + l + '})+$)', 'ig'), "$1,");
            return s.join(".");
        },
        // 星号字节
        asteriskByte: function (s, start, end) {
            var startStr = start ? s.substr(0, start) : "";
            var endStr = end ? s.substr(end + 1) : "";
            var star = "", l;
            l = !start && !end ? s.length : (start && !end ? s.length - start : end);
            while (star.length < l) star += "*";
            return startStr + star + endStr;
        },
        // 四舍五入保留n位小数(默认保留两位小数)
        twoDecimalPlaces: function (s, l) {
            if (isNaN(parseFloat(s)) || s == 0) return "0.00";
            var bit = !l ? 100 : Math.pow(10, l);
            var str = String(Math.round(s * bit) / bit);
            if (str.indexOf(".") != -1 && str.length <= str.indexOf(".") + 2) str += '0';
            else if (str.indexOf(".") == -1) str += '.00';
            return str;
        },
        // 格式化银行卡
        formatBank: function (s) {
            var str = s.substring(0, 22); /*帐号的总数, 包括空格在内 */
            if (str.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
                /* 对照格式 */
                if (str.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" +
                    ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
                    var accountNumeric = accountChar = "", i;
                    for (i = 0; i < str.length; i++) {
                        accountChar = str.substr(i, 1);
                        if (!isNaN(accountChar) && (accountChar != " ")) accountNumeric = accountNumeric + accountChar;
                    }
                    str = "";
                    for (i = 0; i < accountNumeric.length; i++) {    /* 可将以下空格改为-,效果也不错 */
                        if (i == 4) str = str + " "; /* 帐号第四位数后加空格 */
                        if (i == 8) str = str + " "; /* 帐号第八位数后加空格 */
                        if (i == 12) str = str + " ";/* 帐号第十二位后数后加空格 */
                        str = str + accountNumeric.substr(i, 1)
                    }
                }
            }
            else {
                str = " " + str.substring(1, 5) + " " + str.substring(6, 10) + " " + str.substring(14, 18) + "-" + str.substring(18, 25);
            }
            return str;
        }
    },
    Tools: {
        // 获取屏幕分辨率
        screenSize: function () {
            return (window.screen.width || 0) + "x" + (window.screen.height || 0);
        },
        // 获取 url 参数
        getUrlParam: function (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
            var result = window.location.search.substr(1).match(reg);
            return result ? decodeURIComponent(result[2]) : null;
        },
        // 客户端通过scheme打开url
        openSchemeUrl: function (url) {
            window.location.href = F.getSchemeUrl(url);
        },
        getSchemeUrl: function (urlName) {
            var apiPrefix = window.location.protocol + '//' + window.location.host;
            var baseUrl = apiPrefix + getRelativePath();
            var schemeBase = 'fjw://webview?url=';
            if (platform.android || platform.ios) {
                urlName = schemeBase + baseUrl + urlName;
            }
            return urlName;
        },

        // 生成uuid
        uuid: function (len, radix) {
            var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var chars = CHARS, uuid = [], i;
            radix = radix || chars.length;

            if (len) {
                // Compact form
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
            } else {
                // rfc4122, version 4 form
                var r;

                // rfc4122 requires these characters
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';

                // Fill in random data.  At i==19 set the high bits of clock sequence as
                // per rfc4122, sec. 4.1.5
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }

            return uuid.join('');
        }
    },
    // 字段的验证，支持非空、手机、邮箱的判断
    validate: function (value, type) {
        var value = $.trim(value);
        // 非空验证
        if ('require' === type) {
            return !!value;
        }
        // 手机号验证
        if ('phone' === type) {
            return /^1\d{10}$/.test(value);
        }
        // 邮箱格式验证
        if ('email' === type) {
            return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
        }
        // 密码只能6-16位字母+数字的密码
        if ('pswd' == type) {
            return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value);
        }
    }
}

module.exports = F;