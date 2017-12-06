/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-11-06 15:11:25 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-06 15:16:05
 */
'use strict'

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/wx.core.js')
var apps = require('js_path/lib/wx.apps.js')

fjw.webapp.protocol = {
    query: {
        id: core.String.getQuery('id')
    },
    init: function () {
        this.onPageLoad()
    },
    onPageLoad: function () {

        var me = this;
        if (Number(me.query.id) > 0) {
            me.method.getDetail()
        } else {
            window.location.href = core.Env.domain + core.Env.wwwRoot + '/product/list.html';
        }

    },
    method: {
        ajax: function (data, callback) {
            core.ajax({
                url: core.Env.apiHost,
                data: data,
                type: 'post',
                success: function (data) {
                    callback && callback.call(this, JSON.parse(data))
                },
                error: function () {

                }
            });
        },
        getDetail: function () {
            var me = fjw.webapp.protocol;

            var param = {
                M: api.method.productDetail,
                D: JSON.stringify({
                    'ProductId': me.query.id
                })
            };

            me.method.ajax(JSON.stringify(param), function (data) {
                $("span[att-data='rate']").text(data.IncomeRate.toFixed(2));
                $("span[att-data='product']").text(data.Title);
            })
        }
    }
}
$(function () {
    fjw.webapp.protocol.init();
})