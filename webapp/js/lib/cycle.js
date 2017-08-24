(function ($) {
    $.fn.svgCircle = function (opt) {
        opt = $.extend({
            parent: null,
            W: 110,
            R: 30,
            sW: 20,
            color: ['#000', '#000'],
            perent: [110, 110],
            speed: 0,
            delay: 500
        }, opt);

        return this.each(function () {
            var e = opt.parent;
            if (!e) return false;

            var w = opt.W;
            var r = Raphael(e, w, w),
                R = opt.R,
                init = true,
                param = {
                    stroke: '#1E89E0'
                },
                hash = document.location.hash,
                markAttr = {
                    fill: hash || '#444',
                    stroke: 'none'
                };
            r.customAttributes.arc = function (b, c, R) {
                var d = 360 / c * b,
                    a = (90 - d) * Math.PI / 180,
                    x = w / 2 + R * Math.cos(a),
                    y = w / 2 - R * Math.sin(a),
                    color = opt.color,
                    path;
                if (c == b) {
                    path = [
                        ["M", w / 2, w / 2 - R],
                        ["A", R, R, 0, 1, 1, w / 2 - 0.01, w / 2 - R]
                    ]
                } else {
                    path = [
                        ["M", w / 2, w / 2 - R],
                        ["A", R, R, 0, +(d > 180), 1, x, y]
                    ]
                }
                return {
                    path: path
                }
            };
            var f = r.path().attr({
                stroke: "#e5e5e5",
                "stroke-width": opt.sW
            }).attr({
                arc: [100, 100, R]
            });
            var g = r.path().attr({
                stroke: "#ff0000",
                "stroke-width": opt.sW
            }).attr(param).attr({
                arc: [0.01, opt.speed, R]
            });
            var h;
            if (opt.perent[1] > 0) {
                setTimeout(function () {
                    g.animate({
                        stroke: opt.color[1],
                        arc: [opt.perent[1], 100, R]
                    }, 900, ">")
                }, opt.delay)
            } else {
                g.hide()
            }
        })
    }
})(jQuery);
$(function () {
    var c = $('.item_charts.on');
    animateEle();
    $(window).scroll(function () {
        c = $('.item_charts.on');
        animateEle();
    });
});
function animateEle() {
    var c = $('.item_charts.on');
    var b = {
        top: $(window).scrollTop(),
        bottom: $(window).scrollTop() + $(window).height()
    };
    c.each(function () {
        if (b.top <= $(this).offset().top && b.bottom >= $(this).offset().top && !$(this).data('bPlay')) {
            $(this).data('bPlay', true);
            var a = $(this).find('span').text().replace(/\%/, '');
            $(this).svgCircle({
                parent: $(this)[0],
                w: 110,
                R: 47,
                sW: 6,
                color: ["#3080ec", "#3080ec", "#3080ec"],
                perent: [100, a],
                speed: 150,
                delay: 400
            })
        }
    })
}
var pie = {
    run: function (a) {
        if (!a.id) throw new Error("must be canvas id.");
        var b = document.getElementById(a.id),
            ctx;
        if (b && (ctx = b.getContext("2d"))) {
            b.width = b.height = "100";
            var c = function () { };
            var d = a.onBefore || c;
            var e = a.onAfter || c;
            d(ctx);
            ctx.fillStyle = a.color || '#ff0000';
            var f = a.step || 1;
            var g = a.delay || 10;
            var i = 0,
                rage = 360 * (a.percent || 0);
            var h = -Math.PI * 0.5;
            var j = function () {
                i = i + f;
                if (i <= rage) {
                    ctx.beginPath();
                    ctx.moveTo(100, 100);
                    ctx.arc(100, 100, 100, h, Math.PI * 2 * (i / 360) + h);
                    ctx.fill();
                    setTimeout(j, g)
                } else {
                    e(ctx)
                }
            };
            j()
        }
    }
};
module.exports = animateEle;