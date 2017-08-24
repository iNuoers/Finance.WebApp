'use strict'

require('../css/my_wallet.css');

var _f = require('./lib/app.js')
var _t = require('../plugins/template/template.js')

fjw.webapp.my_wallet = {
    init : function () {
        this.listenEvent();
    },
    listenEvent:function(){
        $(".primary-nav_inner a").removeClass("-current").siblings(".-wallet").addClass("-current");
    }
};
$(function () {
    fjw.webapp.my_wallet.init();
});