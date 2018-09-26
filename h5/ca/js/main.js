$(function () {
    //notice
    $(".msg-row").click(function () {
        $(".jt").toggleClass("active");
        $(".msg-content").slideToggle();
    });

    //back index
    $('.toIndexBtn').click(function () {
        window.location.href = '../index.html?ca=ca';
    });

//    get time
    var time = new Date().toLocaleString('chinese', {hour12: false});
    $(".time").text(time);

// Icon link
    var link = $('<link rel="stylesheet" href="//at.alicdn.com/t/font_626151_31e2mobvpdu.css">');
    link.appendTo($('head')[0]);

    //cnt.js
    var cnt = $("<script src='../assets/js/cnt.js'></script>");
    cnt.appendTo($("head"));

// Password strength verification
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
            //When the password is less than six digits, the password strength picture is gray.
        }
        else if (strongRegex.test($(this).val())) {
            $('.emailRegisterBox #emailLevel').removeClass('pw-weak');
            $('.emailRegisterBox #emailLevel').removeClass('pw-medium');
            $('.emailRegisterBox #emailLevel').removeClass('pw-strong');
            $('.emailRegisterBox #emailLevel').addClass(' pw-strong');
            //The password is eight or more and the alphanumeric special characters are included, the strongest
        }
        else if (mediumRegex.test($(this).val())) {
            $('.emailRegisterBox #emailLevel').removeClass('pw-weak');
            $('.emailRegisterBox #emailLevel').removeClass('pw-medium');
            $('.emailRegisterBox #emailLevel').removeClass('pw-strong');
            $('.emailRegisterBox #emailLevel').addClass('pw-medium');
            //The password is seven or more and there are two of the letters, numbers, and special characters. The intensity is medium.
        }
        else {
            $('.emailRegisterBox #emailLevel').removeClass('pw-weak');
            $('.emailRegisterBox #emailLevel').removeClass('pw-medium');
            $('.emailRegisterBox #emailLevel').removeClass('pw-strong');
            $('.emailRegisterBox #emailLevel').addClass('pw-weak');
            //If the password is 6 or less, even if the letters, numbers, and special characters are included, the strength is weak.
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
            //When the password is less than six digits, the password strength picture is gray.
        }
        else if (strongRegex.test($(this).val())) {
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-weak');
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-medium');
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-strong');
            $('.phoneRegisterBox #phoneLevel').addClass(' pw-strong');
            //The password is eight or more and the alphanumeric special characters are included, the strongest
        }
        else if (mediumRegex.test($(this).val())) {
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-weak');
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-medium');
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-strong');
            $('.phoneRegisterBox #phoneLevel').addClass(' pw-medium');
            //The password is seven or more and there are two of the letters, numbers, and special characters. The intensity is medium.
        }
        else {
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-weak');
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-medium');
            $('.phoneRegisterBox #phoneLevel').removeClass('pw-strong');
            $('.phoneRegisterBox #phoneLevel').addClass('pw-weak');
            //If the password is 6 or less, even if the letters, numbers, and special characters are included, the strength is weak.
        }
        return true;
    });

//Logout to clear cookies
    $('.logout').click(function () {
        DelCookie('ca_token');
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

//GetCaAccount
function GetCaAccount() {
    var ca_account = GetCookie('ca_account');
    $(".ca_account").text(ca_account);
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

//Formatted amount
function fmoney(s, n) {
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";//Change the number of n here to determine the decimal place to keep.
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    var t = "";
    for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r.substring(0, 2);//Keep 2 decimal places. If you want to change, change the last digit of substring.
};

//Get phone verification code
var timer = null;

function GetPhoneCodeFun(bind_type, $this, cfm_code) {
    //Get country code
    var country_code = $('.selected-dial-code').text().split("+")[1];
    var cellphone = $('#phone').val();
    if (cellphone == '') {
        // LayerFun('phone');
        return;
    }
    ShowLoading("show");
    GetPhoneCode(cellphone, country_code, bind_type, cfm_code, function (response) {
        if (response.errcode == '0') {
            ShowLoading("hide");
            LayerFun('sendSuccess');
        }
    }, function (response) {
        ShowLoading("hide");
        LayerFun(response.errcode);
        clearInterval(timer);
        $this.attr("disabled", false);
        $('.sixty').fadeOut('fast');
        $('.getCodeText').fadeIn("fast");
        GetImgCode();
        return;
    });
};

var countdown = 60;

function setTime($this) {
    $('.sixty').text(countdown + "s").fadeIn('fast').css('color', '#fff');
    $('.getCodeText').fadeOut("fast");
    $this.attr("disabled", true);
    timer = setInterval(function () {
        if (countdown != 0) {
            countdown--;
            $('.sixty').text(countdown + "s");
        } else {
            clearInterval(timer);
            $this.attr("disabled", false);
            $('.sixty').fadeOut('fast');
            $('.getCodeText').fadeIn("fast");
            return;
        }
    }, 1000);
}

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

//layer
function LayerFun(type) {
    if (type == "114") {
        DelCookie("ca_token");
        window.location.href = "login.html";
        return;
    }
    layer.msg("<span class='i18n' name='" + type + "'></span>", {time: 5000});
    execI18n();
}

//loading spin
var div = $("<div id='mySpin'></div>");
var spinLink = $("<link rel='stylesheet' href='../assets/css/spin.css'>");
$("head").append(spinLink);
$("body").append(div);
var opts = {
    lines: 8, // The number of lines to draw
    length: 10, // The length of each line
    width: 2, // The line thickness
    radius: 10, // The radius of the inner circle
    scale: 1, // Scales overall size of the spinner
    corners: 1, // Corner roundness (0..1)
    color: '#ffffff', // CSS color or array of colors
    fadeColor: 'transparent', // CSS color or array of colors
    speed: 1, // Rounds per second
    rotate: 0, // The rotation offset
    animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
    direction: 1, // 1: clockwise, -1: counterclockwise
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    className: 'spinner', // The CSS class to assign to the spinner
    top: '50%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: '0 0 1px transparent', // Box-shadow for the lines
    position: 'absolute' // Element positioning
};
var target = document.getElementById("mySpin");
var spinner = new Spinner(opts);

//show loading
function ShowLoading(type) {
    if (type == "show") {
        spinner.spin(target);
    }
    if (type == "hide") {
        spinner.spin();
    }
}
