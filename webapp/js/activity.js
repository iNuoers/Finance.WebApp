'use strict'

require('../css/activity.css')
require('../plugins/dropload/dropload.css')

var _f = require('./lib/app.js')
var _d = require('../plugins/dropload/dropload.js')
var _t = require('../plugins/template/template.js')

fjw.webapp.activity = {
    init: function () {

    },
    onLoad: function () {
        // 页数
        var page = 0;
        // 每页展示5个
        var size = 15;

        // dropload
        $('.app-main').dropload({
            scrollArea: window,
            domDown: {
                domClass: 'dropload-down',
                domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
                domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
                domNoData: '<div class="dropload-noData">我是有底线的</div>'
            },
            loadUpFn: function (me) {
                page = 1;
                var that = this, id = _f.Tools.getUrlParam('id');

                _p.getBuyRecord(JSON.stringify({
                    M: _f.config.apiMethod.productBuyRecord,
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

                var that = this, id = _f.Tools.getUrlParam('id');

                _p.getBuyRecord(JSON.stringify({
                    M: _f.config.apiMethod.productBuyRecord,
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
    },
    getList: function () {
        var that = this;

        _f.request(JSON.stringify({
            M: _f.config.apiMethod.activityList,
            D: JSON.stringify({
                PageIndex: 1
            })
        }))

        _p.getBuyRecord(JSON.stringify({
            M: _f.config.apiMethod.productBuyRecord,
            D: JSON.stringify({
                'ProductId': id,
                'pageIndex': 1,
                'pageSize': 15
            })
        }), function (json) {
            var data = JSON.parse(json);
            that.renderRecord(data);
        }, function () {

        }, function () {
            $(".loading-box").removeClass('f-hide')
        }, function () {
            $(".loading-box").addClass('f-hide')
        });
    }
}



$(function () {
    fjw.webapp.activity.init();
});