/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-12-05 20:34:16 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-12-06 17:10:39
 */
'use strict'

require('css_path/product/confirm.css');

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/wx.core.js')
var apps = require('js_path/lib/wx.apps.js')
var layer = require('plugins/layer/layer.js')
var time = require('js_path/lib/time.core.js')
var doT = require('plugins/template/template.js')

fjw.webapp.buyConfirm = {
    query: {
        cache: null,
        id: core.String.getQuery('id')
    },
    init: function () {
        this.onPageLoad()
        this.bindEvent()
    },
    onPageLoad: function () {
        var me = this;
        if (Number(me.query.id) < 0) {
            window.location.href = core.Env.domain + core.Env.wwwRoot + '/product/index.html';
        }

        core.User.requireLogin(function () {
            me.method.getDetail()
            core.User.getInfo()
        })
    },
    bindEvent: function () {
        var me = this;

        // 监听金额输入
        $('#investAmount').on('keyup blue', function () {
            me.method.calcIncome();
        });

        // 最大金额事件
        $('#all').click(function () {

            var cache = me.query.cache,
                remain = cache.RemainingShares,
                max = cache.MaxBuyPrice,
                start = cache.StartBuyPrice,
                balance = window.user.balance.toFixed(2),
                price = 0;

            if (remain < balance && remain < max) {
                price = remain;
            } else if (remain < balance && remain > max) {
                price = max;
            } else {
                price = balance;
            }
            price = parseInt(parseInt(price) / start) * start;

            $('#investAmount').val(price)
            $('#investAmount').focus();

            me.method.checkAmount();
            me.method.calcIncome();

        });

        $('.calculator').click(function () {
            me.method.calculator();
        });

        $("#price > input").on("input", function () {
            var number = $.trim($(this).val()).replace(/^0+|\D/g, "")
                , html = ''
                , income = 0;

            if (me.query.cache.ProductTypeParentId == 2) {
                income = number * me.query.cache.RemainDays / 365 * (me.query.cache.IncomeRate) / 100
                html += income.toFixed(2) + '元';
            } else {
                income = number * 1 / 365 * me.query.cache.IncomeRate / 100;
                income < 0.01 ? html += '不足0.01元' : html += Math.floor(income * 100) / 100 + '元';
            }
            $('.itemNum').text(html);
        });

        $('.close').on('click', function () {
            $(".app-main").removeClass("open-mask")
            $(".mask").hide()
            $("#price > input").blur()
        });

        $('.F-buyBtn').click(function () {
            /**
             *  1.安全校验
             *  2.验证输入框金额是否符合规范
             */
            var amount = $('.amountInput').val()
            amount = Number(amount).toFixed(2);

            if (me.method.checkAmount())
                me.method.renderTradePwd()

        });
    },
    method: {
        ajax: function (data, callback) {
            core.ajax({
                url: core.Env.apiHost,
                data: data,
                type: 'post',
                success: function (data) {
                    callback && callback.call(this, JSON.parse(data))
                },
                error: function (msg) {

                }
            });
        },
        getDetail: function () {
            var me = fjw.webapp.buyConfirm;

            var param = {
                M: api.method.productDetail,
                D: JSON.stringify({
                    'ProductId': me.query.id
                })
            };

            me.method.ajax(JSON.stringify(param), function (data) {
                me.query.cache = data;
                var html = '',
                    tpl = require('../../../view/product/confirm.string');
                html = doT(tpl, data);
                $('.invest-wrapper').html(html);

                me.bindEvent()
            })
        },
        calcIncome: function () {
            // 计算收益
            var me = fjw.webapp.buyConfirm
                , val = $('#investAmount').val()
                , html = ''
                , income = 0;

            if (me.query.cache.ProductTypeParentId == 2) {
                income = val * me.query.cache.RemainDays / 365 * (me.query.cache.IncomeRate) / 100
                html += income.toFixed(2) + '元';
            } else {
                income = val * 1 / 365 * me.query.cache.IncomeRate / 100;
                income < 0.01 ? html += '不足0.01元' : html += Math.floor(income * 100) / 100 + '元';
            }

            $('#expectedProfit').html(html);
        },
        calculator: function () {
            $(".app-main").addClass("open-mask")
            $(".mask").show()
            $("#price > input").trigger("input")
        },
        renderTradePwd: function () {
            var me = fjw.webapp.buyConfirm;
            var payPassword = $("#payPassword_container"),
                key = payPassword.find('i'),
                k = 0, j = 0, l = 0,
                key_wrap = $('#key-wrap');

            $(".app-main").addClass("open-mask")
            $(".paymask").show()

            //点击隐藏的input密码框,在6个显示的密码框的第一个框显示光标
            payPassword.on('focus', "input[name='payPassword_rsainput']", function () {
                if (payPassword.attr('data-busy') === '0') {
                    //在第一个密码框中添加光标样式
                    key.eq(k).addClass("active");
                    key_wrap.css('visibility', 'visible');
                    payPassword.attr('data-busy', '1');
                }
            });

            //change时去除输入框的高亮，用户再次输入密码时需再次点击
            payPassword.on('change', "input[name='payPassword_rsainput']", function () {
                key_wrap.css('visibility', 'hidden');
                key.eq(k).removeClass("active");
                payPassword.attr('data-busy', '0');
            }).on('blur', "input[name='payPassword_rsainput']", function () {
                key_wrap.css('visibility', 'hidden');
                key.eq(k).removeClass("active");
                payPassword.attr('data-busy', '0');
            });

            //使用keyup事件，绑定键盘上的数字按键和backspace按键
            payPassword.on('keyup', "input[name='payPassword_rsainput']", function (e) {
                var e = (e) ? e : window.event;

                //键盘上的数字键按下才可以输入
                if (e.keyCode == 8 || (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
                    k = this.value.length;//输入框里面的密码长度
                    l = key.size();//6

                    for (; l--;) {
                        //输入到第几个密码框，第几个密码框就显示高亮和光标（在输入框内有2个数字密码，第三个密码框要显示高亮和光标，之前的显示黑点后面的显示空白，输入和删除都一样）
                        if (l === k) {
                            key.eq(l).addClass("active");
                            key.eq(l).find('b').css('visibility', 'hidden');

                        } else {
                            key.eq(l).removeClass("active");
                            key.eq(l).find('b').css('visibility', l < k ? 'visible' : 'hidden');
                        }

                        if (k === 6) {
                            j = 5;
                            return me.method.submit()
                        } else {
                            j = k;
                        }
                        $('#key-wrap').css('left', j * 29 + 'px');
                    }
                } else {
                    //输入其他字符，直接清空
                    var _val = this.value;
                    this.value = _val.replace(/\D/g, '');
                }
            });


            $('.paykey-close').on('click', function () {
                k = 0; j = 0; l = 0
                $('#key-wrap').css('left', '')
                $('#payPassword_rsainput').val('')
                $('.sixDigitPassword-box i b').css('visibility', '')
                $(".app-main").removeClass("open-mask")
                $(".paymask").hide()

            });
        },
        checkAmount: function () {
            var me = fjw.webapp.buyConfirm
                , detail = me.query.cache
                , ele = $('#investAmount')
                , match = /^[0-9]*$/
                , amount = ele.val();

            if (!match.test(amount)) {
                amount = amount.substring(0, amount.length - 1);
            }
            if (amount > detail.RemainingShares && amount < window.user.balance) {
                amount = detail.RemainingShares
            }
            ele.val(amount);

            if (amount == '') {
                layer.open({
                    content: '请输入投资金额'
                    , skin: 'msg'
                    , time: 2
                });
                return false;
            }
            if (!isNaN(amount)) {
                amount = Number(amount);
                if (amount < detail.StartBuyPrice) {
                    // 购买金额低于起投金额
                    layer.open({
                        content: '最低' + detail.StartBuyPrice + '元起投'
                        , skin: 'msg'
                        , time: 2
                    });
                    return false;
                } else {
                    if (amount > window.user.balance) {
                        // 您账户余额不足，请先充值再投资
                        layer.open({
                            title: '提示'
                            , content: '您账户余额不足，请先充值再投资'
                            , btn: ['确定', '取消']
                            , yes: function (index) {
                                location.reload();
                                layer.close(index);
                            }
                        });
                        return false;
                    } else {
                        //if(amount<)
                    }
                }
            } else {
                // 投资仅支持 10 的整数倍,请输入正确的投资金额
                return false;
            }
            return true;
        },
        submit: function () {
            var me = fjw.webapp.buyConfirm;
            var param = {
                IncomeId: 0,
                CashId: 0,
                ProductId: me.query.id,
                TradingPassword: $('#payPassword_rsainput').val(),
                Share: $('#investAmount').val()
            };
            me.method.ajax(JSON.stringify({
                M: api.method.buy,
                D: JSON.stringify(param)
            }), function (data) {
                window.location.href = core.Env.domain + core.Env.wwwRoot + '/product/record.html?id=' + data.Id;
            })
        }
    }
};

$(function () {
    fjw.webapp.buyConfirm.init();
});