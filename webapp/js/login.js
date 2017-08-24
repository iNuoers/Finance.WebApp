/*
* @Author: mr.ben
* @Date:   2017-07-20 09:12:27
* @Last Modified by:   mr.ben
* @Last Modified time: 2017-07-20 09:14:06
*/

'use strict'
require('../css/login.css')

var _f = require('./lib/app.js')
var _user = require('./service/user-service.js')

// 参考 http://m.haolyy.com/Index/getLogin/redir/L1VzZXIvbWFpbg%3D%3D

fjw.webapp.login = {

    init: function () {
        this.bindEvent();
    },
    bindEvent: function () {
        var _this = this;
        var $phone = $("#phone"),
            $pswd = $("#password"),
            $login_btn = $('#loginbtn'),
            $main_content = $(".app-main");

        setTimeout(function () {
            addEventListener()
        }, 200);

        $main_content.delegate(".quick-del", "click", function () {
            $(this).siblings("input").val(""),
                $(this).addClass("f-hide");
            $login_btn.addClass('disabled');
        });

        function addEventListener() {
            $phone.val() != "" ?
                $phone.siblings('span').show() :
                $phone.siblings('span').hide();
            $pswd.val() != "" ?
                $pswd.siblings('span').show() :
                $pswd.siblings('span').hide();
            ($phone.val().trim() != "" && $pswd.val().trim() != "") ?
                $login_btn.removeClass('disabled') :
                $login_btn.addClass('disabled');
        }

        $phone.bind("input", function () {
            window.setTimeout(function () {
                addEventListener();
            }, 0);
        });
        $pswd.bind("input", function () {
            window.setTimeout(function () {
                addEventListener();
            }, 0);
        });

        // 登录按钮的点击
        $('#loginbtn').click(function () {
            if (!$('#loginbtn').hasClass('disabled')) {
                _this.submit();
            }
        });
        $(".app-main").keyup(function (e) {
            e.preventDefault();
            if (e.keyCode === 13) {
                _this.submit();
            }
        });
    },
    submit: function () {
        var formData = {
            Domain: "webapp",
            DeviceName: '',
            DeviceName: '',
            Phone: $.trim($("#phone").val()),
            Pswd: $.trim($("#password").val())
        }, req = {
            M: "Login",
            D: JSON.stringify(formData)
        }, validateResult = this.formValidate(formData);

        if (validateResult.status && !$('#loginbtn').hasClass('disabled')) {
            _user.login(JSON.stringify(req), function (res) {

                var user = JSON.parse(res);
                debugger

                // 登录成功 保存状态 cookie
                _f.storage.setItem('F.token', user.token, { path: '/' });
                _f.storage.setItem('F.phone', user.member.phone, { path: '/' });
                _f.storage.setItem('F.avator', user.member.headPhoto, { path: '/' });

                _f.storage.setItem('f_ui_cache', res);

                window.user.isLogin = true;
                window.user.token = user.token;
                window.user.phone = user.member.phone;

                //success redirect
                window.location.href = _f.Tools.getUrlParam('redirect') || '/dist/view/my/index.html';

            }, function (errMsg) {
                showError(errMsg);
            }, function () {
                $(".error").html("").addClass("f-hide");
                $('#loginbtn i').removeClass('f-hide');
                $('#loginbtn span').text("登录中...");
                $('#loginbtn').addClass('disabled');
            }, function () {
                $('#loginbtn i').addClass('f-hide');
                $('#loginbtn span').text("立即登录");
                $('#loginbtn').removeClass('disabled');
            });
        } else {
            // 错误提示
            showError(validateResult.msg);
        }

        function showError(msg) {
            $(".error").html(msg).removeClass("f-hide")
        }
    },

    formValidate: function (formData) {
        var result = {
            status: false,
            msg: ''
        }

        var errors = {
            phone: "手机号码不能为空",
            password: "密码不能为空",
            pictureCode: "请输入图形验证码"
        }

        if (!_f.validate(formData.Phone, 'require')) {
            result.msg = errors.phone;
            return result;
        }
        if (!_f.validate(formData.Pswd, 'require')) {
            result.msg = errors.password;
            return result;
        }
        // 通过验证，返回正确提示
        result.status = true;
        result.msg = '验证通过';
        return result;
    }
};

$(function () {
    fjw.webapp.login.init();
});