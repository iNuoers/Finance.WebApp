'use strict'
require('../css/product_detail.css')

var _f = require('./lib/app.js')
var _p = require('./service/product-service.js')
var _t = require('../plugins/template/template.js')

fjw.webapp.pro_detail = {
    init: function () {
        this.onLoad();
        this.listenEvent();

    },
    onLoad: function () {
        var that = this;

        var id = _f.Tools.getUrlParam('id');
        if (Number(id) > 0)
            that.getDetail(_f.Tools.getUrlParam('id'))
    },
    listenEvent: function () {

    },
    getDetail: function (id) {
        var that = this;

        _p.getDetail(JSON.stringify({
            M: _f.config.apiMethod.productDetail,
            D: JSON.stringify({
                'ProductId': id
            })
        }), function (json) {
            var data = JSON.parse(json), html = '';
            var tpl = require('../view/product/detail.string');
            //渲染html
            html = _t(tpl, data);

            $('#m-header-nav h1').text(data.Title);

            $('.app-main').html(html);
            
            that.renderProgress();

        }, function () {

        }, function () {
            $(".loading-box").removeClass('f-hide')
        }, function () {
            $(".loading-box").addClass('f-hide')
        });
    },
    renderProgress: function () {
        var that = this;
        var bar = $("#J_progressBar")
            , progress = progress || bar.data("progress")
            , on = $("#J_progressBar .progress-on")
            , val = $("#J_progressBar .progress-val")
            , em = $("#J_progressBar .progress-val em")
            , width = progress || 0;

        on.css("width", width + "%"),
            val.css("left", width + "%"),
            em.text(progress);

        if (progress < 8) {
            bar.toggleClass("beginning")
        } else if (progress > 93) {
            bar.toggleClass("ending")
        } else {
            bar.removeClass("beginning ending")
        }
    }
}

$(function () {
    fjw.webapp.pro_detail.init();
})