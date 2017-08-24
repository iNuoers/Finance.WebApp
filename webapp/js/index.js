'use strict'

require('../plugins/swiper/swiper.jquery.min.js')
require('../plugins/swiper/swiper.min.css')
require('../css/index.css')

require('./lib/core.js')

var _f = require('./lib/app.js')
var template = require('../plugins/template/template.js')

fjw.webapp.home = {
    init: function () {
        this.renderData();
        this.listenEvent();
    },
    listenEvent: function () {
        $(".primary-nav_inner a").removeClass("-current").siblings(".-home").addClass("-current");
    },
    renderData: function () {
        var that = this;

        var param = {
            M: _f.config.apiMethod.homeData
        }
        _f.request({
            url: _f.config.serverHost,
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
    },
    renderSlider: function (data) {
        if (data && data.banner.length > 0) {

            var height = (window.screen.width / 3) + 'px';

            var tpl = '<%if(banner.length>0) {%>' +
                '    <%for(i = 0; i < banner.length; i ++) {%>' +
                '        <% var data = banner[i]; %>' +
                '        <div class="swiper-slide" data-id=<%=data.id%>><a title="<%=data.title%>" href="<%=data.linkUrl%>"><img height=' + height + ' width="100%" src="<%=data.imgUrl%>" alt="<%=data.title%>"></a></div>' +
                '     <%}%>' +
                '<%}%>';

            var html = template(tpl, data);
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
                '        <a class="item" href="javascript:void(0);" data-id=<%=data.id%> data-href="<%=data.linkUrl%>">' +
                '           <span class="e-icon"><img src="<%=data.imgUrl%>" alt="<%=data.title%>"></span>' +
                '           <strong><%=data.title%></strong>' +
                '        </a>' +
                '    <%}%>' +
                '<%}%>';

            var html = template(tpl, data);
            $('.entrance-panel').html(html);
        }
    },
    renderProduct: function (data) {
        if (data && data.product.id > 0) {
            var d = data.product;
            $('.pro-box .pro-rate em').text(d.yieldRate.toFixed(2));
            $('.pro-box .pro-name span').text(d.title);
            $('.pro-box .expires em').text(d.expiresText);
            $('.pro-box .share_text em').text(d.remainingShares.toFixed(0));
            $('.pro-box .btn').attr('data-href', './product/detail.html?id=' + d.id);
        }
    }
}

$(function () {
    fjw.webapp.home.init();
});