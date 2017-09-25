/*
* @Author: mr.ben（66623978）
* @Date:   2017-09-11 20:12:27
* @Last Modified by:   mr.ben
* @Last Modified time: 2017-09-11 20:12:27
*/

'use strict'
require('css_path/my/address.css')

var _api = require('js_path/lib/f.data.js')
var _util = require('js_path/lib/f.utils.js')
var _core = require('js_path/lib/f.core.js')
var _user = require('js_path/service/user-service.js')
var layer = require('plugins/layer/layer.js')

fjw.webapp.my_address = {
    init: function () {
        this.onLoad()
        this.listenEvent()
    },
    onLoad: function () {
        var _this = this;
        _this.method.getInfo()
    },
    listenEvent: function () {
        var _this = this;

        $('.F-submit').on('click', function () {
            _this.method.update()
        });
    },
    method: {
        getInfo: function () {
            _user.getUserInfo(JSON.stringify({
                M: _api.method.getMemberInfo,
            }), function (json) {
                var user = JSON.parse(json);
                _core.setUserInfo(user);

                $('#address').val(user.address)
                $('#zipCode').val(user.zipCode)
                $('#contactBoy').val(user.contactBoy)
                $('#contactPhone').val(user.contactPhone)
            }, function () {
                _core.setUserInfo();
            });
        },
        update: function () {
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

            _user.updateUserInfo(JSON.stringify({
                M: _api.method.modifyAddr,
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
            },function(){
                layer.open({
                    content: '操作失败,请重试...'
                    , skin: 'msg'
                    , time: 2
                });
            })
        }
    }
}

$(function () {
    fjw.webapp.my_address.init()
});