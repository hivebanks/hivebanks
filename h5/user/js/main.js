$(function () {
    //notice
    $(".msg-row").click(function () {
        $(".jt").toggleClass("active");
        $(".msg-content").slideToggle();
    });
    //back index
    function getCurrentPath() {
        //获取当前网址
        var curWwwPath = window.document.location.href;
        //获取主机地址之后的目录
        var pathName = window.document.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        //获取主机地址
        var localhostPath = curWwwPath.substring(0, pos);
        //获取带"/"的项目名
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        return projectName;
    }
    $('.toIndexBtn').click(function () {
        var type = getCurrentPath();
        if(type == '/user'){
            window.location.href = 'index.html?user';
        }else if(type == '/ba'){
            window.location.href = 'index.html?ba';
        }else if(type == '/ca'){
            window.location.href = 'index.html?ca';
        }
    });
//    get time
    var time = new Date().toLocaleString('chinese', {hour12: false});
    $(".time").text(time);

// 图标链接
    var link = $('<link rel="stylesheet" href="//at.alicdn.com/t/font_626151_unhf9sd8sf.css">');
    link.appendTo($('head')[0]);

// 密码强度验证
    $('#emailPass').keyup(function () {
        $('.email-pw-strength').css('display', 'block');
        var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
        var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
        var enoughRegex = new RegExp("(?=.{6,}).*", "g");

        if (false == enoughRegex.test($(this).val())) {
            $('.emailRegisterBox #emailLevel').removeClass('pw-weak');
            $('.emailRegisterBox #emailLevel').removeClass('pw-medium');
            $('.emailRegisterBox #emailLevel').removeClass('pw-strong');
            $('.emailRegisterBox #emailLevel').addClass(' pw-defule');
            //密码小于六位的时候，密码强度图片都为灰色
        }
        else if (strongRegex.test($(this).val())) {
            $('.emailRegisterBox #emailLevel').removeClass('pw-weak');
            $('.emailRegisterBox #emailLevel').removeClass('pw-medium');
            $('.emailRegisterBox #emailLevel').removeClass('pw-strong');
            $('.emailRegisterBox #emailLevel').addClass(' pw-strong');
            //密码为八位及以上并且字母数字特殊字符三项都包括,强度最强
        }
        else if (mediumRegex.test($(this).val())) {
            $('.emailRegisterBox #emailLevel').removeClass('pw-weak');
            $('.emailRegisterBox #emailLevel').removeClass('pw-medium');
            $('.emailRegisterBox #emailLevel').removeClass('pw-strong');
            $('.emailRegisterBox #emailLevel').addClass('pw-medium');
            //密码为七位及以上并且字母、数字、特殊字符三项中有两项，强度是中等
        }
        else {
            $('.emailRegisterBox #emailLevel').removeClass('pw-weak');
            $('.emailRegisterBox #emailLevel').removeClass('pw-medium');
            $('.emailRegisterBox #emailLevel').removeClass('pw-strong');
            $('.emailRegisterBox #emailLevel').addClass('pw-weak');
            //如果密码为6为及以下，就算字母、数字、特殊字符三项都包括，强度也是弱的
        }
        return true;
    });

    $('#phonePass').keyup(function () {
        $('.phone-pw-strength').css('display', 'block');
        var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
        var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
        var enoughRegex = new RegExp("(?=.{6,}).*", "g");

        if (false == enoughRegex.test($(this).val())) {
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-weak');
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-medium');
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-strong');
            $('.phoneRegisterBox #phoneLevel').addClass(' pw-defule');
            //密码小于六位的时候，密码强度图片都为灰色
        }
        else if (strongRegex.test($(this).val())) {
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-weak');
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-medium');
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-strong');
            $('.phoneRegisterBox #phoneLevel').addClass(' pw-strong');
            //密码为八位及以上并且字母数字特殊字符三项都包括,强度最强
        }
        else if (mediumRegex.test($(this).val())) {
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-weak');
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-medium');
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-strong');
            $('.phoneRegisterBox #phoneLevel').addClass(' pw-medium');
            //密码为七位及以上并且字母、数字、特殊字符三项中有两项，强度是中等
        }
        else {
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-weak');
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-medium');
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-strong');
            $('.phoneRegisterBox #phoneLevel').addClass('pw-weak');
            //如果密码为6为及以下，就算字母、数字、特殊字符三项都包括，强度也是弱的
        }
        return true;
    });

//退出登录清楚cookie
    $('.logout').click(function () {
        DelCookie('user_token');
        DelCookie('us_id');
        DelCookie('us_level');
        DelCookie('re_bit_type');
        DelCookie('bit_address');
        window.location.href = '../index.html'
    });

// scroll Up
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.scrollup').fadeIn('slow');
        } else {
            $('.scrollup').fadeOut('slow');
        }
    });
    $('.scrollup').click(function () {
        $("html, body").animate({scrollTop: 0}, 1000);
        return false;
    });
});

