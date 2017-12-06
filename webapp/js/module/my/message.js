/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-09-11 09:12:27
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-24 11:22:45
 */

'use strict'
require('css_path/my/message.css')
require('plugins/dropload/dropload.css')

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/wx.core.js')
var apps = require('js_path/lib/wx.apps.js')
var doT = require('plugins/template/template.js')

fjw.webapp.message = {
    notice: {
        page: 1,
        size: 15,
    },
    message: {
        page: 1,
        size: 15
    },
    init: function () {
        this.onPageLoad()
        this.listenEvent()
    },
    onPageLoad: function () {
        var me = this, idx = core.String.getQuery("index") || 0;
        me.method.getMessageList();
    },
    listenEvent: function () {
        var me = this,
            navContainer = $(".m-message-menu"),
            item = navContainer.children(".m-menu-item");

        navContainer.on("click", ".m-menu-item", function () {
            var e = $(this), t = e.data("target");
            me.method.switchTab(t);
            if (t == 'message') {
                me.method.getMessageList();
            } else {
                me.method.getNoticeList();
            }
        });

        $('#notice-more').on('click', function () {
            me.notice.page++;
            me.method.getNoticeList();
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
        switchTab: function (type) {
            var that = this;
            var e = $('.m-menu-item').children('.' + type);
            if (e.is(':visible')) {
                $('.m-menu-item').children('div').removeClass('active');
                e.addClass('active');

                $(".tab-tabs").children('div').addClass('f-hide');
                $(".tab-tabs").children('.' + type).removeClass('f-hide');
            }
        },
        getMessageList: function () {
            var me = fjw.webapp.message;
            me.method.ajax(JSON.stringify({
                M: api.method.messageList,
                D: JSON.stringify({
                    pageIndex: me.message.page,
                    pageSize: me.message.size
                })
            }), function (data) {
                var img = require('../../../image/personal_pic.png')
                var tpl = '<%if(grid.length>0) {%>' +
                    '    <%for(i = 0; i < grid.length; i ++) {%>' +
                    '        <% var data = grid[i]; %>' +
                    '        <li class="message-item-mine">' +
                    '            <div class="message-item-user">' +
                    '                <img src="' + img + '">' +
                    '                <cite><%= data.Title%><i><%= data.CreateTimeStr %></i></cite>' +
                    '            </div>' +
                    '            <div class="message-item-text"><%= data.Intro%></div>' +
                    '        </div>' +
                    '     <%}%>' +
                    '<%}%>';

                var html = doT(tpl, data);
                $('.message-list ul').html(html);
            })
        },
        getNoticeList: function () {
            var me = fjw.webapp.message;
            me.method.ajax(JSON.stringify({
                M: api.method.messageList,
                D: JSON.stringify({
                    pageIndex: me.message.page,
                    pageSize: me.message.size
                })
            }), function (data) {
                var tpl = '<%if(grid.length>0) {%>' +
                    '    <%for(i = 0; i < grid.length; i ++) {%>' +
                    '        <% var data = grid[i]; %>' +
                    '        <div class="pt15 pb12 ml15 pr15 bb-e6e6e6" style="position:relative" data-href="/page/notice-detail.html?id=<%= data.ID %>" data-content="<%= data.Content %>">' +
                    '            <p class="f15px text-overflow"><%= data.Title %></p>' +
                    '            <p class="c-ababab line-h16 mt3 f12px"><%= data.CreateTimeStr %></p><i class="fa fa-angle-right f14px f-fr" style="position:relative;bottom:30px"></i>' +
                    '        </div>' +
                    '     <%}%>' +
                    '<%}%>';

                var html = doT(tpl, data);
                $('.notice-list').append(html);

                if (data.total > 1 && data.page < data.total) {
                    $('#notice-more').removeClass('f-hide');
                } else {
                    $('#notice-more').remove();
                }
            })
        }
    }
};

$(function () {
    fjw.webapp.message.init();
});