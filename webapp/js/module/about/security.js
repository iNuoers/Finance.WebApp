/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-11-07 10:01:51 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-07 10:08:12
 */
'use strict'
require('plugins/swiper/swiper.jquery.min.js')
require('plugins/swiper/swiper.min.css')
require('css_path/page/security.css')

fjw.webapp.security = {
    init: function () {
        new Swiper(".swiper-container", {
            direction: "vertical",
            loop: false,
            heigth: 45,
            autoplay: false,
            onSlideChangeEnd: function (e) {

            }
        });
        $("#swiper1").css({
            paddingTop: .6 * parseInt($("#swiper1").css("height")) + "px"
        });
        $("#swiper2").css({
            paddingTop: .6 * parseInt($("#swiper2").css("height")) + "px"
        });
        $("#swiper3").css({
            paddingTop: .55 * parseInt($("#swiper3").css("height")) + "px"
        });
        $("#swiper4").css({
            paddingTop: .6 * parseInt($("#swiper4").css("height")) + "px"
        })
    }
};

fjw.webapp.security.init()
