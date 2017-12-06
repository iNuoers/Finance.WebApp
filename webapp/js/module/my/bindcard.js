/*
* @Author: mr.ben（66623978）
* @Date:   2017-09-11 17:12:27
* @Last Modified by:   mr.ben
* @Last Modified time: 2017-09-11 17:12:27
*/

'use strict'
require('css_path/my/bindcard.css')

var _api = require('js_path/lib/f.data.js')
var _util = require('js_path/lib/f.utils.js')
var _t = require('plugins/template/template.js')

fjw.webapp.bindcard = {
    init: function () {
        this.onLoad()
        this.listenEvent()
    },
    onLoad: function () {
        var _this = this;
        _this.method.getBankList();
    },
    listenEvent: function () {
        var _this = this;
        // 1.监听快速删除事件
        $('input').focus(function(){
            $(this).siblings('.quick-del').css("display","block");
            $(".quick-del").on('click', function () {
                $(this).siblings("input").val("");
                $(this).addClass("f-hide");
            })
        })
        $('input').blur(function(){
            $(this).siblings('.quick-del').css("display","none"); 
        })
        // 2.银行卡号输入监听
        _this.method.getBankInfo();
        // 3.监听submit事件
        $('.F-submit').on('click', function () {
            _this.method.formValidate();

        })

    },
    method: {
        submit: function () {
            var Name = $('#txtRealName').val();
            var Identity = $('#txtIdentity').val();
            var bankCard = $('#txt_bankCard').val();
            var phone = $('#txtTelNo').val();
            var BankId = $('#txtCardType > span').html();
            var bankbranch = $('#bankBranch').val();
            var param = {
                RealName: Name,
                CardId: Identity,
                BankId: BankId,
                BankNo: bankCard,
                BankSubBranch: bankbranch,
                Mobile: phone
            };
            var req = {
                M: _api.method.bankCardBind,
                D: JSON.stringify(param)
            };
            console.log(req);
            _util.ajax.request({
                url: _api.host,
                method: 'post',
                data: JSON.stringify(req),
                success: function (json) {
                    var data = JSON.parse(json);
                    alert('绑定成功');
                    window.location.href = "";
                }
            })
        },
        // 获取银行信息下拉列表
        getBankList: function () {
            var param = {
                pageIndex: 1,
                pageSize: 100
            };
            var req = {
                M: _api.method.getBankTypeList,
                D: JSON.stringify(param)
            };
            _util.ajax.request({
                url: _api.host,
                method: 'post',
                data: JSON.stringify(req),
                success: function (json) {
                    var data = JSON.parse(json);
                    var html = '';
                    console.log(data);
                    if (data.grid.length > 0) {
                        var tpl = '<%for(i = 0; i < grid.length; i ++) {%>' +
                            '<% var data = grid[i]; %>' +
                            '<li class="bb-e6e6e6"><img src="<%= data.BankIcon%>"><span><%=data.BankName%></span></li>' +
                            '<%}%>'
                        html = _t(tpl, data);
                        $('.bandname').append(html)
                    };
                    $('.selectDiv').on('click',
                        function () {
                            $('.bandname').toggle();
                            var cardspan = $('#txtCardType > span').html();
                            if ((cardspan == '') || ($('#txt_bankCard').val() == '')) {
                                var bandnameLi = $('.bandname li');
                                bandnameLi.on('click',
                                    function () {
                                        var span = $(this).html();

                                        $('#txtCardType > span').html(span);
                                        $('.bandname').css("display", "none");
                                    })

                            }

                        })
                }

            });

        },
        // 根据输入的银行卡号获取银行信息
        getBankInfo: function () {
            $('#txt_bankCard').on('input', function () {
                var idval = $('#txt_bankCard').val();
                var req = {
                    M: _api.method.bankInfo,
                    D: JSON.stringify({
                        BankCardNo: idval
                    })
                };
                if (idval.length >= 5) {
                    _util.ajax.request({
                        url: _api.host,
                        method: 'post',
                        data: JSON.stringify(req),
                        success: function (json) {
                            var data = JSON.parse(json);

                            if (data != null) {
                                console.log(data.BankIcon);
                                $('#txtCardType > span').html("<img src=" + data.BankIcon + ">" + data.BankName)
                            }

                        }

                    })
                }

            });
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
                M: _api.method.bankBranchInfo,
                D: JSON.stringify(param)
            };

        },
        formValidate: function () {
            var Name = $('#txtRealName')
            var Identity = $('#txtIdentity')
            var bankCard = $('#txt_bankCard')
            var phone = $('#txtTelNo')
            var bankbranch = $('#bankBranch')
            var rules = {
                realName: {
                    required: "请输入您的姓名",
                    typ: "请输入在正确格式的姓名"
                },
                Id: {
                    required: "请输入您的身份证号码",
                    typ: "请输入在正确格式的身份证号码"
                },
                bankCard: {
                    required: "请输入您的银行卡号",
                    typ: "请输入在正确格式的银行卡号"
                },
                phone: {
                    required: "请输入您的手机号码",
                    typ: "请输入在正确格式的手机号码"
                }
            };
            // 名字判断
            if (!_util.validate(Name.val(), 'require')) {
                var placehd = rules.realName.required;
                Name.attr('placeholder', placehd)
                Name.parent().addClass('active')
            }
            else if (!_util.validate(Name.val(), 'realname')) {
                var placehd = rules.realName.typ;
                Name.attr('placeholder', placehd);
                $(".ruleName").html(placehd).fadeIn().delay(2500).fadeOut();
                Name.parent().addClass('active')
            }
            //身份证号码验证
            if (!_util.validate(Identity.val(), 'require')) {
                var placehd = rules.Id.required;
                Identity.attr('placeholder', placehd);
                Identity.parent().addClass('active')
            }
            else if (!_util.validate(Identity.val(), 'identity')) {
                var placehd = rules.Id.typ;
                Identity.attr('placeholder', placehd);
                $(".ruleId").html(placehd).fadeIn().delay(2500).fadeOut();
                Identity.parent().addClass('active')
            }
            //银行卡号码验证
            if (!_util.validate(bankCard.val(), 'require')) {
                var placehd = rules.bankCard.required;
                bankCard.attr('placeholder', placehd);
                bankCard.parent().addClass('active')
            }
            else if (!_util.validate(bankCard.val(), 'bankcard')) {
                var placehd = rules.bankCard.typ;
                bankCard.attr('placeholder', placehd);
                $(".rulebank").html(placehd).fadeIn().delay(2500).fadeOut();
                bankCard.parent().addClass('active')
            }
            //预留手机号码验证 
            if (!_util.validate(phone.val(), 'require')) {
                var placehd = rules.phone.required;
                phone.attr('placeholder', placehd);
                phone.parent().addClass('active')
            }
            else if (!_util.validate(phone.val(), 'phone')) {
                var placehd = rules.phone.typ;
                phone.attr('placeholder', placehd);
                $(".rulePhone").html(placehd).fadeIn().delay(2500).fadeOut();
                phone.parent().addClass('active')
            }

            if ((_util.validate(Name.val(), 'realname')) && (_util.validate(Identity.val(), 'identity')) && (_util.validate(bankCard.val(), 'bankcard')) && (_util.validate(phone.val(), 'phone'))) {
                this.submit();
            }

        }
    }
}
$(function () {
    fjw.webapp.bindcard.init();
})
