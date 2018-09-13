$(function () {
    function GetLoginCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]);
    }
    var login_la_token = GetLoginCookie("la_token");
    if(login_la_token){
        window.location.href = "config.html";
    }
    $('.loginBtn').click(function () {
        var la_token = GetLoginCookie('la_token');
        var _this = $(this), _text = $(this).text();
        var user = $('#account').val(),
            password = $('#password').val(),
            pass_word_hash = hex_sha1(password);
        if(user.length <= 0){
            LayerFun('accountNotEmpty');
            return;
        }

        if(password.length <= 0){
            LayerFun('passwordNotEmpty');
            return;
        }
        if(la_token){
            LayerFun('noMoreAccount');
            return;
        }
        if(DisableClick(_this)) return;
        LaLogin(user, password, pass_word_hash, function (response) {
            if(response.errcode == '0'){
                ActiveClick(_this, _text);
                LayerFun('loginSuccessful');
                SetCookie('la_token', response.token);
                SetCookie('la_name', response.rows.user_info.user);
                window.location.href = 'config.html';
            }
        }, function (response) {
            ActiveClick(_this, _text);
            LayerFun('loginFailed');
            LayerFun(response.errcode);
        })
    })
});