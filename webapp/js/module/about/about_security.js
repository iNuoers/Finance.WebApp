'use strict'
require('plugins/swiper/swiper.jquery.min.js')
require('plugins/swiper/swiper.min.css')
require('css_path/page/security.css')

var aboutSecurity = {
    init : function () {
        new Swiper(".swiper-container", {
            direction: "vertical",
            loop: false,
            heigth:45,
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

$(function () {
   aboutSecurity.init();
});

