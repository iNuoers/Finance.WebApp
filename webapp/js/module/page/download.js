/**
 * Created by cheney on 2017/9/4.
 */
'use strict'

require('css_path/page/download.css')
require('plugins/swiper/swiper.min.css')
require('plugins/swiper/swiper.animate.min.css')
require('plugins/swiper/swiper.jquery.min.js')
require('plugins/device/device.min.js')
var swiperAn = require('plugins/swiper/swiper.animate.min.js')

$(function() {
  // 动画
    var scaleW = window.innerWidth / 320;
    var scaleH = window.innerHeight / 480;
    var resizes = document.querySelectorAll('.resize');
    for (var j = 0; j < resizes.length; j++) {
        resizes[j].style.width = parseInt(resizes[j].style.width) * scaleW + 'px';
        resizes[j].style.height = parseInt(resizes[j].style.height) * scaleH + 'px';
        resizes[j].style.top = parseInt(resizes[j].style.top) * scaleH + 'px';
        resizes[j].style.left = parseInt(resizes[j].style.left) * scaleW + 'px'
    }
    var mySwiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        pagination: '.swiper-pagination',
        mousewheelControl: true,
        onInit: function(swiper) {
            swiperAn.swiperAnimateCache();
            swiperAn.swiperAnimate(swiper)
        },
        onSlideChangeEnd: function(swiper) {
            swiperAn.swiperAnimate(swiper)
        },
        onTransitionEnd: function(swiper) {
            swiperAn.swiperAnimate(swiper)
        },
        watchSlidesProgress: true,
        onProgress: function(swiper) {
            for (var i = 0; i < swiper.slides.length; i++) {
                var slide = swiper.slides[i];
                var progress = slide.progress;
                var translate = progress * swiper.height / 4;
                var scale = 1 - Math.min(Math.abs(progress * 0.5), 1);
                var opacity = 1 - Math.min(Math.abs(progress / 2), 0.5);
                slide.style.opacity = opacity;
                var es = slide.style;
                es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = 'translate3d(0,' + translate + 'px,-' + translate + 'px) scaleY(' + scale + ')'
            }
        },
        onSetTransition: function(swiper, speed) {
            for (var i = 0; i < swiper.slides.length; i++) {
                var es = swiper.slides[i].style;
                es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = speed + 'ms'
            }
        },
    });

    // 动画结束

    // 点击下载 如果手机已经安装过APP，默认打开，无需提示用户去下载
    
})
; (function () {
// 下载
    var iosUrl = "//itunes.apple.com/gb/app/yi-dong-cai-bian/id1136075538?mt=8", androidUrl = "http://www.fangjinnet.com/resource/fjw_app.apk";
    function isWeiXin() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    }
    if (isWeiXin()) {
        $(".d-btn > a").on("click", function () {
          alert("微信中无法下载")
        });
    }
    else {
        if (device.iphone()) {
            $(".d-btn > a").attr("href", iosUrl);
            setTimeout(function () {
                downloadFile(iosUrl);
            }, 1000);
        } else {
            $(".d-btn > a").attr("href", androidUrl);

            setTimeout(function () {
                downloadFile(androidUrl);
            }, 1000);
        }
    }

    function downloadFile(url) {
        try {
            window.location.href = url;
        } catch (e) {
        }
    }
    return false;
})();