//GetUsAccount
function GetUsAccount (){
    var us_account = GetCookie('us_account');
    $(".us_account").text(us_account);
}

//数据获取为空
function GetDataEmpty(element, num) {
    var tr = '';
    tr = '<tr>' +
        '<td colspan="' + num + '" style="line-height: unset!important;"><i class="iconfont icon-noData" style="font-size: 10rem"></i></td>' +
        '</tr>';
    $('#' + element).html(tr);
    return;
}

//数据获取失败
function GetDataFail(element, num) {
    var tr = '';
    tr = '<tr>' +
        '<td colspan="' + num + '" style="line-height: unset!important;"><i class="iconfont icon-loadFai" style="font-size: 10rem"></i></td>' +
        '</tr>';
    $('#' + element).html(tr);
}

//格式化金额
function fmoney(s, n) {
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";//更改这里n数也可确定要保留的小数位
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    var t = "";
    for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r.substring(0, 2);//保留2位小数  如果要改动 把substring 最后一位数改动就可
};

//获取手机验证码
function GetPhoneCodeFun(bind_type, $this, cfm_code) {
    //获取国家代码
    var country_code = $('.selected-dial-code').text().split("+")[1];
    var cellphone = $('#phone').val();
    if (cellphone == '') {
        LayerFun('phoneNotEmpty');
        return;
    }
    setTime($this);
    GetPhoneCode(cellphone, country_code, bind_type, cfm_code, function (response) {
        if (response.errcode == '0') {
            LayerFun('sendSuccess');
        }
    }, function (response) {
        GetImgCode();
        GetErrorCode(response.errcode);
        return;
    });
};

function setTime($this) {
    var countdown = 60;
    $('.sixty').text(countdown).fadeIn('fast').css('color', '#fff');
    $('.getCodeText').attr('name', 'sixty');
    $this.attr("disabled", true);
    execI18n();
    var timer = null;
    timer = setInterval(function () {
        if (countdown != 0) {
            countdown--;
            $('.sixty').text(countdown);
        } else {
            clearInterval(timer);
            $this.attr("disabled", false);
            $('.sixty').fadeOut('fast');
            $('.getCodeText').attr('name', 'getCode');
            execI18n();
            return;
        }
    }, 1000);
}

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

// var url = getRootPath();


//输入为空是提示
function LayerFun(type) {
    layer.msg('<span class="i18n" name="' + type + '"></span>');
    execI18n();
    return;
}

function GetUserAgent() {
    var browser = {
        versions: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {   //移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };
    if (browser.versions.mobile) {//判断是否是移动设备打开
        var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            //在微信中打开
            // alert("在微信中打开");
            return 'wx';
        }
        if (browser.versions.webApp) {
            // alert("是否webapp")
            return 'app';
        }
    } else {
        //否则就是PC浏览器
        return 'H5';
    }
}
