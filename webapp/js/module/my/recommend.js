/*
* @Author: mr.ben
* @Date:   2017-09-18 15:12:27
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-01 18:42:24
*/

'use strict'
require('css_path/my/recommend.css')
// require('plugins/clipboard/clipboard.min.js')
var _api = require('js_path/lib/f.data.js')
var _util = require('js_path/lib/f.utils.js')
var layer = require('plugins/layer/layer.js')



fjw.webapp.recommed = {
    isMove: true,
    // 初始化
    init: function () {
        var _this = this;
        _this.onLoad();

    },
    onLoad: function () {
        var _this = this;
        _this.method.fnrecommed();
        _this.method.fnshare();

        window.addEventListener('touchmove', function (e) {
            if (!fjw.webapp.recommed.isMove) e.preventDefault();
        });
    },
    method: {
        fnrecommed: function () {
            var req = {
                M: _api.method.homeData,
            };
            _util.ajax.request({
                url: _api.host,
                method: 'post',
                data: JSON.stringify(req),
                success: function (json) {
                    var data = JSON.parse(json);
                    var text = data.recommend.content;
                    if (text) {
                        var text2 = text.replace("！", '！</br>');
                        $('.content').html(text2.replace(/；/g, '；</br></br>'))
                    }

                }

            })

        },
        fnshare: function () {
            var share = $('.sh-friends');
            $('.sh-click').on('click', function () {
                share.show();
                fjw.webapp.recommed.isMove = false
            });
            share.on('click', function () {
                share.hide();
                fjw.webapp.recommed.isMove = true
            });


        }
    }


}

$(function () {
    fjw.webapp.recommed.init();
})

$(document).ready(function () {
    // 复制链接开始

    var clipboard = new Clipboard('.tc', {
        text: function () {
            return 'http://192.168.31.243:3002/dist/view/channel/invite.html';
        }
    });
    clipboard.on('success', function () {
        layer.open({
            content: "复制成功",
            skin: "msg",
            time: 2
        });
    });

    clipboard.on('error', function (e) {
        console.log('请重新复制');
    });
    // 复制链接结束
})


