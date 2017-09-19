/*
* @Author: mr.ben(66623978@qq.com)
* @Date:   2017-08-11 15:35:42
* @Last Modified by:   mr.ben
* @Last Modified time: 2017-08-11 15:35:42
*/
'use strict';

var _api = require('js_path/lib/f.data.js');
var _util = require('js_path/lib/f.utils.js');

var _user = {
    // 用户登录
    login: function (userInfo, resolve, reject, before, complete) {
        _util.ajax.request({
            url         : _api.host,
            data        : userInfo,
            method      : 'POST',
            success     : resolve,
            error       : reject,
            beforeSend  : before,
            complete    : complete
        });
    },
    // 检查手机号是否注册
    checkExistPhone :function(phone,resolve,reject){
        _util.ajax.request({
            url     : _api.host,
            data    : {
                type    : 'phone',
                str     : phone
            },
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 用户注册
    register : function(userInfo, resolve, reject, before, complete){
        _util.ajax.request({
            url     : _api.host,
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject,
            beforeSend  : before,
            complete    : complete
        });
    },
    // 检查登录状态
    checkLogin : function(){
        if (!_util.storage.getItem('F.token')) {
           //_util.goHome();
        }
    },
    // 重置密码
    resetPassword : function(userInfo, resolve, reject){
        _util.ajax.request({
            url     : _api.host,
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 获取用户信息
    getUserInfo : function(userInfo,resolve, reject){
        _util.ajax.request({
            url     : _api.host,
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 更新个人信息
    updateUserInfo : function(userInfo, resolve, reject){
        _util.ajax.request({
            url     : _api.host,
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 登录状态下更新密码
    updatePassword : function(userInfo, resolve, reject){
        _util.ajax.request({
            url     : _api.host,
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },
    // 登出
    logout : function(resolve, reject){
        _util.storage.clearItem();
    },
    // 获取验证码
    getvcode : function(userInfo,resolve, reject){
        _util.ajax.request({
            url     : _api.host,
            data    : userInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });

    },
};

_user.checkLogin();

module.exports = _user;