/*
* @Author: mr.ben（66623978）
* @Date:   2017-09-11 17:12:27
* @Last Modified by:   mr.ben
* @Last Modified time: 2017-09-10 17:12:27
*/

'use strict'
require('css_path/my/invite-record.css');
require('plugins/dropload/dropload.css')

var _api = require('js_path/lib/f.data.js');
var _util = require('js_path/lib/f.utils.js');
var _t = require('plugins/template/template.js')
var _d = require('plugins/dropload/dropload.js')

fjw.webapp.record = {
    init: function () {
        var _this = this;
        _this.fntabs();
        _this.method.inviteMy();    
        _this.Enventlistner();

    },
    Enventlistner: function () {
        var _this = this;
        var type = 0;
        _this.method.invite(type);

        $('.tabs span').on('click', function () {
            var index = $(this).index();
            var type = $(this).attr('type');
            var ss = $(".tab-container .tab-item").eq(index)
            // 如果已有数据 就不用再调重复调接口
            if (ss.find('ul').html() == '') {
                _this.method.invite(type);
            }
            else {
                //已加载
            }

        })
    },
    //tab选项卡
    fntabs: function () {
        $('.tabs span').on("click", function () {
            var index = $(this).index();
            $(this).addClass("active").siblings().removeClass("active");
            $(".tab-container .tab-item").eq(index).show().siblings().hide();

        })

    },
    method: {
        //我的邀请人
        inviteMy: function () {
            var data = {
                M: _api.method. getMemberInfo,
            }
            _util.ajax.request({
                method: "post",
                url: _api.host,
                data: JSON.stringify(data),
                success: function (data) {
                    var data=JSON.parse(data);
                    $('.my').html(data.friendPhone)
                }
            })
        },

        //获取邀请人条数
        invite: function (type) {
            var param = {
                Type: type,
                PageIndex: 0,
                PageSize: 15,
            }
            $('.tab-container').dropload({
                scrollArea: window,
                domDown: {
                    domClass: 'dropload-down',
                    domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
                    domLoad: '<div class="dropload-load"><span>正在加载更多数据...</span></div>',
                    domNoData: '<div class="dropload-noData">已经全部加载完毕</div>'
                },
                loadDownFn: function (me) {
                    param.PageIndex++;

                    _util.ajax.request({
                        method: "post",
                        url: _api.host,
                        data: JSON.stringify({
                            M: _api.method.getFriendList,
                            D: JSON.stringify({
                                Type: type,
                                PageIndex: param.PageIndex,
                                PageSize: param.PageSize,

                            })
                        }),
                        success: function (data) {
                            var data = JSON.parse(data);
                            var html = "";
                            if (data.grid.length > 0) {
                                var tpl = '<%for(i=0; i<grid.length; i++){%>' +
                                    '       <%var data=grid[i]%>' +
                                    '       <li class="bdr-bottom">' +
                                    '          <div class="fl">' +
                                    '              <span><%= data.friendPhone %></span>' +
                                    '              <i><%= data.time %></i></div>' +
                                    '          <span class="fr"><%= data.statusText %></span></li>' +
                                    '<%}%>'
                                html = _t(tpl, data);

                                setTimeout(function () {

                                    $(".tab-container .tab-item").eq(type).find('ul').append(html)

                                    // 每次数据加载完，必须重置
                                    me.resetload();
                                }, 1000);

                            } else {                                                                      
                                
                                // $(".tab-container .tab-item").eq(2).find('ul').html("<img src='url(image/no_firends.png)'/>")
                                // 再往下已经没有数据
                                // 锁定
                                me.lock();
                                // 显示无数据
                                me.noData();
                                // 每次数据插入，必须重置
                                me.resetload();

                            }

                        },
                        // 加载出错
                        error: function (xhr, type) {
                            alert('Ajax error!');
                            // 即使加载出错，也得重置
                            me.resetload();
                        }



                    })
                }

            })


        }
    }

}


$(function () {
    fjw.webapp.record.init();
})