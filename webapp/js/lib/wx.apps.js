/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-10-13 20:02:00 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-07 17:01:24
 */

var core = require('js_path/lib/wx.core.js')
var layer = require('plugins/layer/layer.js')

core.Namespace('Config')
core.Config.data = {}
core.Config.init = function () {

    // 快速下载
    var bar = $('.J_downbar_detail');
    if (bar[0]) {
        bar.removeClass('closed');
        bar.delegate(".oper", "click", function () {
            window.location.href = './download.html';
        })
        bar.delegate('.J_close', 'click', function () {
            bar.addClass('closed');
        })
    }

    // 回头部特效
    $(window).on("scroll", function () {
        var top = $(window).scrollTop();
        $("#F_bkTop")[(top > $(window).height() / 4 ? "add" : "remove") + "Class"]("btp-active")
    }), $("#F_bkTop").on("click", function () {
        $("html,body").animate({
            scrollTop: 0
        }, 300)
    });

    $(".app-main,#header").delegate("a[data-href],div[data-href]", "click", function (e) {
        if ($(this).data("href") && !$(this).data("preventdefault")) {
            e.stopPropagation();
            var url = $(this).data("href");
            url = (url.indexOf('http://') >= 0 || url.indexOf('https://') >= 0) ? url : core.Env.domain + core.Env.wwwRoot + url;
            var i = $(this).data("title"), needLogin = $(this).data("needlogin");

            if (needLogin)
                core.User.requireLogin(function () {
                    if (url) location.href = url;
                })
            else {
                if (url.indexOf('his') >= 0)
                    window.history.go(-1);
                else
                    location.href = url;
            }
        }
    });

    core.User.isLogin()
    if (window.user.isLogin) {
        var user = JSON.parse(core.Storage.getItem('f.ui.cache'));
        core.User.setCache(user.member)
    }

}
core.Config.generateId = function () {
    return 'AUTOID__' + (core.Config.data.generateId++).toString(36)
}
core.User.isLogin = function () {
    return $.ajax({
        url: core.Env.apiHost,
        async: false,
        type: "post",
        dataType: "json",
        data: JSON.stringify({
            M: "ValidateToken",
            D: JSON.stringify({
                Token: core.Cookie.get('f.token')
            })
        }),
        success: function (res) {
            var data = JSON.parse(res.d)
            if (data.Work) {
                window.user.isLogin = true;
            } else {
                window.user.isLogin = false;
            }
        },
        error: function () {
            window.user.isLogin = false;
        }
    }), window.user.isLogin;
}
core.Namespace('Project')
core.Project.countdown = function (e) {
    var t,
        n,
        a = this,
        o = e.serverTime,
        r = e.startTime,
        i = null,
        c = function (e) {
            return e < 10 ? '0' + e : e
        };
    if (r > o) {
        var l = e.eleShowTime,
            s = new Date(r - o);
        t = s.getMinutes(),
            n = s.getSeconds(),
            l.html(c(t) + '分' + c(n) + '秒后开售'),
            i = setInterval(function () {
                if (--n, 0 == n ? --t : n < 0 && (n = 59), t < 0) return clearInterval(i),
                    l.html('立即申购').addClass('btn-warning'),
                    e.callback && e.callback.call(a),
                    !1;
                var o = c(t) + '分' + c(n) + '秒后开售';
                l.html(o).val(o)
            }, 1000)
    }
}

core.Namespace('Message')
core.Message.alert = function (msg, time) {
    var length = arguments.length;

    if (length == 0) {
        layer.open({
            content: '操作失败',
            time: 3
        })
    } else if (length == 1) {
        layer.open({
            content: msg,
            skin: 'msg',
            time: 3
        })
    } else if (length == 2) {
        layer.open({
            content: msg,
            skin: 'msg',
            time: time
        })
    }
}
core.Message.dialog = function (msg, callback) {
    var length = arguments.length;
    if (length == 1) {
        layer.open({
            content: msg,
            btn: ['确认', '取消'],
            shadeClose: false
        })
    } else if (length == 2) {
        layer.open({
            content: msg,
            btn: ['确认', '取消'],
            shadeClose: false,
            yes: callback
        })
    }
}
core.Message.loading = function (msg) {
    var length = arguments.length;
    if (length == 1) {
        layer.open({
            type: 2,
            content: msg
        })
    } else {
        layer.open({ type: 2 })
    }
}
$(function () {
    core.Config.init()
});

module.exports = core;