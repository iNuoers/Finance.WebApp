/*
* @Author: mr.ben (66623978@qq.com)
* @Date:   2017-07-21 16:35:42
* @Last Modified by:   mr.ben
* @Last Modified time: 2017-07-21 16:43:17
*/

/*-----------------百度统计-----------------*/
//到达统计
var _hmt = _hmt || [];

/* 指定要响应JS-API调用的帐号的站点id */
//_hmt.push([ '_setAccount', '6378bee553854c4dfe858f16245fa66c' ]);
// 用于发送某个指定URL的PV统计请求，通常用于AJAX页面的PV统计。
// _hmt.push(['_trackPageview', pageURL]);
// 用于触发某个事件，如某个按钮的点击，或播放器的播放/停止，以及游戏的开始/暂停等。
// _hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
// 用户访问一个安装了百度统计代码的页面时，代码会自动发送该页面的PV统计请求，如果不希望自动统计该页面的PV，就可以使用本接口。主要用于iframe嵌套页面等情况。
// _hmt.push(['_setAutoPageview', false]);
(function () {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?fcbffe97e3c81d5a930f5dc9df935da6";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();

/*-----------------CNZZ统计-----------------*/
//到达统计
//声明_czc对象:
var _czc = _czc || [];
//绑定siteid
_czc.push(["_setAccount", "1259804598"]);

var cnzz_protocol = (("https:" === document.location.protocol) ? " https://" : " http://");
(function () {
    var cnzzSTag = document.createElement("script");
    cnzzSTag.type = "text/javascript";
    cnzzSTag.async = true;
    cnzzSTag.charset = "utf-8";
    cnzzSTag.src = cnzz_protocol + "s5.cnzz.com/stat.php?id=1259804598&async=1";
    var rootS = document.getElementsByTagName("script")[0];
    rootS.parentNode.insertBefore(cnzzSTag, rootS);
})();

/*
 * 统计操作类
 * */
var statUtil = {
    trackEvent: function (eventCategory, eventAction, eventLabel, eventValue) {
        _hmt.push(['_trackEvent', eventCategory, eventAction, eventLabel, eventValue]);
    }
};