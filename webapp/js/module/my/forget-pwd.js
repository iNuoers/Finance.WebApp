/*
* @Author: mr.ben
* @Date:   2017-09-18 15:12:27
* @Last Modified by:   mr.ben
* @Last Modified time: 2017-09-18 15:12:27
*/

'use strict'
require('css_path/my/forget-pwd.css')
var _api = require('js_path/lib/f.data.js')
var _util = require('js_path/lib/f.utils.js')

fjw.webapp.forget_pwd = {
    init: function () {
        this.listenEvent();
        this.forgetpwd();

    },
    listenEvent: function () {
        $('.input-item .f-input').focus(function () {
            $(this).parents('.forget-item').find('span').addClass('active').css('display', 'block');
        })
        $('.input-item .f-input').blur(function () {
            $(this).parents('.forget-item').find('span').removeClass('active').css('display', 'none');
        })
    },
    //忘记密码
    forgetpwd: function(){
            var phone=$("#phone").val();
            var code=$("code").val();
            var param={
                Phone : phone,
                Certificate:code,
            }
            _util.ajax.request({
                method: "post",
                url: _api.host,
                data: JSON.stringify(data),
                success: function (res) {
                    var data = JSON.parse(res);
                   
                }
            })

    },
    //忘记密码_提交
    forgetpwdnext:function(){
                var password = $('#password').val();
                var recheck = $('#recheck').val();
             
    }


}

$(function(){
    fjw.webapp.forget_pwd.init();
})