/**
 * Created by PC on 2017/8/24.
 */
require('css_path/my/my_carddetails.css');

var _api = require('js_path/lib/f.data.js');
var _util = require('js_path/lib/f.utils.js');
var _t = require('plugins/template/template.js');

fjw.webapp.carddetails = {
    option: {
        id: -1,
        type: -1,//卡劵类型。1是现金卷，2是加息劵
        cardId: -1,//卡劵id
        cardVal: -1//卡劵面值
    },
    init: function () {
        var s = this;
        $('.loading-box').removeClass('f-hide');

        s.option.id = _util.Tools.getUrlParam('id');
        s.option.type = _util.Tools.getUrlParam('type');
        s.option.cardId = _util.Tools.getUrlParam('cardId');
        //获取卡劵列表
        if (s.option.id && s.option.type) {
            s.getAbleCouponList();
        }
    },
    getAbleCouponList: function () {
        var s = this;
        var param = {
            url: _api.host,
            data: JSON.stringify({
                M: _api.method.getAbleCouponList,
                D: JSON.stringify({ Type: s.option.type })
            }),
            method: 'POST',
            success: s.getAbleCouponSuccess.bind(s)
        };
        _util.ajax.request(param);
    },
    getAbleCouponSuccess: function (data) {
        data = JSON.parse(data);
        //console.log(data);
        this.option.cardVal = data.grid[this.option.id].CouponValue;

        //渲染html
        var tpl = require('../../../view/my/carddetails.string');
        var url1 = require("../../../image/juan-xian.png");
        var url2 = require("../../../image/juan-xi.png");
        html = _t(tpl, { list: data.grid[this.option.id], url1: url1, url2: url2 });
        $('.app-main').html(html);
        $('.loading-box').addClass('f-hide');
        //适用产品
        var param = {
            url: _api.host,
            data: JSON.stringify({
                M: _api.method.productList,
                D: JSON.stringify({
                    TypeId: 2,
                    CardCouponRecordID: this.option.cardId
                })
            }),
            method: 'POST',
            success: this.getProductListSuccess.bind(this)
        };
        _util.ajax.request(param);
    },
    getProductListSuccess: function (data) {
        data = JSON.parse(data);
        //console.log(data);
        //渲染html
        var html = "";
        if (data.grid.length > 0) {
            var tpl = '<%for(var i=0;i<grid.length;i++ ) {%>' +
                '<% var data = grid[i];%>' +
                '<li><a href="../product/detail.html?id=<%= data.Id%>&cT1=<%= cT1 %>&cV1=<%= cV1%>&cId1=<%= cId %>"><%= data.Title%><i class="fa fa-angle-right fa-fw"></i></a></li>' +
                '<%}%>';
            data.cT1 = this.option.type;
            data.cV1 = this.option.cardVal;
            data.cId = this.option.cardId;
            html = _t(tpl, data);
        } else {
            html = '<li>对不起！没有可适用产品</li>'
        }
        $('.other-list ul').empty().html(html);
    }
};

$(function () {
    fjw.webapp.carddetails.init();
});