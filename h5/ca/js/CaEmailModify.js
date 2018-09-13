$(function () {
    var token = GetCookie('ca_token');
    GetCaAccount();
    var _email = '', emailList = '';
    $('.emailEnable').click(function () {
        var text = $('#email').val(),
            text_hash = hex_sha1(text),
            text_type = '1',
            password = $('#password').val(),
            pass_word_hash = hex_sha1(password);
        if (text == '') {
            LayerFun('emailNotEmpty');
            return;
        }

        if (password == '') {
            LayerFun('passwordNotEmpty');
            return;
        }
        _email = text.split('@')[1];
        var $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
        ShowLoading("show");
        TextModify(token, text_type, text, text_hash, pass_word_hash, function (response) {
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
            return;
        })
    });
    $('.GoEmailBtn').click(function () {
        window.open(emailList[_email]);
    })
});