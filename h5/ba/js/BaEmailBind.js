$(function () {
    var token = GetCookie('ba_token');
    GetBaAccount();
    var _email = '', emailList = '';
    $('.emailEnable').click(function () {
        var text = $('#email').val(),
            text_hash = hex_sha1(text),
            text_type = '1',
            password = $('#password').val(),
            pass_word_hash = hex_sha1(password);
        if (text.length <= 0) {
            LayerFun('email');
            return;
        }

        if (password.length <= 0) {
            LayerFun('password');
            return;
        }
        _email = text.split('@')[1];
        var $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
        ShowLoading("show");
        TextBind(token, text_type, text, text_hash, function (response) {
            if (response.errcode == '0') {
                ActiveClick($this, btnText);
                ShowLoading("hide");
                emailList = EmailList();
                $('#goEmailVerify').modal('show');
            }
        }, function (response) {
            ActiveClick($this, btnText);
            ShowLoading("hide");
            LayerFun(response.errcode);
            return;
        })
    });
    $('.GoEmailBtn').click(function () {
        window.open(emailList[_email]);
    })
});