'use strict'

var _api = require('js_path/lib/f.data.js')
var _util = require('js_path/lib/f.utils.js')
var _p = require('js_path/service/product-service.js')

fjw.webapp.protocol = {
    init: function () {
        var tid = _util.Tools.getUrlParam('tid'), pid = _util.Tools.getUrlParam('id'), param = null;

        //非交易时查看 只显示产品名称
        if (tid == 0) {
            _p.getDetail(JSON.stringify({
                M: _api.method.productDetail,
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