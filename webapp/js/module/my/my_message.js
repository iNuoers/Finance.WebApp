/*
* @Author: mr.ben（66623978）
* @Date:   2017-09-11 09:12:27
* @Last Modified by:   mr.ben
* @Last Modified time: 2017-09-11 09:12:27
*/

'use strict'
require('css_path/my/my_message.css')
require('plugins/dropload/dropload.css')

var _api = require('js_path/lib/f.data.js')
var _util = require('js_path/lib/f.utils.js')
var _t = require('plugins/template/template.js')
var _d = require('plugins/dropload/dropload.js')

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
        this.listenEvent();
        this.onLoad();
    },
    onLoad: function () {
        var _this = this, idx = _util.Tools.getUrlParam("index") || 0;
        _this.getMessageList();
    },
    listenEvent: function () {
        var _this = this;

        var navContainer = $(".m-message-menu"), item = navContainer.children(".m-menu-item");

        navContainer.on("click", ".m-menu-item", function () {
            var e = $(this), t = e.data("target");
            _this.switchTab(t);
            if (t == 'message') {
                _this.getMessageList();
            } else {
                _this.getNoticeList();
            }
        });

        $('#notice-more').on('click', function () {
            _this.notice.page++;
            _this.getNoticeList();
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
        var _this = this;
        _util.ajax.request({
            url: _api.host,
            data: JSON.stringify({
                M: _api.method.messageList,
                D: JSON.stringify({
                    pageIndex: _this.message.page,
                    pageSize: _this.message.size
                })
            }),
            method: 'POST',
            success: function (json) {
                var data = JSON.parse(json);
                var tpl = '<%if(grid.length>0) {%>' +
                    '    <%for(i = 0; i < grid.length; i ++) {%>' +
                    '        <% var data = grid[i]; %>' +
                    '        <li class="message-item-mine">' +
                    '            <div class="message-item-user">' +
                    '                <img src="../../resource/personal_pic.png">' +
                    '                <cite><%= data.Title%><i><%= data.CreateTimeStr %></i></cite>' +
                    '            </div>' +
                    '            <div class="message-item-text"><%= data.Intro%></div>' +
                    '        </div>' +
                    '     <%}%>' +
                    '<%}%>';

                var html = _t(tpl, data);
                $('.message-list ul').html(html);
            },
            error: function () {

            }
        });
    },
    getNoticeList: function () {
        var _this = this;
        _util.ajax.request({
            url: _api.host,
            data: JSON.stringify({
                M: _api.method.noticeList,
                D: JSON.stringify({
                    pageIndex: _this.notice.page,
                    pageSize: _this.notice.size
                })
            }),
            method: 'POST',
            success: function (json) {
                var data = JSON.parse(json);
                var tpl = '<%if(grid.length>0) {%>' +
                    '    <%for(i = 0; i < grid.length; i ++) {%>' +
                    '        <% var data = grid[i]; %>' +
                    '        <div class="pt15 pb12 ml15 pr15 bb-e6e6e6" data-href="./notice-detail.html?id=<%= data.ID %>" data-content="<%= data.Content %>">' +
                    '            <p class="f15px text-overflow"><%= data.Title %></p>' +
                    '            <p class="c-ababab line-h16 mt3"><%= data.CreateTimeStr %></p>' +
                    '        </div>' +
                    '     <%}%>' +
                    '<%}%>';

                var html = _t(tpl, data);
                $('.notice-list').append(html);

                if (data.total > 1 && data.page < data.total) {
                    $('#notice-more').removeClass('f-hide');
                } else {
                    $('#notice-more').remove();
                }
            },
            error: function () {

            }
        });
    }
};

$(function () {
    fjw.webapp.message.init();
});