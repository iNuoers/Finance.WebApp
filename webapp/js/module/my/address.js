/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-09-11 20:12:27
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-07 15:58:39
 */

'use strict'
require('css_path/my/address.css')

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/wx.core.js')
var apps = require('js_path/lib/wx.apps.js')
var layer = require('plugins/layer/layer.js')

fjw.webapp.my_address = {
    init: function () {
        this.onLoad()
        this.listenEvent()
    },
    onLoad: function () {
        var me = this;
        me.method.getInfo()
    },
    listenEvent: function () {
        var me = this;

        $('.F-submit').on('click', function () {
            me.method.update()
        });
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
                error: function () {
                    layer.open({
                        content: '操作失败,请重试...'
                        , skin: 'msg'
                        , time: 2
                    });
                }
            });
        },
        getInfo: function () {
            if (window.user.isLogin) {
                var data = JSON.parse(core.Storage.getItem('f.ui.cache')),
                    user = data.member;

                $('#address').val(user.address)
                $('#zipCode').val(user.zipCode)
                $('#contactBoy').val(user.contactBoy)
                $('#contactPhone').val(user.contactPhone)
            } else {
                window.location.href = core.Env.domain + core.Env.wwwRoot + '/login.html?refPaht=' + location.href;
            }
        },
        update: function () {
            var me = fjw.webapp.my_address;
            var code = $("#zipCode").val();
            var name = $("#contactBoy").val();
            var address = $("#address").val();
            var phone = $("#contactPhone").val();
            var param = {
                ContactName: name,
                Phone: phone,
                Addr: address,
                ZipCode: code
            };

            me.method.ajax(JSON.stringify({
                M: api.method.modifyAddr,
                D: JSON.stringify(param)
            }), function () {
                layer.open({
                    content: '操作成功'
                    , skin: 'msg'
                    , time: 2
                });
                setTimeout(function () {
                    window.history.go(-1)
                }, 1000)
            });
        }
    }
}

$(function () {
    fjw.webapp.my_address.init()
});