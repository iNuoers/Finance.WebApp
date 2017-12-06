/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-11-08 15:09:13 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-13 15:39:17
 */
'use strict'
require('css_path/help/help.css')

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/wx.core.js')
var apps = require('js_path/lib/wx.apps.js')
var doT = require('plugins/template/template.js')

fjw.webapp.helpType = {
    init: function () {
        this.onPageLoad()
        this.listenEvent()
    },
    onPageLoad: function () {
        var me = this;
        me.method.getList()
    },
    listenEvent: function () {

    },
    method: {
        ajax: function (data, callback) {
            core.ajax({
                url: core.Env.apiHost,
                data: data,
                type: 'post',
                success: function (data) {
                    callback && callback.call(this, (data != '' && JSON.parse(data)))
                },
                error: function () {
                }
            });
        },
        getList: function () {
            var id = core.String.getQuery('tid')
                , me = fjw.webapp.helpType;
            var param = {
                M: api.method.helpCenterList
            }
            if (id > 0) {
                param.D = JSON.stringify({
                    TypeId: id
                })
            }

            me.method.ajax(JSON.stringify(param), function (data) {
                if ((data.grid.length > 0)) {
                    var tpl = '<%for(i = 0; i < grid.length; i++) {%>' +
                        '      <%var data= grid[i]; %>' +
                        '          <li class="bdr-bottom"><a href="javascript:;" data-href="/help/detail.html?id=<%= data.QId %>"><%= data.QTitle%><span class="fa fa-angle-right"></span></a></li>' +
                        '      <%}%>';

                    var html = doT(tpl, data);
                    $('.type-item').append(html);
                }
            })
        }
    }
}

fjw.webapp.helpType.init()