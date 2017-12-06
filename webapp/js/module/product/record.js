/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-11-06 16:06:43 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-09 14:29:18
 */
'use strict'

require('css_path/product/recode.css')
require('plugins/dropload/dropload.css')

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/wx.core.js')
var apps = require('js_path/lib/wx.apps.js')
var doT = require('plugins/template/template.js')
var dropload = require('plugins/dropload/dropload.js')

fjw.webapp.product_record = {
    query: {
        page: 1,
        size: 10,
        id: core.String.getQuery('id')
    },
    init: function () {
        this.onLoad()
        this.listenEvent()
    },
    onLoad: function () {
        var that = this
    },
    listenEvent: function () {
        var me = this;
        $('.app-main').dropload({
            scrollArea: window,
            domDown: {
                domClass: 'dropload-down',
                domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
                domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
                domNoData: '<div class="dropload-noData">我是有底线的</div>'
            },
            loadUpFn: function (that) {
                me.query.page = 1
                me.method.getRecord(that)
            },
            loadDownFn: function (that) {
                me.query.page++
                me.method.getRecord(that)
            }
        });
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

        getRecord: function (that) {
            var me = fjw.webapp.product_record;
            me.method.ajax(JSON.stringify({
                M: api.method.productBuyRecord,
                D: JSON.stringify({
                    'ProductId': me.query.id,
                    'pageIndex': me.query.page,
                    'pageSize': me.query.size
                })
            }), function (data) {
                if (data.grid.length > 0) {
                    // 插入数据到页面，放到最后面
                    me.method.renderHtml(data)
                } else {
                    // 锁定
                    that.lock();
                    // 无数据
                    that.noData();
                }
                // 每次数据插入，必须重置
                that.resetload();
            })
        },
        renderHtml: function (data) {
            var html = '', tpl = '<%if(grid.length>0) {%>' +
                '      <% var idx = 0; %>' +
                '      <%for(i = 0; i < grid.length; i ++) {%>' +
                '          <% var data = grid[i]; %>' +
                '          <li class="f-cb bt-e6e6e6">' +
                '              <div class="f-fl">' +
                '                  <p class="c-212121 f17px pt10">' +
                '                      <span><%= data.phone %></span>' +
                '                      <% if(data.CardCoupon != ""){%>' +
                '                          <span class="sub_way"><%= data.CardCoupon %></span>' +
                '                      <%}%>' +
                '                  </p>' +
                '                  <p class="f13px c-d1d1d1 line-h16 mt3">' +
                '                      <i class="ico-inline ico-clock"></i><%= data.buyTime %>' +
                '                  </p>' +
                '              </div>' +
                '              <div class="f-fr f15px c-212121 text-right pt10">' +
                '                  <p class="c-fd6040 f17px"><%= data.amount %></p>' +
                '                  <p class="f13px c-d1d1d1 line-h16 mt5">' +
                '                      <i class="ico-inline ico-<%= data.DeviceType ==1 ? "android" : data.DeviceType ==2 ? "ios" : data.DeviceType == 3 ? "pc" : "weixin"  %>"></i>' +
                '                  </p>' +
                '              </div>' +
                '          </li>' +
                '      <%}%>' +
                '<%}%>';

            //渲染html
            html = doT(tpl, data);

            $('.sub-list ul').append(html);
        }
    }
};

fjw.webapp.product_record.init();