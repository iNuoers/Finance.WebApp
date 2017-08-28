'use strict'

var countdown = function (ele, text, callback) {
    var countClock = function (time) {
        time = parseInt(time);
        var daysSecond = 86400, // 一天的秒数
            hoursSecond = daysSecond / 24,
            minuteSecond = hoursSecond / 60,
            str = "";

        if (time > 0) {
            var sec = zero(time % 60) + '秒';
            var min = Math.floor((time / 60)) > 0 ? zero(Math.floor((time / 60)) % 60) + '分' : "";
            var hour = Math.floor((time / 3600)) > 0 ? Math.floor((time / 3600)) % 24 + '时' : "";
            var day = Math.floor((time / 86400)) > 0 ? Math.floor((time / 86400)) % 30 + '天' : "";

            str = day + hour + min + sec;
        }
        return str;
    };
    var zero = function (n) {
        var n = parseInt(n, 10);
        if (n > 0) {
            if (n <= 9) {
                n = "0" + n;
            }
            return String(n);
        } else {
            return "00";
        }
    }
    var countRemainTime = function () {
        $(ele).each(function () {
            var cdTime = $(this).attr("data-conutdown");
            if (cdTime >= 0) {
                var timeString = countClock(cdTime) + text;
                if (cdTime === 0) {
                    callback();
                } else {
                    $(this).html(timeString);
                    $(this).attr("data-conutdown", cdTime - 1);
                }
            }
        });
    }
    countRemainTime();
    window.setInterval(function () {
        countRemainTime();
    }, 1000);
    return this;
};

function prefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}

module.exports = {
    time: function (time) {
        var hh = parseInt(time / 1000 / 60 / 60); //时
        var mm = parseInt(time / 1000 / 60 % 60); //分
        var ss = parseInt(time / 1000 % 60); //秒

        if (hh < 100) {

            hh = prefixInteger(hh, 2);
        }

        return hh + ":" + prefixInteger(mm, 2) + ":" + prefixInteger(ss, 2);
    },
    countdown: countdown
}