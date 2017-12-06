/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-11-08 15:03:47 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-23 14:43:01
 */
'use strict'
require('css_path/help/help.css')

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/wx.core.js')
var apps = require('js_path/lib/wx.apps.js')
var doT = require('plugins/template/template.js')

fjw.webapp.help_detail = {
    query: {
        id: core.String.getQuery('id'),
        tid: core.String.getQuery('tid')
    },
    init: function () {
        this.onPageLoad()
    },
    onPageLoad: function () {
        var me = this;

        if (me.query.id > 0) {
            me.method.getDetail()
        } else {
            location.href = core.Env.domain + core.Env.wwwRoot + '/help/index.html';
        }
    },
    listenEvent: function () {
        var me = this;
        me.method.reply()
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
        getDetail: function () {
            var me = fjw.webapp.help_detail;
            me.method.ajax(JSON.stringify({
                M: api.method.helpCenterList,
                D: JSON.stringify({
                    QId: me.query.id
                })
            }), function (data) {
                if (data.grid.length > 0) {
                    var tit = data.grid[0].QTitle,
                        con = data.grid[0].QContent,
                        list = data.grid[0].QRelations;
                    $('.qa-tit').html(tit), $('.qa-cont').html(con);

                    // 渲染相关问题列表
                    var tpl = '<%if(QRelations.length>0) {%>' +
                        '    <%for(i = 0; i < QRelations.length; i ++) {%>' +
                        '        <% var data = QRelations[i]; %>' +
                        '        <a class="hot-cell" data-help-id="<%=data.QId%>" href="javascript:;" data-href="/help/detail.html?id=<%= data.QId %>">' +
                        '           <div class="hot-cell-bd hot-cell-primary"><%= data.QTitle %></div>' +
                        '           <i class="fa fa-angle-right"></i>' +
                        '        </a>' +
                        '     <%}%>' +
                        '<%}%>';

                    var html = doT(tpl, data.grid[0]);
                    $('.relevant').html(html);

                    // 问题是否解决了
                    me.listenEvent()
                } else {
                    alert('无相关问题')
                }
            })
        },
        reply: function () {
            var me = fjw.webapp.help_detail;
            $('.reply-item').on('click', function () {
                var that = $(this);
                var num = $(this).find('.btn-rate').attr('type');
                var req = {
                    M: api.method.helperSetEffective,
                    D: JSON.stringify({
                        QId: me.query.id,
                        IsEffective: num,
                    })
                }
                that.css("color", "#338fff").siblings().css("color", "black");
                me.method.ajax(JSON.stringify(req), function () {
                    if (num == 1) {
                        that.find('span').html("已解决");
                        that.siblings().off('click');
                    } else {
                        that.find('span').html("未解决");
                        that.siblings().off('click');
                    }
                })
            })
        }
    }
}

$(function () {
    fjw.webapp.help_detail.init()
})