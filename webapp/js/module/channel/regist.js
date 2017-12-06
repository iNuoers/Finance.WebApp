/*
* @Author: mr.ben
* @Date:   2017-09-18 15:12:27
* @Last Modified by:   mr.ben
* @Last Modified time: 2017-09-18 15:12:27
*/

'use strict'
require('css_path/channel/regist.css')

var _api = require('js_path/lib/f.data.js')
var _util = require('js_path/lib/f.utils.js')
var template = require('plugins/template/template.js')
var layer = require('plugins/layer/layer.js')


var inivitePage = {
    init: function () {
        this.fnGetCode();
        this.fnfrends();
    },
    // 获取短信验证码
    fnGetCode: function () {
        $('.code').on("click", function () {
            var phone =_util.Tools.getUrlParam('phone');
            var param = {
                phone: phone,
                type: 1
            };
            var data = {
                M: _api.method.getVCode,
                D: JSON.stringify(param)
            };
            var time = 60, ele = $(".code");

            _util.ajax.request({
                method: "post",
                url: _api.host,
                data: JSON.stringify(data),
                success: function (res) {
                    var data = JSON.parse(res);
                    layer.open({
                        content: data.message,
                        skin: "msg",
                        time: 2
                    });
                    var interId = setInterval(function () {
                        time--;
                        ele.html(time + "秒");
                        if (time === 0) {
                            clearInterval(interId);
                            ele.text("获取验证码");
                        }
                    }, 1000);
                },
                error: function (res) {
                    layer.open({
                        content: res,
                        skin: "msg",
                        time: 2
                    });
                }
            })

        });

    },
    //好友注册
    fnfrends: function () {

        $('.invi-btn').on('click', function () {
            var phone = _util.Tools.getUrlParam('phone');
            var code = $('#code').val();
            var passWord = $('#password').val();
            var param = {
                Phone: phone,
                Pswd: passWord,
                VCode: code,
            };
            var data = {
                M:  _util.ajax.regist,
                D: JSON.stringify(param)
            };
            console.info(data);
             _util.ajax.request({
                method: "post",
                url: _api.host,
                data: JSON.stringify(data),
                success: function (data) {
                    $('.logon-alert').show();
                    $('.logon-alert').on('click', function () {
                        $(this).hide();
                    })
                    $('.a-btn').on('click', function () {
                        //要跳转的地址
                    })
                },
                error: function (res) {
                    layer.open({
                        content: res
                        , skin: "msg"
                        , time: 2
                    });
                }
            });


        })






    }
}




$(function () {
    inivitePage.init()
})
