'use strict';

var _f = require('../lib/app.js');

var _help = {
    /**
     * 
     */
    getHelpType: function(helpInfo, resolve, reject){
        _f.request({
            url     : _f.config.serverHost,
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
        _f.request({
            url     : _f.config.serverHost,
            data    : params,
            method  : 'POST',
            success : success,
            error   : error
        });
    },

    /**
     * 
     */
    helpCenterList: function(helpInfo, resolve, reject){
        _f.request({
            url     : _f.config.serverHost,
            data    : helpInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    },

    /**
     * 
     */
    helpDetail: function(id, resolve, reject){
        _f.request({
            url     : _f.config.serverHost,
            data    : helpInfo,
            method  : 'POST',
            success : resolve,
            error   : reject
        });
    }
}

module.exports = _help;