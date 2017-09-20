/*
* @Author: mr.ben
* @Date:   2017-07-20 09:12:27
* @Last Modified by:   mr.ben
* @Last Modified time: 2017-07-20 09:14:06
*/

'use strict'
require('css_path/user/login.css')

var _api = require('js_path/lib/f.data.js')
var _util = require('js_path/lib/f.utils.js')
var _user = require('js_path/service/user-service.js')

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
        $phone.bind("keyup", function (e) {
            _this.method.tokeyup(e);
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
    method: {
        toblur: function (ele, val) {

        },
        tokeyup: function (event) {
            var val = $('#phone').val();
            if (val.length > 3) {
                val = val.replace(/\s*/g, "");
                val.length > 7 ? val = val.replace(/^(...)(....)/g, "$1 $2 ") :
                    (val.length > 3 ? val = val.replace(/^(...)/g, "$1 ") : val = val);
                $('#phone').val(val);
            }
        }
    },
    submit: function () {
        var formData = {
            Domain: "webapp",
            DeviceName: '',
            DeviceName: '',
            Phone: $.trim($("#phone").val().replace(/\s*/g, "")),
            Pswd: $.trim($("#password").val())
        }, req = {
            M: _api.method.login,
            D: JSON.stringify(formData)
        }, validateResult = this.formValidate(formData);

        if (validateResult.status && !$('#loginbtn').hasClass('disabled')) {
            _user.login(JSON.stringify(req), function (res) {

                var user = JSON.parse(res);

                // 登录成功 保存状态 cookie
                _util.storage.setItem($.base64.btoa('f.ui.cache'), res);
                _util.storage.setItem($.base64.btoa('f.token'), user.token);

                //success redirect
                window.location.href = _util.Tools.getUrlParam('redirect') || '/dist/view/my/index.html';

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

        if (!_util.validate(formData.Phone, 'require')) {
            result.msg = errors.phone;
            return result;
        }
        if (!_util.validate(formData.Pswd, 'require')) {
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