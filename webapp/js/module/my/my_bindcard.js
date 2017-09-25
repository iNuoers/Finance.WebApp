/*
* @Author: mr.ben（66623978）
* @Date:   2017-09-11 17:12:27
* @Last Modified by:   mr.ben
* @Last Modified time: 2017-09-11 17:12:27
*/

'use strict'
require('css_path/my/my_bindcard.css')

var _api = require('js_path/lib/f.data.js')
var _util = require('js_path/lib/f.utils.js')

fjw.webapp.bindcard = {
    init: function () {
        this.onLoad()
        this.listenEvent()
    },
    onLoad: function () {
        var _this = this;
        _this.method.getBankList()
    },
    listenEvent: function () {
        var _this = this;
    },
    method: {
        // 获取银行信息下拉列表
        getBankList: function () {
            var param = {
                pageIndex: 1,
                pageSize: 100
            };
            var req = {
                M: _api.method,
                D: JSON.stringify(param)
            };
        },
        // 根据输入的银行卡号获取银行信息
        getBankInfo: function (id) {
            var req = {
                M: _api.method.bankInfo,
                D: JSON.stringify({
                    BankCardNo: id
                })
            }
        },
        // 根据输入搜索开户支行
        getBranchInfo: function (bankname, cityName) {
            var param = {
                pageIndex: 1,
                pageSize: 15,
                BankName: bankname,
                CityName: cityName
            };
            var req = {
                M: _api.method,
                D: JSON.stringify(param)
            };
        }
    }
}

$(function () {
    fjw.webapp.bindcard.init();
})