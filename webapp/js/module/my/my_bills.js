/**
 * Created by PC on 2017/8/23.
 */
require('css_path/my/my_bills.css')
require('plugins/dropload/dropload.css')

var _api = require('js_path/lib/f.data.js')
var _util = require('js_path/lib/f.utils.js')
var _t = require('plugins/template/template.js')
var _d = require('plugins/dropload/dropload.js')

fjw.webapp.bills = {
    productId: 0,//产品ID
    typeId: 0,//类别ID
    init: function () {
        var totalIncome = _util.Tools.getUrlParam("totalIncome");
        if (totalIncome) $('.bills-box-top span').text(totalIncome);
        $('.bills-screening ul').empty();
        //获取账单类型
        this.getBillTypeList();

        //获取当月账单数据
        this.getBillDataList();

        //添加事件
        this.addEventList()
    },
    getBillTypeList: function () {
        var param = {
            url: _api.host,
            data: JSON.stringify({
                M: _api.method.getBillTypeList
            }),
            method: 'POST',
            success: function (data) {
                data = JSON.parse(data);
                //console.log(data);
                var tpl = '<% if(grid.length > 0){ %>' +
                    '<% for(var i=0;i<grid.length;i++){ %>' +
                    '<% var data=grid[i]; %>' +
                    '<li class="<%= i==0? "bills-screening-active": " " %>" data-id="<%=data.BillType%>"><%=data.BillTypeStr%></li>' +
                    '<%}%>' +
                    '<%}%>';
                //渲染html
                var html = _t(tpl, data);
                $('.bills-screening ul').html(html);
            }
        };
        _util.ajax.request(param);
    },
    getBillDataList: function () {
        var s = this;
        s.productId = _util.Tools.getUrlParam('id');
        // 页数
        var page = 0;
        // 每页展示15个
        var size = 15;

        $('.app-main').dropload({
            scrollArea: window,
            domDown: {
                domClass: 'dropload-down',
                domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
                domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
                domNoData: '<div class="dropload-noData">我是有底线的</div>'
            },
            loadUpFn: function (e) {
                page = 1;
                console.log("1111")
            },
            loadDownFn: function (e) {
                page++;
                var param = {
                    url: _api.host,
                    data: JSON.stringify({
                        M: _api.method.getBillDataList,
                        D: JSON.stringify({
                            TotalBillID: s.productId,
                            BillTypeID: s.typeId,
                            PageIndex: page,
                            PageSize: size
                        })
                    }),
                    method: 'POST',
                    success: function (data) {
                        data = JSON.parse(data);
                        var tpl = '<% if(grid.length>0){ %>' +
                            '<% for(var i=0;i<grid.length;i++){ %>' +
                            '<% var data=grid[i]%>' +
                            '<li class="bills-bm">' +
                            '<div class="list-fl f-fl">' +
                            '<div class="list-title-top f-cb mt15">' +
                            '<%= data.Title%><span class="f-fr">' +
                            '<% if(data.CardCouponIconUrl!=""){%>' +
                            '<img width="50%" height="50%" src=<%=data.CardCouponIconUrl%>></span>' +
                            '<%}%>' +
                            '</div>' +
                            '<div class="list-title-bottom">' +
                            '<%=data.BillDate%>' +
                            '<% if(data.Intro!=""){%>' +
                            '来自<%=data.Intro%>' +
                            '<%}%>' +
                            '<% if(data.Remark!=""){%>' +
                            '&nbsp;&nbsp;&nbsp;加息<span class="c-0087DF">+<%=data.Remark%>%</span>' +
                            '<%}%>' +
                            '</div>' +
                            '</div>' +
                            '<div class="list-fr f-fr c-FF424A"><%=data.BillAmountStr%></div>' +
                            '</li>' +
                            '<%}%>' +
                            '<%}%>';
                        var html = _t(tpl, data);
                        $('.bills-list ul').empty().html(html);

                    },
                    error: function (errMsg) {

                    }
                };
                _util.ajax.request(param);
            }
        });

    },

    addEventList: function () {
        $('.bills-r').on('click', function (e) {
            if ($(this).text() == '筛选') {
                $(this).text('取消');
                $('.bills-zhezhao').show();
                $('.bills-screening').show();
                $(".bills-screening").animate({ top: '49px' });
                window.addEventListener('touchmove', moveD);
            } else {
                $(this).text('筛选');
                $(".bills-screening").animate({ top: '-20px' }, 200, function () {
                    $('.bills-zhezhao').hide();
                    $('.bills-screening').hide();
                });
                window.removeEventListener('touchmove', moveD);
            }
        });
        function moveD(e) {
            e.preventDefault();
        }

        $('.bills-screening li').unbind('click').bind('click', function (e) {
            $(this).siblings('li').removeClass('bills-screening-active');
            $(this).addClass('bills-screening-active');
            console.log($(this).index());
        })
    }

};

$(function () {
    fjw.webapp.bills.init();
});