$(function () {
    //get token
    var token = GetCookie('user_token');
    GetUsAccount();

    //Get graphic verification code
    GetImgCode();

    //Get phone verification code
    $('.phoneCodeBtn').click(function () {
        var bind_type = '4', $this = $(this), cfm_code = $('#phoneCfmCode').val();
        if (cfm_code <= 0) {
            LayerFun('pleaseImgCode');
            return;
        }
        setTime($this);
        GetPhoneCodeFun(bind_type, $this, cfm_code);
    });

    //Get url parameter
    var wi_funPass = GetQueryString('wi_funPass');

    //Get binding information
    BindingInformation(token, function (response) {
        if (response.errcode == '0') {
            var data = response.rows, cellphone = "";
            $.each(data, function (i, val) {
                if (data[i].bind_name == 'cellphone' && data[i].bind_flag == '1') {
                    cellphone = data[i].bind_name;
                    return;
                }
            });
            if (cellphone != "cellphone") {
                $("#goBindCellPhone").modal('show');
            }
        }
    }, function (response) {
        LayerFun(response.errcode);
        return;
    });

    //Binding fund password
    $('.fundPasswordEnable').click(function () {
        var hash_type = 'pass_hash',
            // Get country code
            country_code = $('.selected-dial-code').text().split("+")[1],
            phone = country_code + '-' + $('#phone').val(),
            phoneCode = $('#phoneCode').val(),
            hash = hex_sha1($('#fundPassword').val()),
            password = $('#password').val(),
            pass_word_hash = hex_sha1(password);
        if ($('#fundPassword').val().length <= 0) {
            LayerFun('funPassNotEmpty');
            return;
        }

        if ($('#phone').val().length <= 0) {
            LayerFun('phoneNotEmpty');
            return;
        }

        if ($('#phoneCode').val().length <= 0) {
            LayerFun('codeNotEmpty');
            return;
        }

        if (password.length <= 0) {
            LayerFun('passNotEmpty');
            return;
        }
        //hashFund password binding
        var $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
        ShowLoading("show");
        Hash(token, hash_type, hash, pass_word_hash, phone, phoneCode, function (response) {
            if (response.errcode == '0') {
                ShowLoading("hide");
                ActiveClick($this, btnText);
                LayerFun('bindSuccess');
                if (wi_funPass !== 'wi_funPass') {
                    window.location.href = 'security.html';
                } else {
                    window.location.href = '../ba/BaWithdraw.html';
                }
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            GetImgCode();
            LayerFun(response.errcode);
        })
    })
});
