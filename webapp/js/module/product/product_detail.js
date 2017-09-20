'use strict'
require('css_path/product/product_detail.css');

var _api = require('js_path/lib/f.data.js')
var _util = require('js_path/lib/f.utils.js')
var _p = require('js_path/service/product-service.js')
var _t = require('plugins/template/template.js')

fjw.webapp.pro_detail = {
    cache: {
        pro_detail: null
    },
    productId : 0,//当前产品ID
    //当前在用卡劵内容
    option: [

    ],
    init: function () {
        this.onLoad();
    },
    onLoad: function () {
        var that = this;

        var id = _util.Tools.getUrlParam('id');
        that.productId = id;
        if (Number(id) > 0){
            that.getDetail(_util.Tools.getUrlParam('id'));

            //得到当前已在用卡劵内容
            that.getCardParam();
        }

    },
    getCardParam : function () {
        var that = this;

        getParam(1);
        getParam(2);
        function getParam(num) {
            var obj = {};
            if(_util.Tools.getUrlParam('cT'+num)){
                obj["cT"] = _util.Tools.getUrlParam('cT'+num);
                obj["cV"] = _util.Tools.getUrlParam('cV'+num);
                obj["cId"] = _util.Tools.getUrlParam('cId'+num);
                that.option.push(obj);
            }
        }
        console.log(that.option);
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
            });
            $('.amountInput').focus();
        });

        //更多卡劵
        $('.other-card').click(function (e) {
            if(that.option.length > 0){
                var d = '';
                for(var i=0;i<that.option.length;i++){
                    var h = '&cT'+i+'=' + that.option[i].cT + '&cId' +i+"=" + that.option[i].cId;
                    d += h;
                }
                window.location.href = '../my/othercard.html?productId=' + that.productId + d;
            }else {
                window.location.href = '../my/othercard.html?productId=' + that.productId;
            }
        })
    },
    renderCurrentCard : function () {
        var that = this;

        var tpl = '<%if(list.length>0) {%>' +
                        '<%for(var i=0;i<list.length;i++) {%>'+
                            '<% var data = list[i];%>' +
                            '<li>'+
                                '<%= data.cT==1 ? "现金劵" : "加息券" %>' +
                                    '<span>'+
                                        '<%= data.cT==1 ? "￥"+data.cV : data.cV + "%" %>'+
                                        '<i class="fa fa-close fa-fw"></i>' +
                                    '</span>' +
                            '</li>'+
                        '<%}%>'+
                  '<%}%>';
        var html = _t(tpl, {list:that.option});
        $('.itemList ul').empty().html(html);
        $('.page-block .item-card').text("");

        //在用卡劵添加点击事件
        $('.itemList ul li i').click(function (e) {
            var $el = $(this).parent().parent();
            //alert($el.index());
            $el.slideUp("slow",function (e) {
                if(that.option.length > 1){
                    that.option.splice($el.index(),1);
                }else {
                    that.option.splice(0,1);
                }
                if(that.option.length == 0) $('.page-block .item-card').text("您有可用卡劵");
            });
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
            M: _api.method.productDetail,
            D: JSON.stringify({
                'ProductId': id
            })
        }), function (json) {
            var data = JSON.parse(json), html = '';
            var tpl = require('../../../view/product/detail.string');

            that.cache.pro_detail = JSON.parse(json);

            //渲染html
            html = _t(tpl, data);

            $('#m-header-nav h1').text(data.Title);
            $('.app-main').html(html);

            that.renderProgress();
            that.listenEvent();
            //渲染当前在用卡券
            if(that.option.length > 0){
                //排序,现金劵在前
                that.option.sort(function(a,b){
                    return a.cT-b.cT
                });
                that.renderCurrentCard();
            }
        }, function () {

        }, function () {
            $(".loading-box").removeClass('f-hide');
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