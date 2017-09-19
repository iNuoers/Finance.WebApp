'use strict';

var _util = require('js_path/lib/f.utils.js')
var _api = require('js_path/lib/f.data.js')

var _product = {
    getList: function (param, success, error, before, complete) {
        _util.ajax.request({
            url: _api.host,
            data: param,
            method: 'POST',
            success: success,
            error: error,
            beforeSend: before,
            complete: complete
        });
    },
    getDetail: function (param, success, error, before, complete) {
        _util.ajax.request({
            url: _api.host,
            data: param,
            method: 'POST',
            success: success,
            error: error,
            beforeSend: before,
            complete: complete
        });
    },
    getBuyRecord: function (param, success, error, before, complete) {
        _util.ajax.request({
            url: _api.host,
            data: param,
            method: 'POST',
            success: success,
            error: error,
            beforeSend: before,
            complete: complete
        });
    }
};
module.exports = _product;