'use strict'
require('css_path/my/my_index.css')

var _user = require('js_path/service/user-service.js')

fjw.webapp.my_index = {
    init: function () {
        this.listenEvent();
    },
    listenEvent: function () {
        $(".primary-nav_inner a").removeClass("-current").siblings(".-my").addClass("-current");
    },

}

$(function () {

    fjw.webapp.my_index.init();

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
})

$('#logout').click(function () {
    if (!$('#logout').hasClass('disabled')) {
        _user.logout();

        $('#logout').text("立即登录");
        alert("退出成功");
        $('#user_phone').text("未登录");

    }
});