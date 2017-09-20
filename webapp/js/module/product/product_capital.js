'use strict'

var _util = require('js_path/lib/f.utils.js')
var tid = _util.Tools.getUrlParam('tid'), pid = _util.Tools.getUrlParam('pid')

if (pid == 1 || tid == 9) {
    $('.current').removeClass('f-hide');
} else {
    $('.invest').removeClass('f-hide');
}