/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-11-09 16:12:18 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-29 17:51:48
 */
'use strict'
require('css_path/wallet/cards.css')

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/wx.core.js')
var apps = require('js_path/lib/wx.apps.js')
var doT = require('plugins/template/template.js')

fjw.webapp.cards = {
    option: {
        type: 1,//1是现金劵，2是加息劵
        couponList: []
    },
    init: function () {
        this.onPageLoad()
    },
    onPageLoad: function () {
        var me = this;
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
    },
    getAbleCouponList: function () {
        var option = this.option;
        if (option.couponList[option.type - 1]) {
            this.renderHtml(option.couponList[option.type - 1]);
        } else {
            var param = {
                url: _api.host,
                data: JSON.stringify({
                    M: _api.method.getAbleCouponList,
                    D: JSON.stringify({ Type: option.type })
                }),
                method: 'POST',
                success: this.getAbleCouponSuccess.bind(this)
            };
            $('.loading-box').removeClass('f-hide');
            _util.ajax.request(param);
        }
    },
    getAbleCouponSuccess: function (data) {
        var option = this.option;
        data = JSON.parse(data);
        console.log(data);
        option.couponList.push(data);
        this.renderHtml(data);
        $('.loading-box').addClass('f-hide');
    },
    renderHtml: function (data) {
        //渲染html
        //console.log(data);
        var html = "";
        if (data.grid.length > 0) {
            var tpl = '<%if(grid.length>0) {%>' +
                '<% var daysSecond = 86400;%>' +
                '<%for(var i=0;i<grid.length;i++ ) {%>' +
                '<% var data = grid[i];%>' +
                '<li>' +
                '<a href="./carddetails.html?id=<%= i%>&type=<%=data.CouponType%>&cardId=<%= data.Id%>">' +
                '<div class="list-l">' +
                '<div class="list-j"><%= (data.CouponType == 1) ? "现金劵" : "加息劵" %></div>' +
                '<div class="list-b"><%= (data.CouponType == 1) ? parseInt(data.CouponValue)+"元" : parseFloat(data.CouponValue).toFixed(1)+"%" %></div>' +
                '<%if(data.UseEndTotalSecond<daysSecond){date=0}%>' +
                '<%if(data.UseEndTotalSecond>daysSecond*1){date=1}%>' +
                '<%if(data.UseEndTotalSecond>daysSecond*2){date=2}%>' +
                '<% var date;if(data.UseEndTotalSecond>daysSecond*3){date=3}%>' +
                '<% var date;if(data.UseEndTotalSecond>daysSecond*4){date=-1}%>' +
                '<%if(date>0) {%>' +
                '<div class="list-t"><%=date%>天后到期</div>' +
                '<%}%>' +
                '<%if(date==0) {%>' +
                '<div class="list-t list-time" data-conutdown="<%=data.UseEndTotalSecond%>"></div>' +
                '<%}%>' +
                '</div>' +
                '<div class="list-r">立即使用</div>' +
                '</a>' +
                '</li>' +
                '<%}%>' +
                '<%}%>';
            html = _t(tpl, data);
        } else {
            html = '<div class="nothing-card">对不起！你还没有任何优惠劵</div>'
        }

        $('.cardstock-list #cardList').empty().html(html);
        //不足一天开始倒计时
        this.initTime();
    },
    addEventList: function () {
        var s = this;
        $('.m-product-menu .m-menu-item').unbind('click').bind('click', function (e) {
            var target = $(this).data("target");
            $('.m-product-menu div').removeClass('active');
            $(this).children('div').addClass('active');

            if (target == 'current') {
                s.option.type = 1;
            } else {
                s.option.type = 2;
            }
            s.getAbleCouponList();
        });

        $('.cardstock-btn').click(function (e) {
            layer.open({
                content: '体验更多功能，请下载房金网APP'
                , btn: ['立即下载', '稍后下载']
                , yes: function (index) {
                    location.href = "http://www.fangjinnet.com/wx/download/index";
                    layer.close(index);
                }
            });
        });

        var xx, yy, XX, YY;
        window.addEventListener('touchstart', function (e) {
            xx = e.targetTouches[0].screenX;
            yy = e.targetTouches[0].screenY;
            //console.log(xx,yy);
        });
        window.addEventListener('touchmove', function (e) {
            XX = e.targetTouches[0].clientX;
            YY = e.targetTouches[0].screenY;
            //console.log(XX,YY);
            if (Math.abs(XX - xx) - Math.abs(YY - yy) > 0 && Math.abs(YY - yy) < 10) {
                event.stopPropagation();//阻止冒泡

                // 右滑 现金转加息
                if (XX - xx > 60 && s.option.type == 1) {
                    $('.m-product-menu div').removeClass('active');
                    $('.invest').addClass('active');
                    s.option.type = 2;
                    s.getAbleCouponList();
                }
                // 左滑 加息转现金
                if (XX - xx < 60 && s.option.type == 2) {
                    $('.m-product-menu div').removeClass('active');
                    $('.current').addClass('active');
                    s.option.type = 1;
                    s.getAbleCouponList();
                }
            }
        });
    },
    initTime: function () {
        _d.countdown($('.list-time'), ' 后到期', function (thisObj) {
            $(thisObj).parent().parent().hide();
        });
    }
};
$(function () {
    fjw.webapp.cards.init();
});