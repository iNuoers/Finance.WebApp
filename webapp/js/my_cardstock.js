/**
 * Created by PC on 2017/8/24.
 */
require('../css/my_cardstock.css');

fjw.webapp.cardstock = {
    init : function () {
        this.addEventList();
    },
    addEventList : function () {
        $('.m-product-menu .m-menu-item').unbind('click').bind('click',function (e) {
            var target = $(this).data("target");
            $('.m-product-menu div').removeClass('active');
            $(this).children('div').addClass('active');

            console.log(target);
        })
    }
};

$(function () {
    fjw.webapp.cardstock.init();
});