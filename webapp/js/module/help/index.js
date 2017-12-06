/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-11-08 14:48:30 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-13 16:23:15
 */
'use strict'
require('css_path/help/help.css')

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/wx.core.js')
var apps = require('js_path/lib/wx.apps.js')
var doT = require('plugins/template/template.js')

fjw.webapp.help = {
    init: function () {
        this.onLoad();
        this.listenEvent();
    },
    onLoad: function () {
        var me = this;
        me.method.hotData()
        me.method.typeData()
    },
    listenEvent: function () {
        var me = this;

        $('#SearchText').on('click', function () {
            window.location.href = core.Env.domain + core.Env.wwwRoot + '/help/search.html';
        });
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
        typeData: function () {
            var me = fjw.webapp.help

            me.method.ajax(JSON.stringify({
                M: api.method.getHelpType
            }), function (data) {
                if (!!data && data.HelpTypeList.length > 0) {
                    data.HelpTypeList.forEach(function (data) {
                        if (!data.LinkUrl) {
                            data.url = "type.html?tid=" + data.Id;
                        } else {
                            data.url = data.LinkUrl;
                        }
                        data.img = data.ImgUrl.replace('http://static.fangjinnet.com', 'https://oivqpsaoi.qnssl.com');
                    }, this);
                }

                var tpl = '<%if(HelpTypeList.length>0) {%>' +
                    '    <%for(i = 0; i < HelpTypeList.length; i ++) {%>' +
                    '        <% var data = HelpTypeList[i]; %>' +
                    '        <li><div class="li-inner"><a href="<%=data.url%>"><img src="<%=data.img%>" ><%=data.Title%></a></div></li>' +
                    '     <%}%>' +
                    '<%}%>';

                var html = doT(tpl, data);
                $('.type-ul').html(html);
            })
        },
        hotData: function () {
            var me = fjw.webapp.help
            me.method.ajax(JSON.stringify({
                M: api.method.helpCenterList
            }), function (data) {
                var tpl = '<div class="help-hot-list">' +
                    '    <%if(grid.length>0) {%>' +
                    '        <%for(i = 0; i < grid.length; i ++) {%>' +
                    '            <% var data = grid[i]; %>' +
                    '            <a class="hot-cell" data-help-id="<%=data.QId%>" href="./detail.html?id=<%=data.QId%>&tid=<%=data.TypeId%>">' +
                    '               <div class="hot-cell-bd hot-cell-primary"><%=data.QTitle%></div>' +
                    '               <i class="fa fa-angle-right fa-fw"></i>' +
                    '            </a>' +
                    '        <%}%>' +
                    '    <%}else{%>' +
                    '        <p class="err-tip">' +
                    '            <span>空空如也，</span>' +
                    '        </p>' +
                    '    <%}%>' +
                    '</div>';

                var html = doT(tpl, data);
                $('.hot-cells').html(html);
            })
        }
    }
}

$(function () {
    fjw.webapp.help.init();
})