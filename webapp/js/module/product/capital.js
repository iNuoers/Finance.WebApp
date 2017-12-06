/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-11-06 15:17:35 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-06 16:02:29
 */
'use strict'

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/wx.core.js')
var apps = require('js_path/lib/wx.apps.js')

fjw.webapp.capital = {
    init: function () {
        this.onPageLoad()
    },
    onPageLoad: function () {
        var me = this;
        var tid = core.String.getQuery('tid'),
            pid = core.String.getQuery('pid');

        if (pid == 1 || tid == 9) {
            $('.current').removeClass('f-hide');
        } else {
            $('.invest').removeClass('f-hide');
        }
    }
}

fjw.webapp.capital.init()