/**
 * Created by PC on 2017/9/13.
 */
require('css_path/product/confirm.css');

var _api = require('js_path/lib/f.data.js')
var _util = require('js_path/lib/f.utils.js')
var _t = require('plugins/template/template.js')
var layer = require('plugins/layer/layer.js');

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
        console.log(that.option);
        that.countBalance = _util.Tools.getUrlParam('amount');
        $('.mySurpluss').text(that.countBalance);

        this.getDetail(that.productId, val);
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
                        window.location.href = '../my/othercard.html?productId=' + that.productId + d + "&isPurch=1&amount=" + that.countBalance;
                    } else {
                        window.location.href = '../my/othercard.html?productId=' + that.productId + "&isPurch=1&amount=" + that.countBalance;
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
    listenEvent: function () {
        var s = this;
        //提交
        $('.p-mian-btn').click(function (e) {
            if (!s.isClick) return;
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
                Share: parseFloat(s.countBalance),
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
                url: _api.host,
                data: JSON.stringify({
                    M: _api.method.buy,
                    D: JSON.stringify(Dparam)
                }),
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
            _util.ajax.request(param);
        })
    }
};

$(function () {
    fjw.webapp.purchasing.init();
});