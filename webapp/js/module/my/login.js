/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-07-20 09:12:27
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-07 17:07:11
 */
'use strict'
require('css_path/my/login.css')

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/wx.core.js')
var apps = require('js_path/lib/wx.apps.js')

// 参考 http://m.haolyy.com/Index/getLogin/redir/L1VzZXIvbWFpbg%3D%3D

fjw.webapp.login = {

    init: function () {
        this.bindEvent();
    },
    bindEvent: function () {
        var me = this;
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
            me.method.tokeyup(e);
        });
        $pswd.bind("input", function () {
            window.setTimeout(function () {
                addEventListener();
            }, 0);
        });

        // 登录按钮的点击
        $('#loginbtn').click(function () {
            if (!$('#loginbtn').hasClass('disabled')) {
                me.submit();
            }
        });
        $(".app-main").keyup(function (e) {
            e.preventDefault();
            if (e.keyCode === 13) {
                me.submit();
            }
        });
    },
    method: {
        ajax: function (data, callback) {
            core.ajax({
                url: core.Env.apiHost,
                data: data,
                type: 'post',
                beforeSend: function () {
                    $(".error").html("").addClass("f-hide");
                    $('#loginbtn i').removeClass('f-hide');
                    $('#loginbtn span').text("登录中...");
                    $('#loginbtn').addClass('disabled');
                },
                complete: function () {
                    $('#loginbtn i').addClass('f-hide');
                    $('#loginbtn span').text("立即登录");
                    $('#loginbtn').removeClass('disabled');
                },
                success: function (data) {
                    callback && callback.call(this, JSON.parse(data))
                },
                error: function (msg) {
                    core.Message.alert(msg)
                    $('#loginbtn i').addClass('f-hide');
                    $('#loginbtn span').text("立即登录");
                    $('#loginbtn').removeClass('disabled');
                }
            });
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
        var me = fjw.webapp.login,
            formData = {
                Domain: "webapp",
                DeviceName: '',
                DeviceName: '',
                Phone: $.trim($("#phone").val().replace(/\s*/g, "")),
                Pswd: $.trim($("#password").val())
            }, req = {
                M: api.method.login,
                D: JSON.stringify(formData)
            }, validateResult = this.formValidate(formData);

        if (validateResult.status && !$('#loginbtn').hasClass('disabled')) {
            me.method.ajax(JSON.stringify(req), function (user) {
                // 登录成功 保存状态 cookie
                core.Cookie.set('f.token', user.token, 20, '/')
                core.Cookie.set('f.phone', user.member.phone, 20, '/')
                core.Cookie.set('f.avator', user.member.headPhoto, 20, '/')

                core.Storage.setItem('f.token', user.token)
                core.Storage.setItem('f.ui.cache', JSON.stringify(user))

                //success redirect
                window.location.href = core.String.getQuery('refPath') || core.Env.domain + core.Env.wwwRoot + '/my/index.html';

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

        if (core.String.isBlank(formData.Phone)) {
            result.msg = errors.phone;
            return result;
        }
        if (core.String.isBlank(formData.Pswd)) {
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
