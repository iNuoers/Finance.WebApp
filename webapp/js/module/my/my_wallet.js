'use strict'

require('css_path/my/my_wallet.css')

var _api = require('js_path/lib/f.data.js')
var _util = require('js_path/lib/f.utils.js')
var _t = require('plugins/template/template.js')

fjw.webapp.my_wallet = {
    billId: 0,//账单Id
    totalIncome: 0,//本月总收益
    init: function () {
        $('.loading-box').removeClass('f-hide');

        //获取账户资产信息
        this.getWalletAssets();

        //获取我的卡券总数量
        this.getAbleCouponList();

        this.listenEvent();
    },
    getWalletAssets: function () {
        var s = this;
        var param = {
            url: _api.host,
            data: JSON.stringify({
                M: _api.method.getWalletAssets
            }),
            method: 'POST',
            success: getWalletSuccess,
            error: getWalletError
        };
        _util.ajax.request(param);

        function getWalletSuccess(data) {
            data = JSON.parse(data);
            //console.log(data);
            s.totalIncome = parseFloat(data.TotalIncome).toFixed(2);
            $('#totalAccount span').text(parseFloat(data.TotalAccount).toFixed(2));
            $('#yesterdayIncome span').text(parseFloat(data.YesterdayIncome).toFixed(2));
            $('#investProductPrice span').text(parseFloat(data.InvestProductPrice).toFixed(2));
            $('#totalIncome span').text(parseFloat(data.TotalIncome).toFixed(2));

            $('#accountBalance span').text(parseFloat(data.AccountBalance).toFixed(2));
            $('#currentProductPrice span').text(parseFloat(data.CurrentProductPrice).toFixed(2));
            $('#regularProductPrice span').text(parseFloat(data.RegularProductPrice).toFixed(2));

            $('.loading-box').addClass('f-hide');

            //获账单本月充值/提现金额
            s.getTotalBillData();
        }
        function getWalletError(error) {
            //alert(error);
        }

    },
    getAbleCouponList: function () {
        //现金劵
        var param = {
            url: _api.host,
            data: JSON.stringify({
                M: _api.method.getAbleCouponList, 
                D: JSON.stringify({ Type: 1 })
            }),
            method: 'POST',
            success: getAbleCouponSuccess
        };
        _util.ajax.request(param);
        //加息劵
        param = {
            url: _api.host,
            data: JSON.stringify({
                M: _api.method.getAbleCouponList, 
                D: JSON.stringify({ Type: 2 })
            }),
            method: 'POST',
            success: getAbleCouponSuccess2
        };
        _util.ajax.request(param);

        function getAbleCouponSuccess(data) {
            data = JSON.parse(data);
            var num = data['grid'].length;
            $('#coupon1 span').text(num);
        }
        function getAbleCouponSuccess2(data) {
            data = JSON.parse(data);
            var num = data['grid'].length;
            $('#coupon2 span').text(num);
        }
    },
    getTotalBillData: function () {
        var s = this;
        var date = new Date();
        //业务参数
        var Dparam = {
            DateYear: date.getFullYear(),
            DateMonth: date.getMonth() + 1
        };
        var param = {
            url: _api.host,
            data: JSON.stringify({
                M: _api.method.getTotalBillData, 
                D: JSON.stringify(Dparam)
            }),
            method: 'POST',
            success: getTotalBillDataSuccess
        };
        _util.ajax.request(param);
        function getTotalBillDataSuccess(data) {
            data = JSON.parse(data);
            this.billId = data.Id;
            $('.wallet-container2 #billData1 span').text(parseFloat(data.TotalRechargeAmount).toFixed(2));
            $('.wallet-container2 #billData2 span').text(parseFloat(data.TotalWithdrawalAmount).toFixed(2));
            $('.js-bills').attr('data-href', './bills.html?id=' + this.billId + "&totalIncome=" + s.totalIncome);
        }
    },
    listenEvent: function () {
        $(".primary-nav_inner a").removeClass("-current").siblings(".-wallet").addClass("-current");

        //我的投资
        $('#js-myInvest').click(function (e) {
            layer.open({
                content: '体验更多功能，请下载房金网APP'
                , btn: ['立即下载', '稍后下载']
                , yes: function (index) {
                    location.href = "http://www.fangjinnet.com/wx/download/index";
                    layer.close(index);
                }
            });
        })
    }
};
$(function () {
    fjw.webapp.my_wallet.init();
});