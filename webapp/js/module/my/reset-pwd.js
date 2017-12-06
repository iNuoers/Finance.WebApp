/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-09-18 15:12:27
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-07 17:43:00
 */

'use strict'
require('css_path/my/reset-pwd.css')

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/wx.core.js')
var apps = require('js_path/lib/wx.apps.js')
var layer = require('plugins/layer/layer.js')

fjw.webapp.resetpwd = {
    init: function () {
        this.onPageLoad()
        this.listenEvent()
    },
    onPageLoad: function () {
        var me = this
    },
    listenEvent: function () {
        var me = this
        $('#loginbtn').on('click', function () {

            if (!window.user.isLogin) {
                window.location.href = core.Env.domain + core.Env.wwwRoot + '/login.html?refPaht=' + location.href;
            }
            var match = /[\u4e00-\u9fa5]/g,
                oldpwd = $('#oldpwd').val(),
                newpwd = $('#newpwd').val(),
                confirmpwd = $('#confirmpwd').val();

            var msg = '';

            var checkRule = function () {
                if (oldpwd == '') {
                    msg = '请输入您的原密码';
                }
                else if (newpwd == '') {
                    msg = '请输入您的新密码';
                }
                else if (match.test(newpwd)) {
                    msg = '登陆密码不支持中文';
                }
                else if (newpwd.length < 6) {
                    msg = '请输入6-16个字符的新密码';
                }
                else if (oldpwd == newpwd) {
                    msg = '新密码不可与旧密码相同';
                }
                else if (confirmpwd == '') {
                    msg = '请确认您的新密码';
                }
                else if (confirmpwd != newpwd) {
                    msg = '确认密码与新密码不一致';
                }
                if (msg != '') {
                    return { msg: msg, res: false };
                }
                return { msg: '', res: true };
            }

            var result = checkRule()
            if (result.res) {
                var param = {
                    M: api.method.modifyLoginPswd,
                    D: JSON.stringify({
                        NewPswd: newpwd,
                        OldPswd: oldpwd
                    })
                }
                me.method.ajax(JSON.stringify(param), function () {
                    core.Message.alert('操作成功')
                    setTimeout(function () {
                        core.User.logOut()
                        window.location.href = core.Env.domain + core.Env.wwwRoot + '/login.html';
                    }, 1000)
                })
            } else {
                core.Message.alert(result.msg)
            }
        });

        $('.sure-btn').on('click', function () {
            if (!window.user.isLogin) {
                window.location.href = core.Env.domain + core.Env.wwwRoot + '/login.html?refPaht=' + location.href;
            }
            var match = /^[0-9]*$/,
                troldpwd = $('#troldpwd').val(),
                trnewpwd = $('#trnewpwd').val(),
                trconfimpwd = $('#trconfimpwd').val();

            var msg = '';

            var checkRule = function () {
                if (troldpwd == '') {
                    msg = '请输入您的当前交易密码';
                }
                else if (trnewpwd == '') {
                    msg = '请输入您的新交易密码';
                }
                else if (!match.test(trnewpwd)) {
                    msg = '交易密码仅支持数字';
                }
                else if (trnewpwd.length < 6) {
                    msg = '请输入6-16个字符的新交易密码';
                }
                else if (troldpwd == trnewpwd) {
                    msg = '新密码不可与旧密码相同';
                }
                else if (trconfimpwd == '') {
                    msg = '请确认您的新交易密码';
                }
                else if (trconfimpwd != trnewpwd) {
                    msg = '确认交易密码与新交易密码不一致';
                }
                if (msg != '') {
                    return { msg: msg, res: false };
                }
                return { msg: '', res: true };
            }

            var result = checkRule()
            if (result.res) {
                var param = {
                    M: api.method.resetTradePswd,
                    D: JSON.stringify({
                        NewPswd: trnewpwd,
                        OldPswd: troldpwd
                    })
                }
                me.method.ajax(JSON.stringify(param), function () {
                    core.Message.alert('操作成功')
                })
            } else {
                core.Message.alert(result.msg)
            }
        })
    },
    method: {
        ajax: function (data, callback) {
            core.ajax({
                url: core.Env.apiHost,
                data: data,
                type: 'post',
                success: function (data) {
                    callback && callback.call(this, (data != '' && JSON.parse(data)))
                },
                error: function (res) {
                    layer.open({
                        content: res
                        , skin: 'msg'
                        , time: 2
                    });
                }
            });
        }
    }
}

fjw.webapp.resetpwd.init()