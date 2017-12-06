/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-11-02 16:51:30 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-28 10:46:14
 */
'use strict'

require('css_path/wallet/index.css')

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/wx.core.js')
var apps = require('js_path/lib/wx.apps.js')
var layer = require('plugins/layer/layer.js')
var doT = require('plugins/template/template.js')

fjw.webapp.my_wallet = {
    init: function () {
        this.onPageLoad()
        this.listenEvent()
    },
    onPageLoad: function () {
        var me = this;
        core.User.requireLogin(function(){
            me.method.getAssets()
        })
    },
    listenEvent: function () {
        var me = this;
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
        $(".bottomMenu div").removeClass("-current").siblings(".wallet_m").addClass("-current");
    },
    method: {
        ajax: function (data, callback) {
            core.ajax({
                url: core.Env.apiHost,
                data: data,
                type: 'post',
                beforeSend: function () {
                    $('.loading-box').removeClass('f-hide');
                },
                success: function (data) {
                    callback && callback.call(this, JSON.parse(data))
                },
                complete: function () {
                    $('.loading-box').addClass('f-hide');
                },
                error: function () { }
            });
        },
        getAssets: function () {
            var me = fjw.webapp.my_wallet;

            me.method.ajax(JSON.stringify({
                M: api.method.getWalletAssets
            }), function (data) {
                
                $('#totalIncome span').text(parseFloat(data.TotalIncome).toFixed(2));
                $('#totalAccount span').text(parseFloat(data.TotalAssets).toFixed(2));
                $('#accountBalance span').text(parseFloat(data.AccountBalance).toFixed(2));
                $('#yesterdayIncome span').text(parseFloat(data.YesterdayIncome).toFixed(2));
                $('#investProductPrice span').text(parseFloat(data.EffectiveAssets).toFixed(2));

                $('#anyTimeShare').text(parseFloat(data.AnyTimeShare).toFixed(2))
                $('#fixedTimeShare').text(parseFloat(data.FixedTimeShare).toFixed(2))

                $('#cashCouponCount').text(parseInt(data.CashCouponCount));
                $('#rateCounponCount').text(parseInt(data.RateCounponCount));

                $('#rechargeAmount').text(parseFloat(data.RechargeAmount).toFixed(2))
                $('#withdrawAmount').text(parseFloat(data.WithdrawAmount).toFixed(2))
            })
        }
    }
};
$(function () {
    fjw.webapp.my_wallet.init();
});