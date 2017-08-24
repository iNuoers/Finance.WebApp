/**
 * Created by PC on 2017/8/23.
 */
require('../css/my_bills.css');

fjw.webapp.bills = {
    init : function () {
        this.addEventList()
    },
    addEventList : function () {
        $('.bills-r').on('click',function (e) {
            if($(this).text() == '筛选'){
                $(this).text('取消');
                $('.bills-zhezhao').show();
                $('.bills-screening').show();
                $(".bills-screening").animate({top:'49px'});
                window.addEventListener('touchmove',moveD);
            }else {
                $(this).text('筛选');
                $(".bills-screening").animate({top:'-20px'},200,function () {
                    $('.bills-zhezhao').hide();
                    $('.bills-screening').hide();
                });
                window.removeEventListener('touchmove',moveD);
            }
        });
        function moveD(e) {
            e.preventDefault();
        }

        $('.bills-screening li').unbind('click').bind('click',function (e) {
            $(this).siblings('li').removeClass('bills-screening-active');
            $(this).addClass('bills-screening-active');
            console.log($(this).index());
        })
    }

};

$(function () {
    fjw.webapp.bills.init();
});