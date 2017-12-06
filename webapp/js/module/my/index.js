/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-11-02 17:28:19 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-24 11:28:25
 */
'use strict'
require('css_path/my/index.css')

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/wx.core.js')
var apps = require('js_path/lib/wx.apps.js')
var layer = require('plugins/layer/layer.js')

fjw.webapp.my_index = {
    init: function () {
        this.listenEvent()
        this.onLoad()
    },
    onLoad: function () {
        var me = this;

        if (window.user.isLogin) {
            $('#user_phone').text(core.Cookie.get('f.phone'))
            $('#headImg').attr('src', core.Cookie.get('f.avator'))
        }
    },
    listenEvent: function () {
        $(".bottomMenu div").removeClass("-current").siblings(".user_m").addClass("-current");

        $('.service').click(function () {
            layer.open({
                content: '400-167-6880'
                , btn: ['<a href="tel://4001676880">呼叫</a> ', '取消']
            });
        })
    }
}

$(function () {

    fjw.webapp.my_index.init();

    
})