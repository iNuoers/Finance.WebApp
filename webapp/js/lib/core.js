var attachFastClick = require('../../plugins/fastclick.min.js')
// require('../../plugins/vconsole.min.js')
// require('./statistics.js')

var _f = require('./app.js');

window.user = {
    token: '',
    phone: '',
    avator: '',
    isLogin: false
};
window.agent = window.navigator.userAgent.toLowerCase();

var core = {
    init: function () {
        this.initUser();
        this.initLink();
        this.scrollTop();
        this.initDownBar();
        this.initHeaderAnimation();
    },
    initUser: function () {

        if (_f.storage.getItem('F.token')) {
            var user = JSON.parse(_f.storage.getItem('f_ui_cache'));

            _f.cache.isLogin = true;
            _f.cache.glb_user_phone = user.member.phone;
            _f.cache.glb_user_avator = user.member.headPhoto;
            _f.cache.glb_user_token = user.token;

            window.user = {
                token: _f.cache.glb_user_token,
                phone: _f.cache.glb_user_phone,
                avator: _f.cache.glb_user_avator,
                isLogin: _f.cache.isLogin
            };
        } else {
            _f.cache.isLogin = false;
            _f.cache.glb_user_token = '';
            _f.cache.glb_user_phone = '';
            _f.cache.glb_user_avator = '';
        }

    },
    initHeaderAnimation: function () {
        var win = $(window), header = $('header#header');
        if (!header.length) {
            return false;
        }
        var height = header.height(),
            top = win.scrollTop(),
            s = null,
            c = function () {
                var scrollTop = win.scrollTop();
                if (screenTop <= height) {
                    header.removeClass('hide-hd').addClass('show-hd');
                } else if (Math.abs(screenTop - top) >= 10) {
                    if (screenTop - top > 0) {
                        header.addClass('hide-hd').removeClass('show-hd');
                    } else if (screenTop - top < 0) {
                        header.removeClass("hide-hd").addClass("show-hd")
                    }
                }
            };
        $(window).scroll(function () {
            if (window.requestAnimationFrame) {
                if (s) {
                    window.cancelAnimationFrame(s)
                } else {
                    s = window.requestAnimationFrame(c)
                }
            } else {
                if (s) {
                    window.clearTimeout(s)
                } else {
                    s = window.setTimeout(c, 100)
                }
            }
        });
        $(window).on('resize orientationchange', function () {
            top = win.screenTop();
        });
        $(document).on('focus', 'input', function () {
            header.hide();
        });
        $(document).on('blur', 'input', function () {
            header.show();
        });
    },
    initDownBar: function () {
        var url = '';

        //这里可以 进行跳转到APP指定页面

        var bar = $('.J_downbar_detail');
        if (bar[0]) {
            bar.removeClass('closed');
            bar.delegate(".oper", "click", function () {
                alert('开始下载')
                //window.location.href = '';
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
            if ($(this).data("href") && !$(this).data("preventdefault")) {
                //var t = F.PLATFORM().isApp();
                e.stopPropagation();
                var url = $(this).data("href");
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

        if (window.user.phone != "") {
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
    ajaxSet: function (cache) {
        cache = (cache === false ? false : true);
        $.ajaxSetup({
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            cache: cache
        });
        //ajax全局设置  超时时间：8秒
        $.ajaxSetup({
            timeout: 1000 * 60 * 10
        });

        /**
         * ajax请求开始时执行函数
         * event    - 包含 event 对象
         * xhr      - 包含 XMLHttpRequest 对象
         * options  - 包含 AJAX 请求中使用的选项
         */
        $(document).ajaxSend(function (event, xhr, opt) {
            if (opt.type.toLowerCase() === "post") {
                //xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                if (opt.data != null && opt.data !== "" && typeof (opt.data) !== "undefined") {
                    var data = JSON.parse(opt.data);
                    data.P = 4;
                    data.IE = false;
                    data.T = _f.cache.glb_user_token;
                    opt.data = JSON.stringify(data);
                }
            }
        });
    },
};


$(function () {
    // 用于普通页面的跨框架脚本攻击(CFS)防御
    if (top.location != self.location) top.location.href = self.location;

    core.init();

    core.ajaxSet();

    attachFastClick.attach(document.body);

})

module.exports = core;