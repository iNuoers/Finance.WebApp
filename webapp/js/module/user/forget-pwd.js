/*
* @Author: mr.ben
* @Date:   2017-09-18 15:12:27
* @Last Modified by:   mr.ben
* @Last Modified time: 2017-09-18 15:12:27
*/

'use strict'
require('css_path/user/forget-pwd.css')

fjw.webapp.forget_pwd = {
    init: function () {
        this.listenEvent();
    },
    listenEvent: function () {
        $('.input-item .f-input').focus(function () {
            $(this).parents('.forget-item').find('span').addClass('active').css('display', 'block');
        })
        $('.input-item .f-input').blur(function () {
            $(this).parents('.forget-item').find('span').removeClass('active').css('display', 'none');
        })
    }
}

$(function(){
    fjw.webapp.forget_pwd.init();
})