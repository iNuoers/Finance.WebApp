/*
* @Author: mr.ben(66623978) https://github.com/iNuoers/
* @Date:   2017-09-12 12:03:17
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-12-06 16:59:48
*/
'use strict';

var debug = false;
var api = {
    url: debug ? 'http://192.168.1.53:3002/dist/view/' : 'http://192.168.1.53:3002/dist/view/',
    host: debug ? 'http://192.168.1.5:8081/api' : 'https://api.fangjinnet.com:1000/api',
    method: {
        // 首页数据
        homeData: "AppHomeData",
        // 产品列表
        productList: "ProductList",
        // 产品详情
        productDetail: "ProductDetail",
        // 产品购买记录
        productBuyRecord: "BuyRecord",
        // 产品购买排行榜
        productBuyRank: "ProductBuyRank",
        // 产品类型
        productTypeList: "GetProductTypes",

        //某产品可用的卡券列表
        productCouponList: "ProductCouponList",

        // 活动列表
        activityList: "NewActivityList",

        // 帮助类别
        getHelpType: "GetHelpType",
        // 帮助中心
        helpCenterList: "HelpCenterListForPC",

        // 我的好友
        getFriendList: "GetFriendList",

        // 用户信息
        getMemberInfo: "GetMemberInfo",

        // 获取总账户资产
        getWalletAssets: "GetWalletAssets",
        //获取我的卡券总数量
        getAbleCouponList: "GetAbleCouponList",

        //获取账单类型
        getBillTypeList: "GetBillTypeList",
        //获取我的账单总数据
        getTotalBillData: "GetTotalBillData",
        //获取当月账单数据
        getBillDataList: "GetBillDataList",
        //获取账单详细界面数据
        billDetail : "BillDetail",

        //生成充值定单
        recharge: "Recharge",

        // 公告类别
        noticeList: "NoticePcList",

        // 用户消息
        messageList: "MemberMessageList",

        // 银行限额列表
        bankList: "GetBankTypeList",

        login: 'Login',

        //注册会员
        regist: 'Regist',

        modifyAddr: 'ModifyAddr',

        //获取银行列表
        getBankTypeList: "GetBankTypeList",

        //根据输入的银行卡号获取银行信息
        bankInfo: 'BankInfo',

        //查询银行支行信息
        bankBranchInfo: "BankBranchInfo",

        //实名认证
        realName: "RealName",

        //实名认证和帮卡
        bankCardBind: "BankCardBind",

        //获取短信验证码
        getVCode: 'GetVCode',

        //帮助中心问题查询
        helpCenterListForPC: 'HelpCenterListForPC',

        //查询帮助中心热词
        getHelpHotKey: 'GetHelpHotKey',

        //修改密码
        modifyLoginPswd:"ModifyLoginPswd",

        //设置交易密码
        resetTradePswd:"ResetTradePswd",

        //交易交易密码
        forgetTradePswd:"ForgetTradePswd",
        
        // 问题是否解决了
        helperSetEffective:'HelperSetEffective',

        buy:"Buy"



    }
}
module.exports = api
