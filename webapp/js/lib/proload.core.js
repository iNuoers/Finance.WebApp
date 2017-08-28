'use strict';

/**
 * 图片预加载
 */
(function () {
    /**
     * 
     * @param {*} imgs  图片数组
     * @param {*} option 参数
     */
    function preLoad(imgs, options) {
        // 如果传入是字符串 直接转换为数组
        this.imgs = (typeof imgs === 'string') ? [imgs] : imgs;
        this.opts = $.extend({}, preLoad.default, options);

        this._unoredered();
    }

    preLoad.default = {
        // 每一张图片加载完毕后执行
        each: null,
        // 所有图片加载完毕执行
        all: null
    };

    // 无序加载
    preLoad.prototype._unoredered = function () {
        var imgObj = new Image();
        var imgs = this.imgs,
            opts = this.opts,
            count = 0,
            len = imgs.length;

        $.each(imgs, function (i, src) {
            if (typeof src != 'string') return;

            $(imgObj).on('load error', function () {
                opts.each && opts.each(count);

                if (count >= len - 1) {
                    opts.all && opts.all();
                }

                count++;
            });

            imgObj.src = src;
        });
    };

    $.extend({
        preload: function (imgs, opts) {
            new preLoad(imgs, opts);
        }
    });

})(jQuery);