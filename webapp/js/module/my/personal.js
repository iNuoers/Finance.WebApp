/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-08-15 13:19:54 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-07 13:52:26
 */
'use strict'
require('css_path/my/personal.css');

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/wx.core.js')
var apps = require('js_path/lib/wx.apps.js')

fjw.webapp.my_personal = {
    init: function () {
        this.onLoad()
        this.listenEvent()
    },
    onLoad: function () {
        var me = this;

        if (window.user.isLogin) {
            if (!window.user.avator == '') {
                $('#headImg').attr('src', window.user.avator)
            }
            $('.authen').text(window.user.isAuthen == 1 ? '已认证' : '未认证')
            $('.authen').addClass(window.user.isAuthen == 1 ? 'open' : 'notOpen')
            var score = me.method.getScore();
            if (score < 80)
                $('.safe').html('账户安全等级：<i>低</i>')
        } else {
            window.location.href = core.Env.domain + core.Env.wwwRoot + '/login.html?refPaht=' + location.href;
        }
    },
    listenEvent: function () {
        $(".primary-nav_inner a").removeClass("-current").siblings(".-my").addClass("-current");

        $('.logout').click(function () {
            core.User.logOut()
            window.location.reload();
        });

        function footerPosition() {
            $(".logout").removeClass("fixed-bottom");
            var contentHeight = document.body.scrollHeight,//网页正文全文高度
                winHeight = window.innerHeight;//可视窗口高度，不包括浏览器顶部工具栏
            if (!(contentHeight > winHeight)) {
                //当网页正文高度小于可视窗口高度时，为footer添加类fixed-bottom
                $(".logout").addClass("fixed-bottom");
            }
        }
        footerPosition();
        $(window).resize(footerPosition);
    },
    method: {
        getScore: function () {
            var score = 100;
            if (window.user.isAuthen == 0) {
                score -= 30;
            }
            if (!window.user.hasPaypwd) {
                score -= 10;
            }
            return score;
        }
    }
}

$(function () {
    fjw.webapp.my_personal.init();
});
