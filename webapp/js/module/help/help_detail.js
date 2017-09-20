'use strict'
require('css_path/help/help.css')

var _api = require('js_path/lib/f.data.js')
var _util = require('js_path/lib/f.utils.js')
var _h = require('js_path/service/help-service.js')
var template = require('plugins/template/template.js')

fjw.webapp.help_detail = {
    query: {
        id: _util.Tools.getUrlParam('id'),
        tid: _util.Tools.getUrlParam('tid')
    },
    init: function () {
        this.event();
        this.method.getDetail();
    },
    event: function () {

    },
    method: {
        getDetail: function () {
            //helpCenterList
            _h.helpCenterList(fjw.webapp.help_detail.query.id, function (res) {
                var data = JSON.parse(res);

                if (data.grid.length > 0) {
                    var tit = data.grid[0].QTitle,
                        con = data.grid[0].QContent,
                        list = data.grid[0].QRelations;

                    $('.qa-tit').html(tit), $('.qa-cont').html(con);

                    // 渲染相关问题列表
                    var tpl = '<%if(QRelations.length>0) {%>' +
                        '    <%for(i = 0; i < QRelations.length; i ++) {%>' +
                        '        <% var data = QRelations[i]; %>' +
                        '        <li><a href="javascript:;" data-href="detail.html?id=<%= data.QId %>"><%= data.QTitle %></a><span class="fa fa-angle-right"></span></li>' +
                        '     <%}%>' +
                        '<%}%>';

                    var html = template(tpl, data.grid[0]);
                    $('.question-item').html(html);

                } else {
                    alert('无相关问题')
                }
            })
        }
    }
}

$(function () {
    fjw.webapp.help_detail.init()
})