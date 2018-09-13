$(function () {
    //get user token
    var token = GetCookie('ca_token');
    GetCaAccount();

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
        var $this = $(this), btnText = $(this).text();
        if(DisableClick($this)) return;
        ShowLoading("show");
        GoogleBind(token, email, function (response) {
            if (response.errcode == '0') {
                ShowLoading("hide");
                ActiveClick($this, btnText);
                $('.secret').text(response.secret);
                $('.googleInfo').show('fast');
                return;
            }
        }, function (response) {
            ShowLoading("hide");
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