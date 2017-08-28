'use strict'
require('../css/product_detail.css')

var _f = require('./lib/app.js')
var _p = require('./service/product-service.js')
var _t = require('../plugins/template/template.js')

fjw.webapp.pro_detail = {
    cache: {
        pro_detail: null
    },
    init: function () {
        this.onLoad();
    },
    onLoad: function () {
        var that = this;

        var id = _f.Tools.getUrlParam('id');
        if (Number(id) > 0)
            that.getDetail(_f.Tools.getUrlParam('id'))
    },
    listenEvent: function () {
        var that = this;

        $('.max-money').click(function () {
            if (!window.user.isLogin) {
                window.location.href = '../login.html?redirect=' + encodeURIComponent(window.location.href);
                return;
            }

            if (!window.user.isAuthen == 1) {
                layer.open({
                    content: '尊敬的用户，您还没有绑卡认证，请先绑卡认证。'
                    , btn: ['立即绑卡', '取消']
                    , yes: function (index) {
                        location.reload();
                        layer.close(index);
                    }
                });
                return
            }

            var shares = Number($('#remainShares').text()),
                maxBuyPrice = Number($('#maxBuyPrice').val());

            if (Number($("#startBuyPrice").val()) > window.user.balance) {
                layer.open({
                    content: '您的余额不足以购买该产品的起投金额'
                    , btn: ['立即充值', '取消']
                    , yes: function (index) {
                        location.reload();
                        layer.close(index);
                    }
                });
                return;
            }


        });
        $('.calculator').click(function () {
            that.calculator();
        });

        $("#price > input").on("input", function () {

            var b = $.trim($(this).val()).replace(/^0+|\D/g, "")
                , c = $(".financeTerm").val();

        });

        $('.close').on('click', function () {
            $(".app-main").removeClass("open-mask"),
                $(".mask").hide(),
                $("#price > input").blur()
        });


        $('.F-buyBtn').click(function () {

            if (!window.user.isLogin) {
                window.location.href = '../login.html?redirect=' + encodeURIComponent(window.location.href);
                return;
            }

            layer.open({
                content: '请输入购买金额'
                , skin: 'msg'
                , time: 2
            })
            $('.amountInput').focus();
        });
    },
    calculator: function () {
        $(".app-main").addClass("open-mask"),
            $(".mask").show(),
            $("#price > input").trigger("input")
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

            that.cache.pro_detail = JSON.parse(json);

            //渲染html
            html = _t(tpl, data);

            $('#m-header-nav h1').text(data.Title);
            $('.app-main').html(html);

            that.renderProgress();
            that.listenEvent();

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