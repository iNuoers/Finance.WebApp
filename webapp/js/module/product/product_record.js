'use strict'

require('css_path/product/product_recode.css')
require('plugins/dropload/dropload.css')

var _api = require('js_path/lib/f.data.js')
var _util = require('js_path/lib/f.utils.js')
var _p = require('js_path/service/product-service.js')
var _d = require('plugins/dropload/dropload.js')
var _t = require('plugins/template/template.js')

fjw.webapp.product_record = {
    init: function () {
        
    },
    onLoad: function () {
        var that = this, id = _util.Tools.getUrlParam('id');
    },
    renderRecord: function (data) {
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
        html = _t(tpl, data);

        $('.sub-list ul').append(html);
    }
};

$(function () {

    fjw.webapp.product_record.init();

    // 页数
    var page = 0;
    // 每页展示5个
    var size = 15;

    // dropload
    $('.app-main').dropload({
        scrollArea:window,
        domDown: {
            domClass: 'dropload-down',
            domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
            domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            domNoData: '<div class="dropload-noData">我是有底线的</div>'
        },
        loadUpFn: function (me) {
            page = 1;
            var that = this, id = _util.Tools.getUrlParam('id');

            _p.getBuyRecord(JSON.stringify({
                M: _api.method.productBuyRecord,
                D: JSON.stringify({
                    'ProductId': id,
                    'pageIndex': page,
                    'pageSize': size
                })
            }), function (json) {
                var data = JSON.parse(json);
                if (data.grid.length > 0) {
                    $('.sub-list ul').html('');
                    // 插入数据到页面，放到最后面
                    fjw.webapp.product_record.renderRecord(data);

                } else {
                    // 锁定
                    me.lock();
                    // 无数据
                    me.noData();
                }
                // 每次数据插入，必须重置
                me.resetload();
            }, function () {
                alert('Ajax error!');
                // 即使加载出错，也得重置
                me.resetload();
            });
        },
        loadDownFn: function (me) {
            page++;
            var that = this, id = _util.Tools.getUrlParam('id');

            _p.getBuyRecord(JSON.stringify({
                M: _api.method.productBuyRecord,
                D: JSON.stringify({
                    'ProductId': id,
                    'pageIndex': page,
                    'pageSize': size
                })
            }), function (json) {
                var data = JSON.parse(json);
                if (data.grid.length > 0) {
                    // 插入数据到页面，放到最后面
                    fjw.webapp.product_record.renderRecord(data);

                } else {
                    // 锁定
                    me.lock();
                    // 无数据
                    me.noData();
                }
                // 每次数据插入，必须重置
                me.resetload();
            }, function () {
                alert('Ajax error!');
                // 即使加载出错，也得重置
                me.resetload();
            });
        }
    });
});