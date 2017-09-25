/*
* @Author: mr_肖先生（66623978）
* @Date:   2017-09-12 14:55:42
* @Last Modified by:   mr_肖先生（66623978）
* @Last Modified time: 2017-09-12 14:55:42
*/
'use strict'

require('css_path/page/activity.css')
require('plugins/dropload/dropload.css')

var _api = require('js_path/lib/f.data.js')
var _util = require('js_path/lib/f.utils.js')
var _d = require('plugins/dropload/dropload.js')
var _t = require('plugins/template/template.js')

fjw.webapp.activity = {
    param: {
        page: 0,
        size: 15
    },
    init: function () {
        this.onLoad();
    },
    onLoad: function () {
        var that = this;
        // dropload
        $('.app-main').dropload({
            scrollArea: window,
            domDown: {
                domClass: 'dropload-down',
                domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
                domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
                domNoData: '<div class="dropload-noData">我是有底线的</div>'
            },
            loadUpFn: function (me) {
                that.param.page = 1;

                $('.act-list').html('');
                that.getList(me);
            },
            loadDownFn: function (me) {
                that.param.page++;
                that.getList(me);
            }
        });
    },
    getList: function (me) {
        var that = this;

        _util.ajax.request({
            url: _api.host,
            data: JSON.stringify({
                M: _api.method.activityList,
                D: JSON.stringify({
                    PageIndex: that.param.page,
                    PageSize: that.param.size
                })
            }),
            method: 'post',
            success: function (json) {
                var data = JSON.parse(json), imgs = new Array();

                if (data.grid.length > 0) {
                    for (var i = 0; i < data.grid.length; i++) {
                        if (data.grid[i].IsEnd == false) {
                            imgs.push(data.grid[i].EndImageUrl)
                        } else {
                            imgs.push(data.grid[i].ImageUrl)
                        }
                    }
                    // 插入数据到页面，放到最后面
                    fjw.webapp.activity.renderTpl(data);
                } else {
                    // 锁定
                    me.lock();
                    // 无数据
                    me.noData();
                }
                // 每次数据插入，必须重置
                me.resetload();
            },
            error: function () {
                alert('Ajax error!');
                // 即使加载出错，也得重置
                me.resetload();
            }
        });
    },
    renderTpl: function (data) {
        var html = '', tpl = '<%if(grid.length>0) {%>' +
            '      <% var idx = 0; %>' +
            '      <%for(i = 0; i < grid.length; i ++) {%>' +
            '          <% var data = grid[i]; %>' +
            '              <div class="mb10 act-item">' +
            '                  <a href="javascript:;" data-href="<%= data.LinkUrl%>">' +
            '                      <div class="item-title pb10">' +
            '                          <div class="f-fl c-333333"><%= data.Title %></div>' +
            '                          <div class="f-fr c-999999">结束时间:<%= data.EndShowTimeText %></div>' +
            '                      </div>' +
            '                      <div class="item-img">' +
            '                          <img src="<%= data.IsEnd==false ? data.EndImageUrl : data.ImageUrl %>" alt="<%= data.Title %>">' +
            '                      </div>' +
            '                   </a>' +
            '              </div>' +
            '      <%}%>' +
            '<%}%>';

        //渲染html
        html = _t(tpl, data);

        $('.act-list').append(html);
    }
}

$(function () {
    fjw.webapp.activity.init();
});