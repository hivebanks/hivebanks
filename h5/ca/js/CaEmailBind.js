$(function () {
    var token = GetCookie('ca_token');
    GetCaAccount();
    $('.emailEnable').click(function () {
        var text = $('#email').val(),
            text_hash = hex_sha1(text),
            text_type = 'email',
            password = $('#password').val(),
            pass_word_hash = hex_sha1(password);
        var $this = $(this), btnText = $(this).text();
        if(DisableClick($this)) return;
        TextBind(token, text_type, text, text_hash, function (response) {
            if (response.errcode == '0') {
                ShowLoading("show");
                ActiveClick($this, btnText);
                LayerFun('bindSuccess');
                return;
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            if (response.errcode == '114') {
                window.location.href = 'CaLogin.html';
            }
            LayerFun(response.errcode);
            return;
        })
    });
});