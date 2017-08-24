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

fjw.webapp.logon = {

    init: function () {
        this.bindEvent();
    },
    bindEvent: function () {
        var _this = this;
        var $phone = $("#phone"),
            $txtCode = $("#txtCode"),
            $pswd = $("#password"),
            $imgCode = $("#imgCode"),
            $logonbtn = $('#logonbtn'),
            $main_content = $(".app-main");

        setTimeout(function () {
            addEventListener()
        }, 200);

        $main_content.delegate(".quick-del", "click", function () {
            $(this).siblings("input").val(""),
            $(this).addClass("f-hide");
            $logonbtn.addClass('disabled');
        });

        function addEventListener() {
            $phone.val() != "" ? $phone.siblings('span').show() : $phone.siblings('span').hide();
            $txtCode.val() != "" ?  $txtCode.siblings('span').show() :  $txtCode.siblings('span').hide();
            $pswd.val() != "" ?  $pswd.siblings('span').show() :  $pswd.siblings('span').hide();
            $imgCode.val() != "" ?  $imgCode.siblings('span').show() :  $imgCode.siblings('span').hide();

            ($phone.val().trim() != "" && $txtCode.val().trim() != ""  && $pswd.val().trim() != ""  && $imgCode.val().trim() != "") ?
                $logonbtn.removeClass('disabled') :
                $logonbtn.addClass('disabled');
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
        $txtCode.bind("input", function () {
            window.setTimeout(function () {
                addEventListener();
            }, 0);
        });
        $imgCode.bind("input", function () {
            window.setTimeout(function () {
                addEventListener();
            }, 0);
        });

        // 登录按钮的点击
        $('#logonbtn').click(function () {
            if (!$('#logonbtn').hasClass('disabled')) {
                _this.submit();
            }
        });
        $(".app-main").keyup(function (e) {
            e.preventDefault();
            if (e.keyCode === 13) {
                _this.submit();
            }
        });

        $('#btnGetVCode').click(function () {
            if ($.trim($("#phone").val())) {
                _this.getVCode();

                //倒计时
                // $('#btnGetVCode').hide();
                // $('#second').html('5');
                // $('#resetCode').show();
                // var second = 5;
                // var timer = null;
                // timer=setInterval(function(){
                //     second -= 1;
                //     if(second >0 ){
                //         $('#second').html(second);
                //     }else{
                //         clearInterval(timer);
                //         $('#btnGetVCode').show();
                //         $('#resetCode').hide();
                //     }
                // },1000);

            }else{
                $(".error").html("请填写手机号").removeClass("f-hide")
            }

            



        });
    },
    getVCode: function(){
        var fromDataCode = {
            Domain: "webapp",
            DeviceName: 'weiguanwang',
            Phone: $.trim($("#phone").val()),
            Type: "1"
        }, req = {
            M: "GetVCode",
            D: JSON.stringify(fromDataCode)
        }, validateResult = _f.validate(fromDataCode.Phone, 'require');

        if (validateResult) {
            _user.getvcode(JSON.stringify(req), function (res) {
                alert("发送成功");
            }, function (errMsg) {
                showError(errMsg);
            });
        } else {
            // 错误提示
            showError(validateResult.msg);
        }

        function showError(msg) {
            $(".error").html(msg).removeClass("f-hide")
        }
    },
    submit: function () {
        var formData = {
            Domain: "webapp",
            DeviceName: 'weiguanwang',
            Phone: $.trim($("#phone").val()),
            VCode: $.trim($("#txtCode").val()),
            Pswd: $.trim($("#password").val()),
            Channel: 'weiguanwang',
            FriendPhone: $.trim($("#password").val())
        }, req = {
            M: "Regist",
            D: JSON.stringify(formData)
        }, validateResult = this.formValidate(formData);

        if (validateResult.status && !$('#logonbtn').hasClass('disabled')) {
            _user.register(JSON.stringify(req), function (res) {

                var user = JSON.parse(res);

                // 注册成功 保存状态 cookie
                _f.storage.setItem('F.token', user.token, { path: '/' });
                _f.storage.setItem('F.phone', user.member.phone, { path: '/' });
                _f.storage.setItem('F.avator', user.member.headPhoto, { path: '/' });

                _f.storage.setItem('f_ui_cache', res);

                //success redirect
                window.location.href = _f.Tools.getUrlParam('redirect') || '/dist/view/my/index.html';

            }, function (errMsg) {
                showError(errMsg);
            }, function () {
                $(".error").html("").addClass("f-hide");
                $('#logonbtn i').removeClass('f-hide');
                $('#logonbtn span').text("注册中...");
                $('#logonbtn').addClass('disabled');
            }, function () {
                $('#logonbtn i').addClass('f-hide');
                $('#logonbtn span').text("立即注册");
                $('#logonbtn').removeClass('disabled');
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
    fjw.webapp.logon.init();
});