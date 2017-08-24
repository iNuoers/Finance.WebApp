'use strict';

var _f = require('../lib/app.js');

var _product = {
    getList: function (param, success, error, before, complete) {
        _f.request({
            url: _f.config.serverHost,
            data: param,
            method: 'POST',
            success: success,
            error: error,
            beforeSend: before,
            complete: complete
        });
    },
    getDetail: function (param, success, error, before, complete) {
        _f.request({
            url: _f.config.serverHost,
            data: param,
            method: 'POST',
            success: success,
            error: error,
            beforeSend: before,
            complete: complete
        });
    },
    getBuyRecord: function (param, success, error, before, complete) {
        _f.request({
            url: _f.config.serverHost,
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