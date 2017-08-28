'use strict'

require('../css/product_index.css')

require('../plugins/raphael.js')

var _f = require('./lib/app.js')
var _c = require('./lib/cycle.js')
var _d = require('./lib/time.core.js')
var _p = require('./service/product-service.js')
var _t = require('../plugins/template/template.js')

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
        this.listenEvent();
        this.initNav();
        this.onLoad();
        $(".primary-nav_inner a").removeClass("-current").siblings(".-invest").addClass("-current");
    },
    onLoad: function () {
        var that = this, idx = _f.Tools.getUrlParam("index") || 0, type = 0;
        type = idx > 0 ? idx : 1;
        that.getList(type);
    },
    listenEvent: function () {
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
    initNav: function () {
        var that = this;
        var navContainer = $(".m-product-menu"), item = navContainer.children(".m-menu-item");
        navContainer.on("click", ".m-menu-item", function () {
            var e = $(this), t = e.data("target");
            that.switchTab(t);
            that.getList(t == 'current' ? 1 : 2);
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
    getList: function (type) {
        var that = this, html = ''
            , $listCon = $(".m-prolist").eq(type - 1).children('.prolist');

        that.param.TypeId = type;

        _p.getList(JSON.stringify({
            M: _f.config.apiMethod.productList,
            D: JSON.stringify(that.param)
        }), function (json) {

            var data = JSON.parse(json);

            var tpl = '<%if(grid.length>0) {%>' +
                '      <% var idx = 0; %>' +
                '      <%for(i = 0; i < grid.length; i ++) {%>' +
                '          <% var data = grid[i]; %>' +
                '          <%if(data.Status==3&&data.RemainingShares==0&&idx==0){%>' +
                '              <% idx++ %>' +
                '              <div class="prol-space mt15 mb10"><span>只展示最近10个已售罄产品</span></div>' +
                '          <%}%>' +
                '          <li class="prol-item <%= (data.RemainingShares==0) ? "saleout" : "" %>">' +
                '              <a href="javascript:;" data-href="./detail.html?id=<%= data.Id %>" title="<%=data.Title%>" class="prol-item-inner">' +
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
            html = _t(tpl, data);
            $listCon.html(html);

            _c();
            that.initTime();

        }, function (err) {

        }, function () {
            $(".loading-box").removeClass('f-hide')
        }, function () {
            $(".loading-box").addClass('f-hide')
        });
    },
    initTime: function () {
        _d.countdown($('.timeset'), ' 后开售', function () {
            $('.timeset').parent().parent().parent().hide();
            $($('.timeset').parent().parent().parent().siblings()[1]).find('span.time').hide()
            _c();
        });
    }
}

$(function () {
    fjw.webapp.prol.init();
});