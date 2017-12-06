/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-11-09 15:22:48 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-09 15:55:47
 */
'use strict'
require('css_path/wallet/bill-detail.css');

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/wx.core.js')
var apps = require('js_path/lib/wx.apps.js')
var doT = require('plugins/template/template.js')

fjw.webapp.billdetail = {
    option: {
        id: core.String.getQuery('id'),
        type: core.String.getQuery('type')
    },
    init: function () {
        this.onPageLoad()
    },
    onPageLoad: function () {
        var me = this;
        me.method.getDetail()
    },
    listenEvent: function () { },
    method: {
        ajax: function (data, callback) {
            core.ajax({
                url: core.Env.apiHost,
                data: data,
                type: 'post',
                beforeSend: function () {
                    $('.loading-box').removeClass('f-hide');
                },
                success: function (data) {
                    callback && callback.call(this, JSON.parse(data))
                },
                complete: function () {
                    $('.loading-box').addClass('f-hide');
                },
                error: function () { }
            });
        },
        getDetail: function () {
            var me = fjw.webapp.billdetail;
            me.method.ajax(JSON.stringify({
                M: api.method.billDetail,
                D: JSON.stringify({
                    ObjectID: me.option.id,
                    OperationType: me.option.type
                })
            }), function (data) {
                switch (parseInt(me.option.type)) {
                    case 1:
                        // 充值
                        me.method.renderRechargeHtml(data)
                        break;
                    case 2:
                        // 提现
                        me.method.renderDrawalHtml(data)
                        break;
                    case 5:
                        // 购买
                        me.method.renderBuyHtml(data)
                        break;
                    case 6:
                        // 赎回
                        me.method.renderRansomHtml(data)
                        break;
                }
            })
        },
        renderRechargeHtml: function (data) {
            var tpl = '<%if(OrderNo!=""){%>' +
                '          <div class="billsmood-title"><%=Title%></div>' +
                '          <div class="billsood-number">' +
                '              <div class="number-t1 mt30">' +
                '                  <%= RechargeAmountStr %>元' +
                '              </div>' +
                '              <div class="number-t2 pt10 c-999999">' +
                '                  <%if(Status ==1){%>' +
                '                      <span><i class="fa fa-check-square c1be254"></i></span><%=StatusStr%>' +
                '                  <%}%>' +
                '                  <%if(Status ==2){%>' +
                '                      <span><i class="fa fa-window-close cff0101"></i></span><%=StatusStr%>' +
                '                  <%}%>' +
                '                  <%if(Status ==0){%>' +
                '                      <span><i class="fa fa-clock-o c0664e4"></i></span><%=StatusStr%>' +
                '                  <%}%>' +
                '              </div>' +
                '          </div>' +
                '          <div class="billsmood-str">' +
                '              <div class="billsmood-str-item">交易单号：<span><%=OrderNo%></span></div>' +
                '              <div class="billsmood-str-item">提交时间：<span><%= RechargeTimeStr %></span></div>' +
                '          </div>' +
                '<%}%>';
            var html = doT(tpl, data);
            $('.billsmood-center').empty().html(html);
        },
        renderDrawalHtml: function (data) {
            var tpl = '<%if(OrderNo!=""){%>' +
                '          <div class="billsmood-title"><%=Title%></div>' +
                '          <div class="billsood-number">' +
                '              <div class="number-t1 mt30">' +
                '                  <%= ArrivalAmountStr %>元' +
                '              </div>' +
                '              <div class="number-t2 pt10 c-999999">' +
                '                  <%if(Status ==1){%>' +
                '                      <span><i class="fa fa-check-square c1be254"></i></span><%=StatusStr%>' +
                '                  <%}%>' +
                '                  <%if(Status ==2){%>' +
                '                      <span><i class="fa fa-window-close cff0101"></i></span><%=StatusStr%>' +
                '                  <%}%>' +
                '                  <%if(Status ==0){%>' +
                '                      <span><i class="fa fa-clock-o c0664e4"></i></span><%=StatusStr%>' +
                '                  <%}%>' +
                '              </div>' +
                '          </div>' +
                '          <div class="billsmood-str">' +
                '              <div class="billsmood-str-item">交易单号：<span><%=OrderNo%></span></div>' +
                '              <div class="billsmood-str-item">提交时间：<span><%= CreateTimeStr %></span></div>' +
                '          </div>' +
                '<%}%>';
            var html = doT(tpl, data);
            $('.billsmood-center').empty().html(html);
        },
        renderBuyHtml: function (data) {
            var tpl = '<%if(grid.Title){%>' +
                '           <div class="billsmood-title"><%=grid.Title%>' +
                '               <%if(!grid.IsCash){%>' +
                '                   <span><img width="60%" height="100%" src="<%=xian%>"></span>' +
                '               <%}%>' +
                '               <%if(!grid.IsPlusInCome){%>' +
                '                   <span><img width="60%" height="100%" src="<%=xi%>"></span>' +
                '               <%}%>' +
                '           </div>' +
                '           <div class="billsood-number">' +
                '               <div class="number-t1 mt30">' +
                '                   <%=grid.BuySharesStr%>元' +
                '               </div>' +
                '               <div class="number-t2 pt10 c-999999">' +
                '                   <%if(grid.Status ==1){%>' +
                '                       <span><i class="fa fa-check-square c1be254"></i></span><%=grid.StatusStr%>' +
                '                   <%}%>' +
                '                   <%if(grid.Status ==0){%>' +
                '                       <span><i class="fa fa-window-close cff0101"></i></span><%=grid.StatusStr%>' +
                '                   <%}%>' +
                '               </div>' +
                '           </div>' +
                '           <div class="billsmood-str">' +
                '               <%if(grid.RecastInfo!=""){%>' +
                '                   <div class="billsmood-str-item">到期复投：<span><i><%=grid.RecastInfo%></i></span></div>' +
                '               <%}%>' +
                '               <%if(grid.CardCouponInfo!=""){%>' +
                '                   <div class="billsmood-str-item">使用卡券：<span><%:=grid.CardCouponInfo%></span></div>' +
                '               <%}%>' +
                '               <div class="billsmood-str-item">交易单号：<span><%=grid.OrderNo%></span></div>' +
                '               <div class="billsmood-str-item">提交时间：<span><%=grid.BuyTimeStr%></span></div>' +
                '               <%if(grid.ArrivalIncomeTime!=""){%>' +
                '                   <div class="billsmood-str-item mb15">收益情况：' +
                '                       <span><i><%=grid.CalculateIncomeTime%></i>开始计算收益</span>' +
                '                       <span class="billsmood-str-ml70"><i><%=grid.ArrivalIncomeTime%></i>收益到帐</span>' +
                '                   </div>' +
                '               <%}%>' +
                '           </div>' +
                '<%}%>';
            var html = doT(tpl, data);
            $('.billsmood-center').empty().html(html);
        },
        renderRansomHtml: function (data) {
            var tpl = '<%if(Title){%>' +
                '          <div class="billsmood-title"><%=Title%></div>' +
                '          <div class="billsood-number">' +
                '              <div class="number-t1 mt30">' +
                '                  <%=RedeemSharesStr%>元' +
                '              </div>' +
                '              <div class="number-t2 pt10 c-999999">' +
                '                  <%if(Status ==1){%>' +
                '                      <span><i class="fa fa-check-square c1be254"></i></span><%=StatusStr%>' +
                '                  <%}%>' +
                '                  <%if(Status ==2){%>' +
                '                      <span><i class="fa fa-window-close cff0101"></i></span><%=StatusStr%>' +
                '                  <%}%>' +
                '                  <%if(Status ==0){%>' +
                '                      <span><i class="fa fa-clock-o c0664e4"></i></span><%=StatusStr%>' +
                '                  <%}%>' +
                '              </div>' +
                '          </div>' +
                '          <div class="billsmood-str">' +
                '              <div class="billsmood-str-item">交易单号：<span><%=OrderNo%></span></div>' +
                '              <div class="billsmood-str-item">提交时间：<span><%=RedeemTimeStr%></span></div>' +
                '          </div>' +
                '<%}%>';
            var html = doT(tpl, data);
            $('.billsmood-center').empty().html(html);
        }
    }
};

$(function () {
    fjw.webapp.billdetail.init();
});