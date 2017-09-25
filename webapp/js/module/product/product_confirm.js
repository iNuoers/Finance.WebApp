/**
 * Created by PC on 2017/9/13.
 */
require('css_path/product/product_confirm.css');

var _api = require('js_path/lib/f.data.js')
var _util = require('js_path/lib/f.utils.js')
var _p = require('js_path/service/product-service.js')
var _t = require('plugins/template/template.js')

fjw.webapp.purchasing = {
    isClick: true,
    countBalance: 0,
    remainingShares: 0,
    option: [],
    productId: 0,
    init: function () {
        var that = this;
        $(".loading-box").removeClass('f-hide');
        that.productId = _util.Tools.getUrlParam('id');
        var val = _util.Tools.getUrlParam('val');
        getParam(1);
        getParam(2);
        function getParam(num) {
            var obj = {};
            if (_util.Tools.getUrlParam('cT' + num)) {
                obj["cT"] = _util.Tools.getUrlParam('cT' + num);
                obj["cV"] = _util.Tools.getUrlParam('cV' + num);
                obj["cId"] = _util.Tools.getUrlParam('cId' + num);
                that.option.push(obj);
            }
        }
        this.getDetail(that.productId, val);
        //获取账户资产信息
        this.getWalletAssets();
        this.listenEvent();
    },
    getDetail: function (id, val) {
        var that = this;

        _p.getDetail(JSON.stringify({
            M: _api.method.productDetail,
            D: JSON.stringify({
                'ProductId': id
            })
        }), function (data) {
            data = JSON.parse(data);
            //console.log(data);
            $('#val').text(data.Title);
            $('#rate').text(data.IncomeRate + '%');
            $('#limit').text(data.TimeLimit);
            $('#way').text(data.IncomeDescript);
            that.remainingShares = data.RemainingShares;
            $('.surpluss').text(that.remainingShares);
            if (val > 0) $('#balanceInput').val(val);

            if (data.IsPlusInCome == 1 && data.IsCash == 1) {
                //排序,现金劵在前
                that.option.sort(function (a, b) {
                    return a.cT - b.cT
                });
                if (that.option.length > 0) {
                    var tpl = '<%if(list.length>0) {%>' +
                        '<%for(var i=0;i<list.length;i++) {%>' +
                        '<% var data = list[i];%>' +
                        '<li>' +
                        '<%= data.cT==1 ? "现金劵" : "加息券" %>' +
                        '<span>' +
                        '<%= data.cT==1 ? "￥"+data.cV : data.cV + "%" %>' +
                        '<i class="fa fa-close fa-fw"></i>' +
                        '</span>' +
                        '</li>' +
                        '<%}%>' +
                        '<%}%>';
                    var html = _t(tpl, { list: that.option });
                    $('.itemList ul').empty().html(html);
                    $('.juanVal').text("");
                } else {
                    $('.juanVal').text("您有可用卡劵");
                }
                //在用卡劵添加点击事件
                $('.itemList ul li i').click(function (e) {
                    var $el = $(this).parent().parent();
                    //alert($el.index());
                    $el.slideUp("slow", function (e) {
                        if (that.option.length > 1) {
                            that.option.splice($el.index(), 1);
                        } else {
                            that.option.splice(0, 1);
                        }
                        if (that.option.length == 0) $('.juanVal').text("您有可用卡劵");
                    });
                });
                //更多卡劵
                $('.kajuan').click(function (e) {
                    //sconsole.log(that.option);
                    //var v = $('#balanceInput').val();
                    var v = 0;
                    if (that.option.length > 0) {
                        var d = '';
                        for (var i = 0; i < that.option.length; i++) {
                            var h = '&cT' + i + '=' + that.option[i].cT + '&cId' + i + "=" + that.option[i].cId;
                            d += h;
                        }
                        window.location.href = '../my/othercard.html?productId=' + that.productId + d + "&isPurch=1&val=" + v;
                    } else {
                        window.location.href = '../my/othercard.html?productId=' + that.productId + "&isPurch=1&val=" + v;
                    }
                })
            } else {
                $('.kajuan span').text('您还没有可用卡劵');
            }

        }, function () {

        }, function () {
            $(".loading-box").removeClass('f-hide');
        }, function () {
            $(".loading-box").addClass('f-hide')
        });
    },
    getWalletAssets: function () {
        var s = this;
        var param = {
            url: _api.host,
            data: JSON.stringify({ M: _api.method.getWalletAssets }),
            method: 'POST',
            success: getWalletSuccess,
            error: getWalletError
        };
        _util.ajax.request(param);

        function getWalletSuccess(data) {
            data = JSON.parse(data);
            //console.log(data);
            s.countBalance = parseFloat(data.AccountBalance).toFixed(2);
            $('.mySurpluss').text(s.countBalance + "元");
        }
        function getWalletError(error) {
            //alert(error);
        }
    },
    listenEvent: function () {
        var s = this;

        //全部买入
        $('.surplusBtn').click(function (e) {
            if (s.countBalance > 0) {
                var count = parseInt(s.countBalance);
                if (s.remainingShares == 0) {
                    //当前可投金额为0
                    layer.open({
                        content: '当前可投金额不足'
                        , skin: 'msg'
                        , time: 2
                    });
                } else {
                    if (count > s.remainingShares) count = s.remainingShares;
                    var otherCount = (s.countBalance - count).toFixed(2);
                    $('#balanceInput').val(count);
                    $('.mySurpluss').text(otherCount + "元");
                }
            }
        });
        //充值
        $('.myRecharge').click(function (e) {
            window.location.href = '../my/recharge.html';
        });
        //提交
        $('.p-mian-btn').click(function (e) {
            if (!s.isClick) return;
            var balance = parseInt($('#balanceInput').val());
            if (balance <= 0 || isNaN(balance)) {
                layer.open({
                    content: '请输入金额'
                    , skin: 'msg'
                    , time: 2
                });
                return;
            }
            if (balance > s.remainingShares) {
                layer.open({
                    content: '超过最大可投金额'
                    , skin: 'msg'
                    , time: 2
                });
                return;
            }
            if (balance > s.countBalance) {
                layer.open({
                    content: '您的余额不足'
                    , skin: 'msg'
                    , time: 2
                });
                return;
            }
            if (balance % 100 != 0) {
                layer.open({
                    content: '金额必须是100的倍数'
                    , skin: 'msg'
                    , time: 2
                });
                return
            }
            if ($.trim($('#passWord').val()) == "") {
                layer.open({
                    content: '请输入交易密码'
                    , skin: 'msg'
                    , time: 2
                });
                return;
            }
            //可以提交
            s.isClick = false;
            $(".loading-box").removeClass('f-hide');
            var Dparam = {
                ProductId: s.productId,
                Share: balance,
                TradingPassword: $.trim($('#passWord').val())

            };
            if (s.option.length) {
                for (var i = 0, len = s.option.length; i < len; i++) {
                    //现金劵
                    if (s.option[i].cT == 1) {
                        Dparam.CashId = s.option[i].cId;
                    }
                    //加息劵
                    else {
                        Dparam.IncomeId = s.option[i].cId;
                    }
                }
            }
            //console.log(Dparam);
            var param = {
                url: _util.config.serverHost,
                data: JSON.stringify({ M: _util.config.apiMethod.buy, D: JSON.stringify(Dparam) }),
                method: 'POST',
                success: function (data) {
                    data = JSON.parse(data);
                    //console.log(data);
                    layer.open({
                        content: '提交成功'
                        , skin: 'msg'
                        , time: 2
                    });
                    $(".loading-box").addClass('f-hide');
                    s.isClick = true;
                },
                error: function (errMsg) {
                    console.log(errMsg);
                    layer.open({
                        content: errMsg
                        , skin: 'msg'
                        , time: 2
                    });
                    $(".loading-box").addClass('f-hide');
                    s.isClick = true;
                }
            };
            _util.request(param);
        })
    }
};

$(function () {
    fjw.webapp.purchasing.init();
});