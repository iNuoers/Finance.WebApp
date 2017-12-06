/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-11-09 14:36:31 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-29 17:47:30
 */
'use strict'
require('css_path/wallet/bills.css')
require('plugins/dropload/dropload.css')

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/wx.core.js')
var apps = require('js_path/lib/wx.apps.js')
var doT = require('plugins/template/template.js')
var dropload = require('plugins/dropload/dropload.js')

fjw.webapp.bills = {
    query: {
        billId: 0,
        typeId: core.String.getQuery('id'),
        page: 0,
        size: 15
    },
    drop: null,
    init: function () {
        this.onPageLoad()
        this.listenEvent()
    },
    onPageLoad: function () {
        var me = this;

        core.User.requireLogin(function () {
            me.method.getTypeList()
            me.method.totalBill()            
        })
    },
    listenEvent: function () {
        var me = this;
    },
    method: {
        ajax: function (data, callback) {
            core.ajax({
                url: core.Env.apiHost,
                data: data,
                type: 'post',
                beforeSend: function () {
                },
                success: function (data) {
                    callback && callback.call(this, JSON.parse(data))
                },
                complete: function () {
                },
                error: function () { }
            });
        },
        getTypeList: function () {
            var me = fjw.webapp.bills;
            me.method.ajax(JSON.stringify({
                M: api.method.getBillTypeList
            }), function (data) {
                var tpl = '<% if(grid.length > 0){ %>' +
                    '      <% for(var i=0;i<grid.length;i++){ %>' +
                    '          <% var data=grid[i]; %>' +
                    '          <li class="<%= i==0 ? "cur": "" %>" data-id="<%= data.BillType %>"><%= data.BillTypeStr %></li>' +
                    '   <%}%>' +
                    '<%}%>';

                var html = doT(tpl, data);
                $('.bill-item').html(html).css('width', 80 * data.grid.length - 20);
                $('.bill-item li').on('click', function () {
                    $(".bill-item li").removeClass("cur")
                    $(this).addClass('cur')
                    $('.tradingRecord-list').empty()
                    me.query.typeId = $(this).data('id')
                    me.method.getList(me.drop)
                });
            })
        },
        totalBill: function () {
            var me = fjw.webapp.bills;
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;

            me.method.ajax(JSON.stringify({
                M: api.method.getTotalBillData,
                D: JSON.stringify({
                    DateYear: year,
                    DateMonth: month
                })
            }), function (data) {
                me.query.billId = data.Id;
                $('#m-income').html(data.TotalIncomeStr);
                me.method.loadData()
            })
        },
        loadData: function () {
            var me = fjw.webapp.bills;

            me.drop = $('.app-main').dropload({
                scrollArea: window,
                domDown: {
                    domClass: 'dropload-down',
                    domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
                    domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
                    domNoData: '<div class="dropload-noData">我是有底线的</div>'
                },
                loadUpFn: function (that) {
                    $('.tradingRecord-list').empty()
                    me.query.page = 1
                    me.method.getList(that)
                },
                loadDownFn: function (that) {
                    me.query.page++
                    me.method.getList(that)
                }
            })
        },
        getList: function (that) {
            var me = fjw.webapp.bills;

            me.method.ajax(JSON.stringify({
                M: api.method.getBillDataList,
                D: JSON.stringify({
                    TotalBillID: me.query.billId,
                    BillTypeID: me.query.typeId,
                    PageIndex: me.query.page,
                    PageSize: me.query.size
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
            var tpl = '<% if(grid.length>0){ %>' +
                '       <% for(var i=0;i<grid.length;i++){ %>' +
                '           <% var data = grid[i]%>' +
                '           <li>' +
                '               <a href="javascript:;" datahref="<%= data.IsClick == true ? "/wallet/bill-detail.html?id="+data.ObjectypeId+"&type="+data.OperationType : ""%>" data-title="交易详情">' +
                '                   <h3><%= data.Title%></h3>' +
                '                   <p><%=data.BillDate%><%= data.Intro != "" ? " | "+data.Intro : ""%></p>' +
                '                   <div class="trarl-sidetxt <%= data.AmountType == 2 ? "disburse" : ""%>"><%=data.BillAmountStr%></div>' +
                '               </a>' +
                '           </li>' +
                '          <%}%>' +
                '      <%}%>';
            var html = doT(tpl, data);
            $('.tradingRecord-list').append(html);
        }
    }
};

$(function () {
    fjw.webapp.bills.init();
});






































































