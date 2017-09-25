/*
* @Author: mr.ben(66623978) https://github.com/iNuoers/
* @Date:   2017-09-12 14:35:42
* @Last Modified by:   mr.ben(66623978) 
* @Last Modified time: 2017-09-12 14:35:42
*/
'use strict';
// require('plugins/vconsole.min.js')
require('plugins/base64/jquery.base64.js')

var _core = require('js_path/lib/f.utils.js')
var _api = require('js_path/lib/f.data.js')
var _user = require('js_path/service/user-service.js')
var attachFastClick = require('plugins/fastclick.min.js')

window.user = {
    token: '',
    phone: '',
    avator: '',
    balance: 0,
    isBuy: 0,
    isAuthen: 0,
    isLogin: false
}

var core = {
    page: {
        needLogin: ['address', 'message']
    },
    init: function () {
        this.initLink()
        this.scrollTop()
        this.initDownBar()
        this.initUserInfo()
    },
    onLoad: function () {
        var _this = this
            , host = window.location.host
            , href = window.location.href
            , path = window.location.pathname
            , page = path.split('/').pop().replace(/\.html/, '');

        if (_this.page.needLogin.toString().indexOf(page) > -1 && !window.user.isLogin) {
            _this.doLogin(href);
        }

    },
    initUserInfo: function () {
        var _this = this, user = null;

        if (_core.storage.getItem($.base64.btoa('f.token'))) {
            _user.getUserInfo(JSON.stringify({
                M: _api.method.getMemberInfo,
            }), function (json) {
                user = JSON.parse(json);
                _this.setUserInfo(user);
                _this.onLoad();
            }, function () {
                window.user.isLogin = false;
            });
        } else {
            _this.setUserInfo(user);
        }
    },
    setUserInfo: function (user) {
        window.user = {
            isLogin: !!user,
            token: user && user.token || '',
            isBuy: user && user.isBuy || 0,
            phone: user && user.phone || '',
            balance: user && user.balance || 0,
            avator: user && user.headPhoto || '',
            isInvite: user && user.friendStatus || 0,
            isAuthen: user && user.realNameAuthen || 0,
            hasPaypwd: user && user.existsTradePswd || 0
        };
    },
    initDownBar: function () {
        var url = '';

        //这里可以 进行跳转到APP指定页面

        var bar = $('.J_downbar_detail');
        if (bar[0]) {
            bar.removeClass('closed');
            bar.delegate(".oper", "click", function () {
                //alert('开始下载')
                window.location.href = './download.html';
                //i.client.open(e + window.__product.id)
            })
            bar.delegate('.J_close', 'click', function () {
                bar.addClass('closed');
            })
        }
    },
    initLink: function () {
        var _this = this;
        //https://www.yingzt.com/invest/list
        $(".app-main,#header").delegate("a[data-href],div[data-href]", "click", function (e) {
            if ($(this).attr("data-href") && !$(this).data("preventdefault")) {
                //var t = F.PLATFORM().isApp();
                e.stopPropagation();
                var url = $(this).attr("data-href");
                var i = $(this).data("title")
                    , needLogin = $(this).data("needlogin");

                if (needLogin) {
                    return _this.doLogin(url);
                }
                if (url.indexOf('his') >= 0)
                    window.history.go(-1);
                else
                    location.href = url;
            }
        });
    },
    scrollTop: function () {
        $(window).on("scroll", function () {
            var top = $(window).scrollTop();
            $("#F_bkTop")[(top > $(window).height() / 4 ? "add" : "remove") + "Class"]("btp-active")
        }), $("#F_bkTop").on("click", function () {
            $("html,body").animate({
                scrollTop: 0
            }, 300)
        });
    },
    // 统一登录处理
    doLogin: function (url) {
        var _this = this;

        if (window.user.isLogin) {
            // 已经登录 点击直接进入页面
            window.location.href = url;
            return;
        } else {
            window.location.href = 'http://192.168.1.53:3002/dist/view/login.html?redirect=' + encodeURIComponent(window.location.href);
            return;
        }
    },
    goHome: function () {
        window.location.href = '../view/index.html';
    },
}

$(function () {
    // 用于普通页面的跨框架脚本攻击(CFS)防御
    if(window.top.location !==window.location ){
        top.location.href=self.location.href;
    }

    core.init();

    attachFastClick.attach(document.body);
});

module.exports = core;