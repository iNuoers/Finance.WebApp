'use strict'
require('css_path/product/product_detail.css');

var _api = require('js_path/lib/f.data.js')
var _util = require('js_path/lib/f.utils.js')
var _core = require('js_path/lib/f.core.js')
var _u = require('js_path/service/user-service.js')
var _p = require('js_path/service/product-service.js')
var _t = require('plugins/template/template.js')
var layer = require('plugins/layer/layer.js')

fjw.webapp.pro_detail = {
    cache: {
        pro_detail: null
    },
    query: {
        id: _util.Tools.getUrlParam('id'),
        firstBuy: true,
        detail: null
    },
    productId: 0,//当前产品ID
    //当前在用卡劵内容
    option: [

    ],
    init: function () {
        this.onLoad();
    },
    onLoad: function () {
        var _this = this;

        //that.productId = id;
        if (Number(_this.query.id) > 0) {
            _this.initDetail();

            //得到当前已在用卡劵内容
            _this.getCardParam();
        }

    },
    getCardParam: function () {
        var that = this;

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
        console.log(that.option);
    },
    listenEvent: function () {
        var _this = this;

        $('.amountInput').on('keyup blue', function () {
            _this.initIncome();
        });

        $('.max-money').click(function () {

            var flag = _this.checkUserInfo();

            if (flag) {
                var _detail = _this.query.detail,
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

                _this.checkAmount();
                _this.initIncome();
            } else {
                _core.doLogin(window.location.href);
            }
        });
        $('.calculator').click(function () {
            _this.calculator();
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

            var amount = $('.amountInput').val()
                , u = _this.checkUserInfo()
                , a = _this.checkAmount();
            amount = Number(amount).toFixed(2);

            if (u && a) {
                window.location.href = './confirm.html?id=' + _this.query.id + '&amount=' + amount + '&coupon_type=' + 'coupon_id=';
            }

            // if (!window.user.isLogin) {
            //     window.location.href = '../login.html?redirect=' + encodeURIComponent(window.location.href);
            //     return;
            // }

            // var v = $.trim($('.amountInput').val());
            // if (v == "" || v < that.cache.pro_detail.StartBuyPrice) {
            //     layer.open({
            //         content: '请输入购买金额'
            //         , skin: 'msg'
            //         , time: 2
            //     });
            //     $('.amountInput').focus();
            //     return;
            // }
            // //提交投资
            // //console.log(that.option);
            // if (that.option.length > 0) {
            //     var d = '';
            //     for (var i = 1; i <= that.option.length; i++) {
            //         var h = '&cT' + i + '=' + that.option[i - 1].cT + '&cId' + i + "=" + that.option[i - 1].cId + '&cV' + i + "=" + that.option[i - 1].cV;
            //         d += h;
            //     }
            //     window.location.href = './confirm.html?id=' + that.productId + "&val=" + v + d;
            // } else {
            //     window.location.href = './confirm.html?id=' + that.productId + "&val=" + v;
            // }
        });

        //更多卡劵
        $('.other-card').click(function (e) {
            if (that.option.length > 0) {
                var d = '';
                for (var i = 0; i < that.option.length; i++) {
                    var h = '&cT' + i + '=' + that.option[i].cT + '&cId' + i + "=" + that.option[i].cId;
                    d += h;
                }
                window.location.href = '../my/othercard.html?productId=' + that.productId + d;
            } else {
                window.location.href = '../my/othercard.html?productId=' + that.productId;
            }
        })
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
        var _this = this;

        if (_util.storage.getItem($.base64.btoa('f.token')) != null) {
            _u.getUserInfo(JSON.stringify({
                M: _api.method.getMemberInfo,
            }), function (json) {
                var user = JSON.parse(json);

                _core.setUserInfo(user);

                _this.getDetail();

            }, function () {
                _core.setUserInfo();
                _this.getDetail();
            });
        } else {
            _this.getDetail();
        }
    },
    getDetail: function () {
        var _this = this;

        var param = {
            M: _api.method.productDetail,
            D: JSON.stringify({
                'ProductId': _this.query.id
            })
        };

        _p.getDetail(JSON.stringify(param), function (json) {
            var data = JSON.parse(json), html = '';
            var tpl = require('../../../view/product/detail.string');

            _this.query.detail = JSON.parse(json);

            html = _t(tpl, data);

            $('#m-header-nav h1').text(data.Title);
            $('.app-main').html(html);

            _this.renderProgress();
            _this.listenEvent();

            //渲染当前在用卡券
            if (_this.option.length > 0) {
                //排序,现金劵在前
                _this.option.sort(function (a, b) {
                    return a.cT - b.cT
                });
                _this.renderCurrentCard();
                _this.calculateEarnings();
            }

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
        var _this = this
            , val = $('.amountInput').val()
            , html = ''
            , income = 0;

        if (_this.query.detail.ProductTypeParentId == 2) {
            income = val * _this.query.detail.RemainDays / 365 * (_this.query.detail.IncomeRate) / 100
            html += income.toFixed(2) + '元';
        } else {
            income = val * 1 / 365 * _this.query.detail.IncomeRate / 100;
            income < 0.01 ? html += '不足0.01元' : html += Math.floor(income * 100) / 100 + '元';
        }

        $('#expectedProfit').html(html);
    },
    //收益
    calculateEarnings: function () {
        var s = this;
        var d = s.data;

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
            //console.log(n);
        });
        //到期收益
        $('.amountInput').on('input', function (e) {
            var option = s.option;
            var v = parseFloat($(this).val());
            var j = 0;
            //console.log(option);
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
                //console.log(t);
                n = ((l * v) / 10000 * t).toFixed(2)
            }
            if (isNaN(n) || n < 0.01) {
                $('.itemNum').text('0.00元');
            } else {
                $('.itemNum').text(n + "元");
            }
            //console.log(n);
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
                            location.href='../my/bindcard.html';
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
                            location.href='../user/pwd-manager.html';
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
        var _this = this
            , detail = _this.query.detail
            , ele = $('.amountInput')
            , info = _this.query.detail
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