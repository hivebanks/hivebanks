$(function () {
    //导航切换样式
    $('#main-menu .waves-dark').click(function () {
        $(this).addClass('active-menu').parent().siblings().children('a').removeClass('active-menu');
        $(this).siblings('.nav-second-level').slideToggle();
        $(this).parent().siblings().children('.nav-second-level').slideUp();
    });
    $('.childMenu').click(function () {
        $(this).siblings('.nav-third-level').slideToggle('fast');
    });

    //隐藏导航
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

//获取基准类型
// function BaseCurrency() {
//     var base_currency = GetCookie('base_currency');
//     $('.base_currency').text(base_currency);
// }

// 图标链接
var link = $('<link rel="stylesheet" href="//at.alicdn.com/t/font_814072_a7eq7eitjun.css">');
link.appendTo($('head')[0]);

//layer提示
function LayerFun(type) {
    layer.msg('<span class="i18n" name="'+ type +'"></span>');
    execI18n();
}

/**
 * 初始化页面loading加载
 * */
window.onload = function () {
    if (document.readyState === 'complete') {
        var loading = document.querySelector(".preloader-wrapper");
        loading.classList.remove('active');
    }
};

//email地址
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

//数据获取为空
function GetDataEmpty(element, num) {
    var tr = '';
    tr = '<tr>' +
        '<td colspan="'+ num +'" style="line-height: unset!important;"><i class="iconfont icon-noData" style="font-size: 10rem"></i></td>' +
        '</tr>';
    $('#' + element).html(tr);
    return;
}

//数据获取失败
function GetDataFail(element, num) {
    var tr = '';
    tr = '<tr>' +
        '<td colspan="'+ num +'" style="line-height: unset!important;"><i class="iconfont icon-loadFai" style="font-size: 10rem"></i></td>' +
        '</tr>';
    $('#' + element).html(tr);
}

//退出
$('.logOut').click(function () {
    DelCookie('la_token');
    window.location.href = 'login.html';
});