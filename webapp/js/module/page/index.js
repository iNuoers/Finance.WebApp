/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-11-02 13:43:53 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-13 10:09:52
 */
'use strict'

require('plugins/swiper/swiper.jquery.min.js')
require('plugins/swiper/swiper.min.css')
require('css_path/page/index.css')

var core = require('js_path/lib/wx.core.js')
var apps = require('js_path/lib/wx.apps.js')
var api = require('js_path/lib/f.data.js')
var doT = require('plugins/template/template.js')

fjw.webapp.home = {
    init: function () {
        this.onPageLoad()
        this.listenEvent()
    },
    onPageLoad: function () {
        var me = this;
        me.method.homeData()
    },
    listenEvent: function () {
        var me = this;
        $('.entrance-panel').delegate('.item', 'click', function () {
            var idx = $('.item').index($(this));
            switch (idx) {
                case 1:
                    $(this).data('href', '').data('neelogin', true);
                    break;
            }
        });

        $(".bottomMenu div").removeClass("-current").siblings(".home_m").addClass("-current");
    },
    method: {
        ajax: function (data, callback) {
            core.ajax({
                url: core.Env.apiHost,
                data: data,
                type: 'post',
                success: function (data) {
                    callback && callback.call(this, JSON.parse(data))
                },
                error: function () { }
            });
        },
        homeData: function () {
            var me = fjw.webapp.home,
                param = {
                    M: api.method.homeData
                };

            me.method.ajax(JSON.stringify(param), function (data) {
                me.method.renderSlider(data);
                me.method.renderEntrance(data);
                me.method.renderProduct(data);
            })
        },
        renderSlider: function (data) {
            if (data && data.banner.length > 0) {

                var height = (window.screen.width / 3) + 'px';

                var tpl = '<%if(banner.length>0) {%>' +
                    '    <%for(i = 0; i < banner.length; i ++) {%>' +
                    '        <% var data = banner[i]; %>' +
                    '        <div class="swiper-slide" data-id=<%=data.id%>><a title="<%=data.title%>" href="<%=data.linkUrl%>"><img width="100%" src="<%=data.imgUrl%>" alt="<%=data.title%>"></a></div>' +
                    '     <%}%>' +
                    '<%}%>';

                var html = doT(tpl, data);
                $('.swiper-wrapper').html(html);

                new Swiper('.banner-swiper', {
                    slidesPerView: 'auto',
                    autoplay: 3000,
                    speed: 500,
                    paginationClickable: true,
                    autoplayDisableOnInteraction: false,
                    initialSlide: 0,
                    loop: true,
                    pagination: '.swiper-pagination',
                });
            }
        },
        renderEntrance: function (data) {
            if (data && data.homeHot.length > 0) {
                var tpl = '<%if(homeHot.length>0) {%>' +
                    '    <%for(i = 0; i < homeHot.length; i ++) {%>' +
                    '        <% var data = homeHot[i]; %>' +
                    '        <a class="item" href="javascript:void(0);">' +
                    '           <span class="e-icon"><img src="<%=data.imgUrl%>" alt="<%=data.title%>"></span>' +
                    '           <strong><%=data.title%></strong>' +
                    '        </a>' +
                    '    <%}%>' +
                    '<%}%>';

                var html = doT(tpl, data);
                $('.entrance-panel').html(html);

                $('.entrance-panel .item').each(function (idx) {
                    switch (idx + 1) {
                        case 1:
                            $(this).attr('data-href', '/product/detail.html?id=3');
                            break;
                        case 2:
                            $(this).attr('data-needlogin', 'true');
                            $(this).attr('data-href', '/my/recommend.html');
                            break;
                        case 3:
                            $(this).attr('data-href', '/page/activity.html');
                            break;
                        case 4:
                            $(this).attr('data-href', '/about/security.html');
                            break;
                    }
                });
            }
        },
        renderProduct: function (data) {
            if (data && data.product.id > 0) {
                var d = data.product;
                $('.pro-box .pro-rate em').text(d.yieldRate.toFixed(2));
                $('.pro-box .pro-name span').text(d.title);
                $('.pro-box .expires em').text(d.expiresText);
                $('.pro-box .share_text em').text(d.remainingShares.toFixed(0));
                $('.pro-box .btn').attr('data-href', '/product/detail.html?id=' + d.id);
            }
        }
    },
    renderData: function () {
        var that = this;

        var param = {
            M: api.method.homeData
        };
        _util.ajax.request({
            url: _api.host,
            data: JSON.stringify(param),
            method: 'POST',
            success: function (res) {

                var data = JSON.parse(res);

                that.renderSlider(data);
                that.renderEntrance(data);
                that.renderProduct(data);
            },
            error: function (err) {
            }
        });
    }
}

fjw.webapp.home.init()