/**
 * Created by PC on 2017/8/30.
 */

require('css_path/wallet/othercard.css');

var _api = require('js_path/lib/f.data.js');
var _util = require('js_path/lib/f.utils.js');
var _t = require('plugins/template/template.js');
var layer = require('plugins/layer/layer.js');

fjw.webapp.otherCard = {
    productId: 0,//当前产品ID
    isPurch:false,
    countBalance:0,
    option: [],
    init: function () {
        var that = this;

        $(".loading-box").removeClass('f-hide');
        that.productId = _util.Tools.getUrlParam('productId');
        that.countBalance = _util.Tools.getUrlParam('amount');
        if(_util.Tools.getUrlParam('isPurch')){
            that.isPurch = true;
        }

        //获取浏览器卡劵参数信息
        for (var i = 0; i < 2; i++) {
            if (_util.Tools.getUrlParam('cT' + i)) {
                var obj = {};
                obj['cT'] = _util.Tools.getUrlParam('cT' + i);
                obj['cId'] = _util.Tools.getUrlParam('cId' + i);
                that.option.push(obj);
            }
        }
        //排序,现金劵在前
        if (that.option.length > 0) {
            that.option.sort(function (a, b) {
                return a.cT - b.cT
            });
        }
        //console.log(that.option);

        //得到当前产品可用卡劵
        var param = {
            url: _api.host,
            data: JSON.stringify({
                M: _api.method.productCouponList,
                D: JSON.stringify({ ProductId: that.productId })
            }),
            method: 'POST',
            success: this.getProductCouponList.bind(that)
        };
        _util.ajax.request(param);

        //添加事件
        that.listenEvent();
    },
    getProductCouponList: function (data) {
        var that = this;
        data = JSON.parse(data);
        console.log(data);
        //现金券
        if (data.CashCoupons) {
            if (data.CashCoupons.length > 0) {
                var cashData = data.CashCoupons;
                cashData.sort(function (a, b) {
                    return a.CouponValue - b.CouponValue
                });

                //渲染html
                var tpl = '<%if(cashList.length > 0) {%>' +
                    '<% for(var i=0;i<cashList.length;i++) {%>' +
                    '<% var data=cashList[i];%>' +
                    '<li>' +
                    '<input <%= data.Id==option.cId ? "checked " : ""%>name="cash" type="radio" value="<%= data.CouponValue %>" data-id="<%= data.Id %>" data-type="<%= data.CouponType %>"/>' +
                    '<span class="listValue">￥<%= parseFloat(data.CouponValue).toFixed(1) %></span>' +
                    '<span class="listPrice">满<%=data.MinBuyPrice%>元可用</span>' +
                    '<span class="listTime"><%=data.UseEndTime.split("T")[0]%>到期</span>' +
                    '</li>' +
                    '<%}%>' +
                    '<%}%>';
                var html;
                if (that.option.length > 0) {
                    //console.log(that.option);
                    var b = true;
                    for (var i = 0; i < that.option.length; i++) {
                        if (that.option[i].cT == 1) {
                            b = false;
                            html = _t(tpl, { cashList: cashData, option: that.option[i] });
                            break;
                        }
                    }
                    if (b) html = _t(tpl, { cashList: cashData, option: {} });
                } else {
                    html = _t(tpl, { cashList: cashData, option: {} });
                }
                $('.list-t1 ul').empty().html(html);
                $($('.other-item')[0]).show();
            }
        }
        //加息券
        if (data.PlusIncomeCoupons) {
            if (data.PlusIncomeCoupons.length > 0) {
                var plusData = data.PlusIncomeCoupons;
                plusData.sort(function (a, b) {
                    return a.CouponValue - b.CouponValue
                });

                //渲染html
                var tpl = '<%if(plusList.length > 0) {%>' +
                    '<% for(var i=0;i<plusList.length;i++) {%>' +
                    '<% var data=plusList[i];%>' +
                    '<li>' +
                    '<input <%= data.Id==option.cId ? "checked " : ""%>name="rates" type="radio" value="<%= data.CouponValue %>" data-id="<%= data.Id %>" data-type="<%= data.CouponType %>"/>' +
                    '<span class="listValue"><%=parseFloat(data.CouponValue).toFixed(1)%>%</span>' +
                    '<span class="listPrice">满<%=data.MinBuyPrice%>元可用</span>' +
                    '<span class="listTime"><%=data.UseEndTime.split("T")[0]%>到期</span>' +
                    '</li>' +
                    '<%}%>' +
                    '<%}%>';
                var html;
                if (that.option.length > 0) {
                    b = true;
                    for (i = 0; i < that.option.length; i++) {
                        if (that.option[i].cT == 2) {
                            b = false;
                            html = _t(tpl, { plusList: plusData, option: that.option[i] });
                            break;
                        }
                    }
                    if (b) html = _t(tpl, { plusList: plusData, option: {} });
                } else {
                    html = _t(tpl, { plusList: plusData, option: {} });
                }
                $('.list-t2 ul').empty().html(html);
                $($('.other-item')[1]).show();
            }
        }
        $(".loading-box").addClass('f-hide');
    },
    listenEvent: function () {
        var that = this;
        var isRotate1 = true, isRotate2 = true;
        $('.item-t1 i').click(function (e) {
            if (isRotate1) {
                isRotate1 = false;
                $('.other-item .list-t1').slideUp("slow");
                $(this).removeClass('move90').addClass('move0');
            } else {
                isRotate1 = true;
                $('.other-item .list-t1').slideDown("slow");
                $(this).removeClass('move0').addClass('move90');
            }
        });
        $('.item-t2 i').click(function (e) {
            if (isRotate2) {
                isRotate2 = false;
                $('.other-item .list-t2').slideUp("slow");
                $(this).removeClass('move90').addClass('move0');
            } else {
                isRotate2 = true;
                $('.other-item .list-t2').slideDown("slow");
                $(this).removeClass('move0').addClass('move90');
            }
        });
        //确认事件
        $('.other-btn').click(function (e) {
            var option = [];
            $('.item-list input[type=radio]').each(function (index) {
                if ($(this).is(':checked')) {
                    option.push({ value: $(this).val(), id: $(this).data('id'), type: $(this).data('type') });
                }
            });
            if (option.length == 0) {
                layer.open({
                    content: '请选择优惠券！'
                    , skin: 'msg'
                    , time: 2
                });
            } else {
                var hash = "?id=" + that.productId;
                for (var i = 1; i <= option.length; i++) {
                    var h = '&cT' + i + '=' + option[i - 1].type + '&cId' + i + "=" + option[i - 1].id + "&cV" + i + "=" + option[i - 1].value;
                    hash += h;
                }
                if(that.isPurch){
                    window.location.href = '../product/confirm.html' + hash + '&amount=' + that.countBalance;
                }else {
                    window.location.href = '../product/detail.html' + hash;
                }
            }
        })
    }
};
$(function () {
    fjw.webapp.otherCard.init();
});