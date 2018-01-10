/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-11-03 16:21:33 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-09 14:24:15
 */
'use strict'
require('css_path/product/detail.css');

var api = require('js_path/lib/f.data.js')
var core = require('js_path/lib/wx.core.js')
var apps = require('js_path/lib/wx.apps.js')
var layer = require('plugins/layer/layer.js')
var time = require('js_path/lib/time.core.js')
var doT = require('plugins/template/template.js')

fjw.webapp.pro_detail = {
    cache: {
        pro_detail: null
    },
    query: {
        id: core.String.getQuery('id'),
        firstBuy: true,
        detail: null
    },
    //当前在用卡劵内容
    option: [],
    init: function () {
        this.onPageLoad()
        this.listenEvent()
    },
    onPageLoad: function () {
        var me = this;

        core.User.isLogin()

        if (Number(me.query.id) > 0) {
            me.method.getDetail()

            //得到当前已在用卡劵内容
            // me.getCardParam();
        } else {
            window.location.href = core.Env.domain + core.Env.wwwRoot + '/product/list.html';
        }
    },
    getCardParam: function () {
        var that = this;

        that.productId = _util.Tools.getUrlParam('id');
        getParam(1);
        getParam(2);
        function getParam(num) {
            var obj = {};
            if (_util.Tools.getUrlParam('cT' + num)) {
                obj["cT"] = _util.Tools.getUrlParam('cT' + num);
                obj["cV"] = _util.Tools.getUrlParam('cV' + num);
                obj["cId"] = _util.Tools.getUrlParam('cId' + num);
                that.option.push(obj);
            }
        }
    },
    listenEvent: function () {
        var me = this;

        // 监听金额输入
        $('.amountInput').on('keyup blue', function () {
            me.initIncome();
        });

        // 最大金额事件
        $('.max-money').click(function () {

            var _detail = me.query.detail,
                remain = _detail.RemainingShares,
                max = _detail.MaxBuyPrice,
                start = _detail.StartBuyPrice,
                balance = user.balance.toFixed(2),
                price = 0;

            if (remain < balance && remain < max) {
                price = remain;
            } else if (remain < balance && remain > max) {
                price = max;
            } else {
                price = balance;
            }
            price = parseInt(parseInt(price) / start) * start;

            $('.amountInput').val(price)
            $('.amountInput').focus();

            me.checkAmount();
            me.initIncome();
            
        });
        $('.calculator').click(function () {
            me.calculator();
        });

        $("#price > input").on("input", function () {

            var b = $.trim($(this).val()).replace(/^0+|\D/g, "")
                , c = $(".financeTerm").val();

        });

        $('.close').on('click', function () {
            $(".app-main").removeClass("open-mask"),
                $(".mask").hide(),
                $("#price > input").blur()
        });


        $('.F-buyBtn').click(function () {
            /**
             *  1.安全校验
             *  2.验证输入框金额是否符合规范
             */
            if ($(this).text().length > 20) return;
            var amount = $('.amountInput').val()
                , u = me.checkUserInfo()
                , a = me.checkAmount();
            amount = Number(amount).toFixed(2);

            if (u && a) {
                //window.location.href = './confirm.html?id=' + me.query.id + '&amount=' + amount + '&coupon_type=' + 'coupon_id=';
                if (me.option.length > 0) {
                    var d = '';
                    for (var i = 0; i < me.option.length; i++) {
                        var h = '&cT' + (i + 1) + '=' + me.option[i].cT + '&cId' + (i + 1) + "=" + me.option[i].cId + "&cV" + (i + 1) + "=" + me.option[i].cV;
                        d += h;
                    }
                    window.location.href = './confirm.html?id=' + me.query.id + '&amount=' + amount + d;
                } else {
                    window.location.href = './confirm.html?id=' + me.query.id + '&amount=' + amount;
                }

            }
        });

        //更多卡劵
        $('.other-card').click(function (e) {
            if (me.option.length > 0) {
                var d = '';
                for (var i = 0; i < me.option.length; i++) {
                    var h = '&cT' + i + '=' + me.option[i].cT + '&cId' + i + "=" + me.option[i].cId;
                    d += h;
                }
                window.location.href = '../my/othercard.html?productId=' + me.productId + d;
            } else {
                window.location.href = '../my/othercard.html?productId=' + me.productId;
            }
        })
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
                error: function () {

                }
            });
        },
        getDetail: function () {
            var me = fjw.webapp.pro_detail;

            var param = {
                M: api.method.productDetail,
                D: JSON.stringify({
                    'ProductId': me.query.id
                })
            };

            me.method.ajax(JSON.stringify(param), function (data) {
                var html = '';
                var tpl = require('../../../view/product/detail.string');

                me.query.detail = data;
                html = doT(tpl, data);

                $('#m-header-nav h1').text(data.Title);
                $('.app-main').html(html);

                if (data.CountDown > 0) {
                    time.countdown($('.product-timer'), '', function () {
                        $('.F-buyBtn').text('立即投资')
                    });
                }

                me.listenEvent()
                me.method.renderProgress()

                // //渲染当前在用卡券
                // if (me.option.length > 0) {
                //     //排序,现金劵在前
                //     me.option.sort(function (a, b) {
                //         return a.cT - b.cT
                //     });
                //     me.renderCurrentCard();
                // }
                // me.calculateEarnings();
            })
        },
        renderProgress: function () {
            var that = this;
            var bar = $("#J_progressBar")
                , progress = progress || bar.data("progress")
                , on = $("#J_progressBar .progress-on")
                , val = $("#J_progressBar .progress-val")
                , em = $("#J_progressBar .progress-val em")
                , width = progress || 0;

            on.css("width", width + "%"),
                val.css("left", width + "%"),
                em.text(progress);

            if (progress < 8) {
                bar.toggleClass("beginning")
            } else if (progress > 93) {
                bar.toggleClass("ending")
            } else {
                bar.removeClass("beginning ending")
            }
        }
    },
    renderCurrentCard: function () {
        var that = this;

        var tpl = '<%if(list.length>0) {%>' +
            '<%for(var i=0;i<list.length;i++) {%>' +
            '<% var data = list[i];%>' +
            '<li>' +
            '<%= data.cT==1 ? "现金劵" : "加息券" %>' +
            '<span>' +
            '<%= data.cT==1 ? "￥"+data.cV : data.cV + "%" %>' +
            '<i class="fa fa-close fa-fw"></i>' +
            '</span>' +
            '</li>' +
            '<%}%>' +
            '<%}%>';
        var html = _t(tpl, { list: that.option });
        $('.itemList ul').empty().html(html);
        $('.page-block .item-card').text("");

        //在用卡劵添加点击事件
        $('.itemList ul li i').click(function (e) {
            var $el = $(this).parent().parent();
            //alert($el.index());
            $el.slideUp("slow", function (e) {
                if (that.option.length > 1) {
                    that.option.splice($el.index(), 1);
                } else {
                    that.option.splice(0, 1);
                }
                if (that.option.length == 0) $('.page-block .item-card').text("您有可用卡劵");
            });
        });
    },
    calculator: function () {
        $(".app-main").addClass("open-mask"),
            $(".mask").show(),
            $("#price > input").trigger("input")
    },
    initDetail: function () {
        var me = this;

        if (_util.storage.getItem($.base64.btoa('f.token')) != null) {
            _u.getUserInfo(JSON.stringify({
                M: api.method.getMemberInfo,
            }), function (json) {
                var user = JSON.parse(json);

                _core.setUserInfo(user);

                me.getDetail();

            }, function () {
                _core.setUserInfo();
                me.getDetail();
            });
        } else {
            me.getDetail();
        }
    },
    getDetail: function () {
        var me = this;

        var param = {
            M: api.method.productDetail,
            D: JSON.stringify({
                'ProductId': me.query.id
            })
        };

        _p.getDetail(JSON.stringify(param), function (json) {
            var data = JSON.parse(json), html = '';
            var tpl = require('../../../view/product/detail.string');

            me.query.detail = JSON.parse(json);
            html = _t(tpl, data);

            $('#m-header-nav h1').text(data.Title);
            $('.app-main').html(html);

            if (data.CountDown > 0) {

                _d.countdown($('.product-timer'), '', function () {
                    $('.F-buyBtn').text('立即投资')
                });
            }

            me.renderProgress();
            me.listenEvent();

            //渲染当前在用卡券
            if (me.option.length > 0) {
                //排序,现金劵在前
                me.option.sort(function (a, b) {
                    return a.cT - b.cT
                });
                me.renderCurrentCard();
            }
            me.calculateEarnings();

        }, function () {

        }, function () {
            $(".loading-box").removeClass('f-hide');
        }, function () {
            $(".loading-box").addClass('f-hide')
        });
    },
    renderProgress: function () {
        var that = this;
        var bar = $("#J_progressBar")
            , progress = progress || bar.data("progress")
            , on = $("#J_progressBar .progress-on")
            , val = $("#J_progressBar .progress-val")
            , em = $("#J_progressBar .progress-val em")
            , width = progress || 0;

        on.css("width", width + "%"),
            val.css("left", width + "%"),
            em.text(progress);

        if (progress < 8) {
            bar.toggleClass("beginning")
        } else if (progress > 93) {
            bar.toggleClass("ending")
        } else {
            bar.removeClass("beginning ending")
        }
    },
    initIncome: function () {
        // 计算收益
        var me = this
            , val = $('.amountInput').val()
            , html = ''
            , income = 0;

        if (me.query.detail.ProductTypeParentId == 2) {
            income = val * me.query.detail.RemainDays / 365 * (me.query.detail.IncomeRate) / 100
            html += income.toFixed(2) + '元';
        } else {
            income = val * 1 / 365 * me.query.detail.IncomeRate / 100;
            income < 0.01 ? html += '不足0.01元' : html += Math.floor(income * 100) / 100 + '元';
        }

        $('#expectedProfit').html(html);
    },
    //收益
    calculateEarnings: function () {
        var s = this;
        var d = s.query.detail;

        $('.profitTime').text(d.TimeLimit);
        $('.profitMoney').text(d.StartBuyPrice + "~" + d.MaxBuyPrice);

        //利率
        var l = (parseFloat(d.IncomeRate) / 100 * 1000 / 365).toFixed(4);
        //收益计算
        $('#myinput').on('input', function () {
            var v = parseFloat($(this).val());
            var n;
            if (d.ProductTypeParentId == 1) {
                //活期
                n = ((l * v) / 10000).toFixed(2);
            } else {
                //定期
                var time = d.TimeLimit;
                var t = time.slice(0, time.length - 1);
                n = ((l * v) / 10000 * t).toFixed(2)
            }
            if (isNaN(n) || n < 0.01) {
                $('.profitNum').text('不足0.01');
            } else {
                $('.profitNum').text(n);
            }
        });
        //到期收益
        $('.amountInput').on('input', function (e) {
            var option = s.option;
            var v = parseFloat($(this).val());
            var j = 0;
            //加息劵
            if (option.length > 0) {
                for (var i = 0; i < option.length; i++) {
                    if (option[i].cT == "2") {
                        j = parseFloat(option[i].cV);
                        break;
                    }
                }
            }
            //利率
            var l = ((parseFloat(d.IncomeRate) + j) / 100 * 1000 / 365).toFixed(4);
            var n;
            if (d.ProductTypeParentId == 1) {
                //活期
                n = ((l * v) / 10000).toFixed(2);
            } else {
                //定期
                var t = d.RemainDays;
                n = ((l * v) / 10000 * t).toFixed(2)
            }
            if (isNaN(n) || n < 0.01) {
                $('.itemNum').text('0.00元');
            } else {
                $('.itemNum').text(n + "元");
            }
        })
    },
    checkUserInfo: function () {
        var flag = false;
        if (window.user) {
            if (user.isLogin) {
                flag = true;
                if (user.isAuthen == 0) {
                    layer.open({
                        content: '为保障资金安全，请先完善实名认证信息'
                        , btn: ['确定', '取消']
                        , yes: function (index) {
                            location.href = '../my/bindcard.html';
                            layer.close(index);
                        }
                    });
                    return;
                }
                if (!user.hasPaypwd) {
                    layer.open({
                        content: '请先设置支付密码'
                        , btn: ['确定', '取消']
                        , yes: function (index) {
                            location.href = '../user/pwd-manager.html';
                            layer.close(index);
                        }
                    });
                    return;
                }
            }
        }
        return flag;
    },
    checkAmount: function () {
        var me = this
            , detail = me.query.detail
            , ele = $('.amountInput')
            , info = me.query.detail
            , match = /^[0-9]*$/
            , amount = ele.val();

        if (!match.test(amount)) {
            amount = amount.substring(0, amount.length - 1);
        }
        if (amount > detail.RemainingShares) {
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
            if (amount < info.StartBuyPrice) {
                // 购买金额低于起投金额
                layer.open({
                    content: '最低' + info.StartBuyPrice + '元起投'
                    , skin: 'msg'
                    , time: 2
                });
                return false;
            } else {
                if (amount > user.balance) {
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
    }
}

$(function () {
    fjw.webapp.pro_detail.init();
})