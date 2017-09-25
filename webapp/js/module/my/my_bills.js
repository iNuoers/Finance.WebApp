/**
 * Created by PC on 2017/8/23.
 */
require('css_path/my/my_bills.css')
require('plugins/dropload/dropload.css')

var _api = require('js_path/lib/f.data.js')
var _core = require('js_path/lib/f.core.js')
var _util = require('js_path/lib/f.utils.js')
var _t = require('plugins/template/template.js')
var _d = require('plugins/dropload/dropload.js')

fjw.webapp.bills = {
    page: 0,
    size: 15,
    isScrollMove: true,
    productId: 0,//产品ID
    typeId: 0,//类别ID
    init: function () {
        $(".loading-box").removeClass('f-hide');
        var totalIncome = _util.Tools.getUrlParam("totalIncome");
        if (totalIncome) $('.bills-box-top span').text(totalIncome);
        $('.bills-screening ul').empty();
        //获取账单类型
        this.getBillTypeList();

        //获取当月账单数据
        this.getBillDataList();

        //添加事件
        this.addEventList(true)
    },
    getBillTypeList: function () {
        var s = this;
        var param = {
            url: _api.host,
            data: JSON.stringify({
                M: _api.method.getBillTypeList
            }),
            method: 'POST',
            success: function (data) {
                data = JSON.parse(data);

                var tpl = '<% if(grid.length > 0){ %>' +
                    '<% for(var i=0;i<grid.length;i++){ %>' +
                    '<% var data=grid[i]; %>' +
                    '<li class="<%= i==0? "bills-screening-active": " " %>" data-id="<%=data.BillType%>"><%=data.BillTypeStr%></li>' +
                    '<%}%>' +
                    '<%}%>';
                //渲染html
                var html = _t(tpl, data);
                $('.bills-screening ul').html(html);

                $('.bills-screening li').unbind('click').bind('click', function (e) {
                    $(this).siblings('li').removeClass('bills-screening-active');
                    $(this).addClass('bills-screening-active');
                    s.addEventList(false);

                    //重新加载账单类型
                    s.typeId = $(this).data('id');
                    //console.log(s.typeId);
                    s.page = 1;
                    s.size = 15;

                    $(".loading-box").removeClass('f-hide');
                    var param = {
                        url: _api.host,
                        data: JSON.stringify({
                            M: _api.method.getBillDataList,
                            D: JSON.stringify({
                                TotalBillID: s.productId,
                                BillTypeID: s.typeId,
                                PageIndex: s.page,
                                PageSize: s.size
                            })
                        }),
                        method: 'POST',
                        success: function (data) {
                            data = JSON.parse(data);
                            
                            if (data.grid.length > 0) {
                                $('.bills-list ul').empty();
                                fjw.webapp.bills.renderHtml(data);
                            }
                            $("html,body").animate({
                                scrollTop: 0
                            }, 300);
                            $(".loading-box").addClass('f-hide');
                        },
                        error: function (errMsg) {
                            alert('Ajax error!');
                            // 即使加载出错，也得重置
                        }
                    };
                    _util.ajax.request(param);
                });
            }
        };
        _util.ajax.request(param);
    },
    getBillDataList: function () {
        var s = this;
        s.productId = _util.Tools.getUrlParam('id');

        $('.app-main').dropload({
            scrollArea: window,
            domDown: {
                domClass: 'dropload-down',
                domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
                domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
                domNoData: '<div class="dropload-noData">我是有底线的</div>'
            },
            loadUpFn: function (e) {
                s.page = 1;
                var param = {
                    url: _api.host,
                    data: JSON.stringify({ M: _api.method.getBillDataList, D: JSON.stringify({ TotalBillID: s.productId, BillTypeID: s.typeId, PageIndex: s.page, PageSize: s.size }) }),
                    method: 'POST',
                    success: function (data) {
                        data = JSON.parse(data);
                        //console.log(data);
                        if (data.grid.length > 0) {
                            $('.bills-list ul').empty();
                            fjw.webapp.bills.renderHtml(data);
                        } else {
                            // 锁定
                            e.lock();
                            // 无数据
                            e.noData();
                        }
                        // 每次数据插入，必须重置
                        e.resetload();
                    },
                    error: function (errMsg) {
                        alert('Ajax error!');
                        // 即使加载出错，也得重置
                        e.resetload();
                    }
                };
                _util.request(param);
            },
            loadDownFn: function (e) {
                s.page++;
                var param = {
                    url: _api.host,
                    data: JSON.stringify({ M: _api.method.getBillDataList, D: JSON.stringify({ TotalBillID: s.productId, BillTypeID: s.typeId, PageIndex: s.page, PageSize: s.size }) }),
                    method: 'POST',
                    success: function (data) {
                        data = JSON.parse(data);
                        //console.log(data);
                        if (data.grid.length > 0) {
                            fjw.webapp.bills.renderHtml(data);
                        } else {
                            // 锁定
                            e.lock();
                            // 无数据
                            e.noData();
                        }
                        // 每次数据插入，必须重置
                        e.resetload();
                        $(".loading-box").addClass('f-hide');
                    },
                    error: function (errMsg) {
                        alert('Ajax error!');
                        // 即使加载出错，也得重置
                        e.resetload();
                    }
                };
                _util.ajax.request(param);
            }
        });

    },
    renderHtml: function (data) {
        
        var tpl = '<% if(grid.length>0){ %>' +
            '          <% for(var i=0;i<grid.length;i++){ %>' +
            '              <% var data=grid[i]%>' +
            '              <%if(data.IsClick){%>' +
            '                  <a href="./billsmood.html?ObjectID=<%=data.ObjectID%>&OperationType=<%=data.OperationType%>">' +
            '              <%}%>' +
            '              <li class="bills-bm">' +
            '                  <div class="list-fl f-fl">' +
            '                      <div class="list-title-top f-cb mt15">' +
            '                          <%= data.Title%><span class="f-fr">' +
            '                          <% if(data.CardCouponIconUrl!=""){%>' +
            '                              <img width="50%" height="50%" src=<%=data.CardCouponIconUrl%>></span>' +
            '                          <%}%>' +
            '                      </div>' +
            '                      <div class="list-title-bottom">' +
            '                          <%=data.BillDate%>' +
            '                          <% if(data.Intro!=""){%>' +
            '                              来自<%=data.Intro%>' +
            '                          <%}%>' +
            '                          <% if(data.Remark!=""){%>' +
            '                              &nbsp;&nbsp;&nbsp;<span class="c-0087DF">+<%=data.Remark%></span>' +
            '                          <%}%>' +
            '                      </div>' +
            '                  </div>' +
            '                  <div class="list-fr f-fr c-FF424A"><%=data.BillAmountStr%></div>' +
            '              </li>' +
            '              <%if(data.IsClick){%>' +
            '                  </a>' +
            '              <%}%>' +
            '          <%}%>' +
            '      <%}%>';
        var html = _t(tpl, data);
        $('.bills-list ul').append(html);
    },
    addEventList: function (b) {
        var s = this;
        if (b) {
            $('.bills-r').on('click', function (e) {
                if ($(this).text() == '筛选') {
                    $(this).text('取消');
                    $('.bills-mask').css('top', $(window).scrollTop());
                    $('.bills-mask').show();
                    $('.bills-screening').show();
                    $(".bills-screening").animate({ top: '49px' });
                    s.isScrollMove = true;
                    window.addEventListener('touchmove', moveD);
                } else {
                    $(this).text('筛选');
                    $(".bills-screening").animate({ top: '-20px' }, 200, function () {
                        $('.bills-mask').hide();
                        $('.bills-screening').hide();
                    });
                    s.isScrollMove = false;
                }
            });
        } else {
            $('.bills-r').text('筛选');
            $(".bills-screening").animate({ top: '-20px' }, 200, function () {
                $('.bills-mask').hide();
                $('.bills-screening').hide();
            });
            s.isScrollMove = false;
        }
        function moveD(e) {
            if (s.isScrollMove) e.preventDefault();
        }
    }
};

$(function () {
    fjw.webapp.bills.init();
});