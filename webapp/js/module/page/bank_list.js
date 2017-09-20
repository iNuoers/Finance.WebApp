/*
* @Author: mr.ben（66623978）
* @Date:   2017-09-11 09:12:27
* @Last Modified by:   mr.ben
* @Last Modified time: 2017-09-11 09:12:27
*/

'use strict'
require('css_path/page/bank_list.css')

var _api = require('js_path/lib/f.data.js')
var _util = require('js_path/lib/f.utils.js')
var _t = require('plugins/template/template.js')

fjw.webapp.banklist = {
    init: function () {
        this.onLoad()
    },
    onLoad: function () {
        var _this = this;
        _this.getBankList();
    },
    getBankList: function () {
        var _this=this;
        _util.ajax.request({
            url: _api.host,
            data: JSON.stringify({
                M: _api.method.bankList
            }),
            method: 'POST',
            success: function (json) {
                var data = JSON.parse(json);
                var tpl = '<%if(grid.length>0) {%>' +
                    '    <%for(i = 0; i < grid.length; i ++) {%>' +
                    '        <% var data = grid[i]; %>' +
                    '        <li class="bb-e6e6e6">' +
                    '            <img src="<%= data.BankIcon %>" class="gongshang">' +
                    '            <p class="f17px"><%= data.BankName %></p>' +
                    '            <p class="f12px c-ababab line-h20">单日限额<%= data.DayPrice %>，单笔限额<%= data.SinglePrice %></p>' +
                    '        </li>' +
                    '     <%}%>' +
                    '<%}%>';

                var html = _t(tpl, data);
                $('.banklist ul').html(html);
            },
            error: function () {

            }
        });
    }
}

$(function(){
    fjw.webapp.banklist.init();
});