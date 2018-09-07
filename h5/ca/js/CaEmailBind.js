$(function () {
    var token = GetCookie('ca_token');
    GetCaAccount();
    $('.emailEnable').click(function () {
        var text = $('#email').val(),
            text_hash = hex_sha1(text),
            text_type = 'email',
            password = $('#password').val(),
            pass_word_hash = hex_sha1(password);
        TextBind(token, text_type, text, text_hash, function (response) {
            if (response.errcode == '0') {
                LayerFun('bindSuccess');
                return;
            }
        }, function (response) {
            if (response.errcode == '114') {
                window.location.href = 'CaLogin.html';
            }
            LayerFun(response.errcode);
            return;
        })
    });
});