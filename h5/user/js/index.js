$(function () {
    var login_us = GetQueryString('user');
    var login_ba = GetQueryString('ba');
    var login_ca = GetQueryString('ca');

    function GetIndexCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    }

    var user_token = GetIndexCookie('user_token');
    var ba_token = GetIndexCookie('ba_token');
    var ca_token = GetIndexCookie('ca_token');

    if (user_token || login_us) {
        $('.create_btn, .usLogin').remove();
        $('.accountNone').removeClass('accountNone');
    }
    $('.baLogin').click(function () {
        if (ba_token || login_ba) {
            window.location.href = 'ba/BaAccount.html';
        } else {
            window.location.href = 'ba/BaLogin.html';
        }
    });
    $('.caLogin').click(function () {
        if (ca_token || login_ca) {
            window.location.href = 'ca/CaAccount.html';
        } else {
            window.location.href = 'ca/CaLogin.html';
        }
    });
    $('.usLogin').click(function () {
        if (user_token || login_us) {
            window.location.href = 'user/account.html';
        } else {
            window.location.href = 'user/login.html';
        }
    });

    $('.toAccountBtn').click(function () {
        if (login_us || user_token) {
            window.location.href = 'user/account.html';
        }
        if (login_ba && ba_token) {
            window.location.href = 'ba/BaAccount.html';
        }
        if (login_ca && ca_token) {
            window.location.href = 'ca/CaAccount.html';
        }
    });

    var smokyBG = $('#smoky-bg').waterpipe({
        gradientStart: '#51ff00',
        gradientEnd: '#001eff',
        smokeOpacity: 0.1,
        smokeSize: 100,
        numCircles: 1,
        maxMaxRad: 'auto',
        minMaxRad: 'auto',
        minRadFactor: 0,
        iterations: 8,
        drawsPerFrame: 10,
        lineWidth: 2,
        speed: 10,
        bgColorInner: "#111",
        bgColorOuter: "#000"
    });
});
