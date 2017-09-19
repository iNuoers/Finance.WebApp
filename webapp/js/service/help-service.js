'use strict';

var _api = require('js_path/lib/f.data.js');
var _util = require('js_path/lib/f.utils.js');

var _help = {
    /**
     * 
     */
    getHelpType: function(helpInfo, resolve, reject){
        _util.ajax.request({
            url     : _api.host,
            data    : helpInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },

    /**
     * 
     */
    getHot: function(params, success, error){
        _util.ajax.request({
            url     : _api.host,
            data    : params,
            method  : 'POST',
            success : success,
            error   : error
        });
    },

    /**
     * 
     */
    helpCenterList: function(id, resolve, reject){
        _util.ajax.request({
            url     : _api.host,
            data    : JSON.stringify({
                D:JSON.stringify({
                    QId:id
                }),
                M:_api.method.helpCenterList
            }),
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },

    /**
     * 
     */
    helpDetail: function(id, resolve, reject){
        _util.ajax.request({
            url     : _api.host,
            data    : helpInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    }
}

module.exports = _help;