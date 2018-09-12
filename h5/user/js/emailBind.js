$(function () {
    var token = GetCookie('user_token');
    GetUsAccount();

    var _email = '', emailList = '';
    $('.emailEnable').click(function () {
        var text = $('#email').val(),
            text_hash = hex_sha1(text),
            text_type = '1',
            password = $('#password').val(),
            pass_word_hash = hex_sha1(password);
        if (text.length <= 0) {
            LayerFun('emailNotEmpty');
            return;
        }

        if (password.length <= 0) {
            LayerFun('passNotEmpty');
            return;
        }
        _email = text.split('@')[1];
        var $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
        ShowLoading("show");
        TextBind(token, text_type, text, text_hash, pass_word_hash, function (response) {
            if (response.errcode == '0') {
                ShowLoading("hide");
                ActiveClick($this, btnText);
                emailList = EmailList();
                $('#goEmailVerify').modal('show');
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            LayerFun(response.errcode);
        })
    });
    $('.GoEmailBtn').click(function () {
        window.open(emailList[_email]);
    })
});