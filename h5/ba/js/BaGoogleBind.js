$(function () {
    //get user token
    var token = GetCookie('ba_token');
    GetBaAccount();

    $('.phoneEnable').click(function () {
        var email = $('#email').val();
        if (email.length <= 0) {
            LayerFun('emailNotEmpty');
            return;
        }

        if (!IsEmail(email)) {
            LayerFun('emailBad');
            return;
        }
        var $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
        GoogleBind(token, email, function (response) {
            if (response.errcode == '0') {
                ActiveClick($this, btnText);
                $('.secret').text(response.secret);
                $('.googleInfo').show('fast');
                return;
            }
        }, function (response) {
            ActiveClick($this, btnText);
            LayerFun(response.errcode);
            return;
        })
    });

    //View process
    $('.lookBtn').click(function () {
        $('.circuit').show('fast');
        return;
    })
});