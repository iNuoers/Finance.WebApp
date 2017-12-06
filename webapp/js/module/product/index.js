/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-11-02 15:11:46 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-23 10:45:47
 */
'use strict'

require('css_path/product/index.css')
require('plugins/raphael.js')

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/wx.core.js')
var apps = require('js_path/lib/wx.apps.js')
var cycle = require('js_path/lib/cycle.js')
var time = require('js_path/lib/time.core.js')
var doT = require('plugins/template/template.js')

fjw.webapp.prol = {
    param: {
        TypeId: 0,
        pageIndex: 1,
        pageSize: 20,
        ShowSellOut: "T",
        ProductState: "",
        ProductTypeId: 0,
        orderByType: 0,
        orderBySort: 0
    },
    init: function () {
        this.onPageLoad()
        this.listenEvent()

    },
    onPageLoad: function () {
        var me = this, idx = core.String.getQuery("index") || 0, type = 0;
        type = idx > 0 ? idx : 1;
        me.method.getList(type);
    },
    listenEvent: function () {
        var me = this;

        me.method.nav();
        $(".bottomMenu div").removeClass("-current").siblings(".products_m").addClass("-current");
        return
        var xx, yy, XX, YY, that = this;
        document.addEventListener('touchstart', function (event) {
            xx = event.targetTouches[0].screenX;
            yy = event.targetTouches[0].screenY;
        })
        document.addEventListener('touchmove', function (event) {
            XX = event.targetTouches[0].screenX;
            YY = event.targetTouches[0].screenY;

            if (Math.abs(XX - xx) - Math.abs(YY - yy) > 0 && Math.abs(YY - yy) < 10) {
                event.stopPropagation();//阻止冒泡
                var idx = $(".m-menu-item").children('div').index($(".m-menu-item").children('.active'));
                var ele = null, target = null;

                // 右滑 定期转活期
                if (XX - xx > 100 && idx === 1) {
                    ele = $(".m-menu-item").eq(0);
                    target = ele.data('target');

                    that.switchTab(target);
                    that.getList(target == 'current' ? 1 : 2);
                }
                // 左滑 活期转定期
                if (XX - xx < 100 && idx === 0) {
                    ele = $(".m-menu-item").eq(1);
                    target = ele.data('target');

                    that.switchTab(target);
                    that.getList(target == 'current' ? 1 : 2);
                }
            }
        });
    },
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
        nav: function () {
            var me = fjw.webapp.prol;
            var navContainer = $(".m-product-menu"), item = navContainer.children(".m-menu-item");
            navContainer.on("click", ".m-menu-item", function () {
                var e = $(this), t = e.data("target");
                switchTab(t);
                me.method.getList(t == 'current' ? 1 : 2);
            });
            var switchTab = function (type) {
                var e = $('.m-menu-item').children('.' + type);
                if (e.is(':visible')) {
                    $('.m-menu-item').children('div').removeClass('active');
                    e.addClass('active');

                    $(".tab-tabs").children('div').addClass('f-hide');
                    $(".tab-tabs").children('.' + type).removeClass('f-hide');
                }
            }
        },
        getList: function (type) {
            var me = fjw.webapp.prol
                , html = ''
                , $listCon = $(".m-prolist").eq(type - 1).children('.prolist');

            me.param.TypeId = type;

            var param = {
                M: api.method.productList,
                D: JSON.stringify(me.param)
            }
            me.method.ajax(JSON.stringify(param), function (data) {
                var tpl = '<%if(grid.length>0) {%>' +
                    '      <% var idx = 0; %>' +
                    '      <%for(i = 0; i < grid.length; i ++) {%>' +
                    '          <% var data = grid[i]; %>' +
                    '          <%if(data.Status==3&&data.RemainingShares==0&&idx==0){%>' +
                    '              <% idx++ %>' +
                    '              <div class="prol-space mt15 mb10"><span>只展示最近10个已售罄产品</span></div>' +
                    '          <%}%>' +
                    '          <li class="prol-item <%= (data.RemainingShares==0) ? "saleout" : "" %>">' +
                    '              <a href="javascript:;" data-href="/product/detail.html?id=<%= data.Id %>" title="<%=data.Title%>" class="prol-item-inner">' +
                    '                  <div class="c-333333 f18px pt10 pb10">' +
                    '                      <span class="prol-title"><%=data.Title%></span>' +
                    '                  </div>' +
                    '                  <div class="prol-bd">' +
                    '                      <ul class="prol-cols f-cb">' +
                    '                          <li class="pro-col">' +
                    '                              <div class="proc-bd">' +
                    '                                  <span class="hot"><%=(data.IncomeRate).toFixed(2)%>%</span>' +
                    '                              </div>' +
                    '                              <div class="proc-hd">预期年化收益率</div>' +
                    '                          </li>' +
                    '                          <li class="pro-col">' +
                    '                              <div class="proc-bd"><span class="hot"><%=data.TimeLimit%></span></div>' +
                    '                              <div class="proc-hd">投资期限</div>' +
                    '                          </li>' +
                    '                      </ul>' +
                    '                      <%if(data.CountDown>0){%>' +
                    '                          <ul class="prol-cols time pt10 f-cb">' +
                    '                              <li class="pro-col" style="width:100%;">' +
                    '                                  <div class="proc-bd">' +
                    '                                      <i class="fa fa-clock-o c-338fff"></i>' +
                    '                                      <span class="f12px c-999 timeset" data-conutdown="<%= data.CountDown %>"></span>' +
                    '                                  </div>' +
                    '                              </li>' +
                    '                          </ul>' +
                    '                      <%}%>' +
                    '                      <div class="item_charts <%= data.CountDown <= 0 ? "on" : "" %>">' +
                    '                          <%if(data.CountDown>0){%>' +
                    '                              <span href="javascript:void(0);" class="btn btn-normal time">即将开始</span>' +
                    '                          <%}%>' +
                    '                          <%if((data.Status==2||data.RemainingShares>0)){%>' +
                    '                              <% var progress = (data.TotalShares - data.RemainingShares) / data.TotalShares * 100; if(progress==0){ progress = 0;}if(progress>0&&progress<=1){progress = 1;} progress = Math.floor(progress);%>' +
                    '                              <span class="progress <%= data.CountDown <= 0 ? "" : "f-hide" %>"><%=progress%>%</span>' +
                    '                          <%}else if(data.Status==3||data.RemainingShares==0){%>' +
                    '                              <span class="c-d1d1d1 progress-text">已售罄</span>' +
                    '                          <%}%>' +
                    '                      </div>' +
                    '                  </div>' +
                    '              </a>' +
                    '          </li>' +
                    '      <%}%>' +
                    '<%}%>';

                //渲染html
                html = doT(tpl, data);
                $listCon.html(html);

                cycle();
                me.method.countdown();
            })
        },
        countdown: function () {
            time.countdown($('.timeset'), ' 后开售', function () {

                var times = $('.timeset').parents(".time");
                $(times.siblings()[1]).addClass('on')
                $(times.siblings()[1]).find('.progress').removeClass('f-hide')
                $(times.siblings()[1]).find('.time').remove()
                times.remove()
                cycle();
            });
        }
    }
}

$(function () {
    fjw.webapp.prol.init();
});