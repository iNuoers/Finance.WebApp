'use strict'

var _f = require('./lib/app.js')
var tid = _f.Tools.getUrlParam('tid'), pid = _f.Tools.getUrlParam('pid')

if (pid == 1 || tid == 9) {
    $('.current').removeClass('f-hide');
} else {
    $('.invest').removeClass('f-hide');
}