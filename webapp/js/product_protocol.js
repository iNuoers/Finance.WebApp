'use strict'

var _f = require('./lib/app.js')
var _p = require('./service/product-service.js')

fjw.webapp.protocol = {
    init: function () {
        var tid = _f.Tools.getUrlParam('tid'), pid = _f.Tools.getUrlParam('id'), param = null;

        //非交易时查看 只显示产品名称
        if (tid == 0) {
            _p.getDetail(JSON.stringify({
                M: _f.config.apiMethod.productDetail,
                D: JSON.stringify({
                    'ProductId': pid
                })
            }), function (res) {
                var data = JSON.parse(res);
                $("span[att-data='rate']").text(data.IncomeRate.toFixed(2));
                $("span[att-data='product']").text(data.Title);
            });
        } else {

        }
    }
}
$(function () {
    fjw.webapp.protocol.init();
})