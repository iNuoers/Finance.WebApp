'use strict'
require('../css/help.css')

var _f = require('./lib/app.js')
var _h = require('./service/help-service.js')
var template = require('../plugins/template/template.js')

fjw.webapp.help = {
    init: function () {
        this.onLoad();
        this.listenEvent();
    },
    onLoad: function () {
        this.initHot();
        this.initHelpType();
    },
    listenEvent: function () {

    },
    initHelpType: function () {
        var _this = this;
        var req = {
            M: _f.config.apiMethod.getHelpType
        };

        _h.getHelpType(JSON.stringify(req), function (res) {
            var data = JSON.parse(res);
            if (!!data && data.HelpTypeList.length > 0) {
                data.HelpTypeList.forEach(function (data) {
                    if (!data.LinkUrl) {
                        data.url = "help-list.html?tid=" + data.Id;
                    } else {
                        data.url = data.LinkUrl;
                    }
                    data.img = data.ImgUrl.replace('http://static.fangjinnet.com', 'https://oivqpsaoi.qnssl.com');
                }, this);
            }

            var tpl = '<%if(HelpTypeList.length>0) {%>' +
                '    <%for(i = 0; i < HelpTypeList.length; i ++) {%>' +
                '        <% var data = HelpTypeList[i]; %>' +
                '        <li><div class="li-inner"><a href="<%=data.url%>"><img src="<%=data.img%>" ><%=data.Title%></a></div></li>' +
                '     <%}%>' +
                '<%}%>';

            var html = template(tpl, data);
            $('.type-ul').html(html);
        });
    },
    initHot: function () {
        var _this = this;
        var req = {
            M: _f.config.apiMethod.helpCenterList
        };

        _h.getHelpType(JSON.stringify(req), function (res) {
            var data = JSON.parse(res);

            var tpl = '<div class="help-hot-list">' +
                '    <%if(grid.length>0) {%>' +
                '        <%for(i = 0; i < grid.length; i ++) {%>' +
                '            <% var data = grid[i]; %>' +
                '            <a class="hot-cell" data-help-id="<%=data.QId%>" href="./detail.html?id=<%=data.QId%>&tid=<%=data.TypeId%>">' +
                '               <div class="hot-cell-bd hot-cell-primary"><%=data.QTitle%></div>'+
                '               <i class="fa fa-angle-right fa-fw"></i>' +
                '            </a>' +
                '        <%}%>' +
                '    <%}else{%>' +
                '        <p class="err-tip">' +
                '            <span>空空如也，</span>' +
                '        </p>' +
                '    <%}%>' +
                '</div>';

            var html = template(tpl, data);
            $('.hot-cells').html(html);
        });
    }
}

$(function () {
    fjw.webapp.help.init();
})