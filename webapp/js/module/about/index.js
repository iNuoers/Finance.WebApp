/*
 * @Author: mr.ben (肖工)  
 * @QQ：66623978 
 * @Github：https://github.com/iNuoers/ 
 * @Create time: 2017-11-07 09:57:23 
 * @Last Modified by: mr.ben
 * @Last Modified time: 2017-11-07 10:08:17
 */

'use strict'
require('css_path/about/about.css')

fjw.webapp.about = {
	init: function () {
		this.onPageLoad()
		this.listenEvent()
	},
	onPageLoad: function () {
		$(".year .list").each(function (e, target) {
			var $target = $(target),
				$ul = $target.find("ul");
			$target.height($ul.outerHeight()), $ul.css("position", "absolute");
		});
	},
	listenEvent: function () {
		$(".year>h2>a").click(function (e) {
			e.preventDefault();
			$(this).parents(".year").toggleClass("close");
		});
	}
}
fjw.webapp.about.init()