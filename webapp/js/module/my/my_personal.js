/**
 * Created by PC on 2017/8/15.
 */
require('css_path/my/my_personal.css');

var _api = require('js_path/lib/f.data.js')
var _util = require('js_path/lib/f.utils.js')
var _core = require('js_path/lib/f.core.js')
var _user = require('js_path/service/user-service.js')

fjw.webapp.my_personal = {
    init: function () {
        this.listenEvent()
        this.onLoad()
    },
    onLoad: function () {
        var _this = this;
        _user.getUserInfo(JSON.stringify({
            M: _api.method.getMemberInfo,
        }), function (json) {
            var user = JSON.parse(json);
            _core.setUserInfo(user);

            $('#headImg').attr('src', user.headPhoto)
            $('.authen').text(window.user.isAuthen == 1 ? '已认证' : '未认证')
            $('.authen').addClass(window.user.isAuthen == 1 ? 'open' : 'notOpen')

            var score = _this.calcScore();
            if (score < 80)
                $('.safe').html('账户安全等级：<i>低</i>')

        }, function () {
            _core.setUserInfo();
        });
    },
    listenEvent: function () {
        $(".primary-nav_inner a").removeClass("-current").siblings(".-my").addClass("-current");
    },
    calcScore: function () {
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

$(function () {
    fjw.webapp.my_personal.init();
});