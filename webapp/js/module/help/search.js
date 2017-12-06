/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-11-13 11:02:18 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-14 09:27:45
 */

// http://mtrip.ch.com/site/search
'use strict'
require('css_path/help/help.css')

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/wx.core.js')
var apps = require('js_path/lib/wx.apps.js')
var doT = require('plugins/template/template.js')

fjw.webapp.helpsearch = {
    init: function () {
        this.onPageLoad()
        this.linstenEvent()
    },
    onPageLoad: function () {
        var me = this;
        me.method.hotKey()
    },
    linstenEvent: function () {
        var me = this;
        document.addEventListener('touchstart', function () {
            document.getElementById("search").focus();
        })

        $('.icon-empty').on('click', function () {
            $('#search').val('');
        })

        $('#search').on('keyup', function () {
            var val = $(this).val();
            if (val == '' || val == null) {
                $('.s-list').hide();
                $('.search-message').show();
            } else {
                $('.s-list').show();
                $('.search-message').hide();
            }
        })
        $('#search').on('input', function () {
            me.method.search();
        })
    },
    method: {
        ajax: function (data, callback) {
            core.ajax({
                url: core.Env.apiHost,
                data: data,
                type: 'post',
                success: function (data) {
                    callback && callback.call(this, (data != '' && JSON.parse(data)))
                },
                error: function () {
                }
            });
        },
        hotKey: function () {
            var me = fjw.webapp.helpsearch;
            me.method.ajax(JSON.stringify({
                M: api.method.getHelpHotKey,
            }), function (data) {
                var html = '';
                if (data.grid.length > 0) {
                    var tpl = '<%for(var i=0; i<grid.length; i++) {%>' +
                        '      <%var data=grid[i];%>' +
                        '      <a href="javascript:;"><%= data.HotKey %></a>' +
                        '<%}%>'
                    html = doT(tpl, data);
                    $('.search-message').html(html)
                }
                $('.search-message > a').click(function () {
                    var code = $(this).html();
                    $('#search').val(code);
                    $('.search-message').hide();
                    me.method.search()
                })
            })
        },
        search: function () {
            var me = fjw.webapp.helpsearch, key = $('#search').val();
            me.method.ajax(JSON.stringify({
                M: api.method.helpCenterListForPC,
                D: JSON.stringify({
                    QTitle: key,
                    PageSize: 10
                }),
            }), function (data) {
                var html = '';
                if ((data.grid.length > 0)) {
                    var tpl = '<%for(i = 0; i < grid.length; i++) {%>' +
                        '<%var data= grid[i]; %>' +
                        '<%var val=$("#search").val();%>' +
                        '<%var nt="<i>" + val + "</i>"%>' +
                        '<%var different = data.QTitle.replace(new RegExp(val, "g"),nt); %>' +
                        '<li class="bdr-bottom"><a href="detail.html?id=<%= data.QId %>"><p> <%:= different%> <span class="fa fa-angle-right"></span></p></a></li>' +
                        '<%}%>'

                    $('.s-list').html('');
                    html = doT(tpl, data);
                    $('.s-list').prepend('<li class="bdr-bottom">关于' + '<i>' + $('#search').val() + '</i>' + '”的搜索结果</li>')
                    $('.s-list').append(html);

                }
            })
        }
    }
}

fjw.webapp.helpsearch.init()
