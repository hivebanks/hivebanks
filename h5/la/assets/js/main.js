$(function () {
    //nav toggle style
    $('#main-menu .waves-dark').click(function () {
        $(this).addClass('active-menu').parent().siblings().children('a').removeClass('active-menu');
        $(this).siblings('.nav-second-level').slideToggle();
        $(this).parent().siblings().children('.nav-second-level').slideUp();
    });
    $('.childMenu').click(function () {
        $(this).siblings('.nav-third-level').slideToggle('fast');
    });

    //hide nav
    $(".dropdown-button").dropdown();
    $("#sideNav").click(function () {
        if ($(this).hasClass('closed')) {
            $('.navbar-side').animate({left: '0px'});
            $(this).removeClass('closed');
            $('#page-wrapper').animate({'margin-left': '260px'});
        }
        else {
            $(this).addClass('closed');
            $('.navbar-side').animate({left: '-260px'});
            $('#page-wrapper').animate({'margin-left': '0px'});
        }
    });
});

// Icon link
var link = $('<link rel="stylesheet" href="//at.alicdn.com/t/font_626151_unhf9sd8sf.css">');
link.appendTo($('head')[0]);

//cnt.js
var cnt = $("<script src='../assets/js/cnt.js'></script>");
cnt.appendTo($("head"));

//layer prompt
function LayerFun(type) {
    if (type == "114") {
        window.location.href = "login.html";
        return;
    }
    layer.msg('<span class="i18n" name="' + type + '"></span>');
    execI18n();
}

/**
 * Initialization page loading loading
 * */
window.onload = function () {
    if (document.readyState === 'complete') {
        var loading = document.querySelector(".preloader-wrapper");
        loading.classList.remove('active');
    }
};

function GetLaNameCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) {
        return unescape(arr[2]);
    } else {
        return null;
    }
}

$('.la_name').text(GetLaNameCookie('la_name'));

//email address
function EmailList() {
    var emailList = {
        'qq.com': 'http://mail.qq.com',
        'google.com': 'http://mail.google.com',
        'sina.com': 'http://mail.sina.com.cn',
        '163.com': 'http://mail.163.com',
        '126.com': 'http://mail.126.com',
        'yeah.net': 'http://www.yeah.net/',
        'sohu.com': 'http://mail.sohu.com/',
        'tom.com': 'http://mail.tom.com/',
        'sogou.com': 'http://mail.sogou.com/',
        '139.com': 'http://mail.10086.cn/',
        'hotmail.com': 'http://www.hotmail.com',
        'live.com': 'http://login.live.com/',
        'live.cn': 'http://login.live.cn/',
        'live.com.cn': 'http://login.live.com.cn',
        '189.com': 'http://webmail16.189.cn/webmail/',
        'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
        'yahoo.cn': 'http://mail.cn.yahoo.com/',
        'eyou.com': 'http://www.eyou.com/',
        '21cn.com': 'http://mail.21cn.com/',
        '188.com': 'http://www.188.com/',
        'foxmail.com': 'http://www.foxmail.com'
    };
    return emailList;
}

//Data acquisition is empty
function GetDataEmpty(element, num) {
    var tr = '';
    tr = '<tr>' +
        '<td colspan="' + num + '" style="line-height: unset!important;"><i class="iconfont icon-noData" style="font-size: 10rem"></i></td>' +
        '</tr>';
    $('#' + element).html(tr);
    return;
}

//Data acquisition failed
function GetDataFail(element, num) {
    var tr = '';
    tr = '<tr>' +
        '<td colspan="' + num + '" style="line-height: unset!important;"><i class="iconfont icon-loadFai" style="font-size: 10rem"></i></td>' +
        '</tr>';
    $('#' + element).html(tr);
}

//退出
$('.logOut').click(function () {
    DelCookie('la_token');
    window.location.href = 'login.html';
});