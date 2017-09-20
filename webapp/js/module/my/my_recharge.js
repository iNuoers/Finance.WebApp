/**
 * Created by PC on 2017/8/23.
 */
require('css_path/my/my_recharge.css');

var _api = require('js_path/lib/f.data.js');
var _util = require('js_path/lib/f.utils.js');

fjw.webapp.recharge = {
    param: {
        isRecharge: false
    },
    init: function () {
        var s = this;
        $(".loading-box").removeClass('f-hide');
        var data = {
            M: _api.method.getMemberInfo
        };
        var param = {
            url: _api.host,
            data: JSON.stringify(data),
            method: 'POST',
            success: this.success
        };
        _util.ajax.request(param);

        $('.recharge-btn').click(function (e) {
            console.log(s.param.isRecharge);
            if (!s.param.isRecharge) {
                var val = $.trim($('#money-input').val());
                if (val > 0) {
                    s.param.isRecharge = true;

                    var data = {
                        M: _api.method.recharge,
                        D: JSON.stringify({ RechargeAmount: val })
                    };
                    var param = {
                        url: _api.host,
                        data: JSON.stringify(data),
                        method: 'POST',
                        success: s.rechargeSuccess,
                        error: s.rechargeError
                    };
                    _util.ajax.request(param);
                }
            }
        })
    },
    success: function (data) {
        data = JSON.parse(data);

        $('.recharge-bank .bank-bg').css('background-image', 'url(' + data.bankIcon + ')').siblings('.bankNum').text(data.bankCardId);
        $('.recharge-bank .bank-cah #singlePrice span').text(data.singlePrice)
        $('.recharge-bank .bank-cah #dayPrice span').text(data.dayPrice);

        $('.loading-box').addClass('f-hide');
    },
    rechargeSuccess: function (data) {
        data = JSON.parse(data);
        //console.log(data);
        layer.open({
            content: '充值成功！'
            , skin: 'msg'
            , time: 2
        });
        fjw.webapp.recharge.param.isRecharge = false;
    },
    rechargeError: function (errorMsg) {
        layer.open({
            content: '充值失败，请稍后再试!'
            , skin: 'msg'
            , time: 2
        });
        fjw.webapp.recharge.param.isRecharge = false;
    }
};

$(function () {
    fjw.webapp.recharge.init();
});