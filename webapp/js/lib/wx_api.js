'use strict'

var wechat = {
    options: {
        isWxJsSDK: false,
        csrf_url: (window.location.href.indexOf('#') == -1 ? window.location.href : window.location.href.substring(0, window.location.href.indexOf('#'))),
        url: 'https://webapp.fangjinnet.com',
        title: '房金网',
        desc: '房金网_微信版',
        img_url: '',
        isHideshare: false,
        async: true,
        debug: false,
        shareCallBack: function (pa) { },
        hideShareBtnCallBack: function (res) { },
        beforeShareCall: function (res) { }
    },
    callBack: function (json) {
        wx.config({
            debug: wechat.options.debug,
            appId: json.appid,
            timestamp: json.timeStamp,
            nonceStr: json.nonceStr,
            signature: json.signature,
            jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'hideMenuItems',
                'showMenuItems',
                'hideOptionMenu',
                'showOptionMenu'
            ]
        });
    },
    getUrlParam: function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var result = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    }
};

wx.ready(function () {
    // 隐藏显示分享按钮
    if (wechat.options.isHideshare) {
        wx.hideMenuItems({
            menuList: [
                'menuItem:share:appMessage', // 分享给好友
                'menuItem:share:timeline', // 分享到朋友圈
                'menuItem:share:weibo', //分享到微博
                'menuItem:share:qq', //分享到QQ
                'menuItem:share:QZone', //分享到 QQ 空间
                'menuItem:copyUrl' // 复制链接
            ],
            success: function (res) {
                wechat.options.hideShareBtnCallBack(res);
            },
            fail: function (res) {
                alert(JSON.stringify(res));
            }
        });
    } else {
        wx.showMenuItems({
            menuList: [
                'menuItem:share:appMessage', // 分享给好友
                'menuItem:share:timeline', // 分享到朋友圈
                'menuItem:share:weibo', //分享到微博
                'menuItem:share:qq', //分享到QQ
                'menuItem:share:QZone', //分享到 QQ 空间
                'menuItem:copyUrl' // 复制链接
            ],
            success: function (res) {
                alert('已显示“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
            },
            fail: function (res) {
                alert(JSON.stringify(res));
            }
        });
    }
    // 分享到朋友圈
    wx.onMenuShareTimeline({
        title: wxData.desc,
        link: wxData.url,
        imgUrl: wxData.img_url,
        trigger: function (res) {
            wxData.BeforeShareCall("wxtimeline");
            if (wxData.async) {
                this.title = wxData.desc;
                this.link = wxData.url;
                this.imgUrl = wxData.img_url;
            }
        },
        success: function () {
            wxData.ShareCallBack("success");
        },
        cancel: function () {
            wxData.ShareCallBack("cancel");
        }
    });
    // 发送给好友
    wx.onMenuShareAppMessage({
        title: wxData.title,
        desc: wxData.desc,
        link: wxData.url,
        imgUrl: wxData.img_url,
        type: '',
        dataUrl: '',
        trigger: function (res) {
            wxData.BeforeShareCall("wxfriend");
            if (wxData.async) {
                this.title = wxData.title;
                this.desc = wxData.desc;
                this.link = wxData.url;
                this.imgUrl = wxData.img_url;
            }
        },
        success: function () {
            wxData.ShareCallBack("success");
        },
        cancel: function () {
            wxData.ShareCallBack("cancel");
        }
    });

    // 分享到QQ
    wx.onMenuShareQQ({
        title: wxData.title,
        desc: wxData.desc,
        link: wxData.url,
        imgUrl: wxData.img_url,
        trigger: function (res) {
            wxData.BeforeShareCall("qq");
            if (wxData.async) {
                this.title = wxData.title;
                this.desc = wxData.desc;
                this.link = wxData.url;
                this.imgUrl = wxData.img_url;
            }
        },
        success: function () {
            wxData.ShareCallBack("success");
        },
        cancel: function () {
            wxData.ShareCallBack("cancel");
        }
    });

    // 分享到腾讯微博
    wx.onMenuShareWeibo({
        title: wxData.title,
        desc: wxData.desc,
        link: wxData.url,
        imgUrl: wxData.img_url,
        trigger: function (res) {
            wxData.BeforeShareCall("qqweibo");
            if (wxData.async) {
                this.title = wxData.title;
                this.desc = wxData.desc;
                this.link = wxData.url;
                this.imgUrl = wxData.img_url;
            }
        },
        success: function () {
            wxData.ShareCallBack("success");
        },
        cancel: function () {
            wxData.ShareCallBack("cancel");
        }
    });

    // 分享到QQ空间
    wx.onMenuShareQZone({
        title: wxData.title, // 分享标题
        desc: wxData.desc, // 分享描述
        link: wxData.url, // 分享链接
        imgUrl: wxData.img_url, // 分享图标
        trigger: function (res) {
            wxData.BeforeShareCall("qqzone");
            if (wxData.async) {
                this.title = wxData.title;
                this.desc = wxData.desc;
                this.link = wxData.url;
                this.imgUrl = wxData.img_url;
            }
        },
        success: function () {
            wechat.options.shareCallBack('success');
        },
        cancel: function () {
            wechat.options.shareCallBack('cancel')
            wxData.ShareCallBack("cancel");
        }
    });
});

wx.error(function (res) {
    if (wechat.options.debug) {
        alert("授权错误:" + res);
    }
});

$(function () {
    var wxcode = wechat.getUrlParam("code");

    if (wechat.isWxJsSDK) {
        $.ajax({
            url: 'https://a.fangjinnet.com:10080/Wechat/jsconfig',
            data: {
                url: wechat.options.csrf_url
            },

            crossDomain: true,
            success: function (res) {
                if (!res.success) {
                    return;
                }
            }
        })
    } else {
        wx.hideOptionMenu();
    }
});

