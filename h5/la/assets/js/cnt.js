$(function () {
    //get uuid
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    function UUID(len, radix) {
        var chars = CHARS, uuid = [], i;
        radix = radix || chars.length;

        if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            var r;

            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    }

    //get cookie;
    var arr = document.cookie.match(new RegExp("(^| )UUID=([^;]*)(;|$)"));
    var uuid = (arr != null) ? unescape(arr[2]) : '';
    var ref = escape(document.referrer);
    var url = escape(window.location.href);

    //set cookie
    function SetCookie_UUID(name, value) {
        var now = new Date();
        var time = now.getTime();
        // Valid for 2 hours
        time += 3600 * 24 * 30 * 1000;
        now.setTime(time);
        document.cookie = name + "=" + value + '; expires=' + now.toUTCString() + ';path=/';
    }
    if(!uuid){
        uuid = UUID();
        SetCookie_UUID("UUID", uuid);
    }
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", "http://www.fnying.com/php/cnt_action.php?referrer=" + ref + "&url=" + url + "&uuid=" + uuid, true);
    xmlhttp.send();
});