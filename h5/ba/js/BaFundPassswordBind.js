$(function () {
    //get token
    var token = GetCookie('ba_token');
    GetBaAccount();

    GetImgCode();
    $('#phone_imgCode').click(function () {
        GetImgCode();
    });

    //Get binding information
    GetBindInformation(token, function (response) {
        if(response.errcode == '0'){
            var data = response.rows, cellphone = "";
            $.each(data, function (i, val) {
                if(data[i].bind_name == 'cellphone' &&  data[i].bind_flag == '1'){
                    cellphone = data[i].bind_name;
                    return;
                }
            });
            if(cellphone != "cellphone"){
                $("#goBindCellPhone").modal('show');
            }
        }
    }, function (response) {
        LayerFun(response.errcode);
        return;
    });


    //Get phone verification code
    $('.phoneCodeBtn').click(function () {
        var bind_type = '4', $this = $(this), cfm_code = $('#phoneCfmCode').val();
        if(cfm_code <= 0){
            LayerFun('pleaseImgCode');
            return;
        }
        setTime($this);
        GetPhoneCodeFun(bind_type, $this, cfm_code);
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
            LayerFun('funPassword');
            return;
        }

        if ($('#phone').val().length <= 0) {
            LayerFun('phone');
            return;
        }

        if ($('#phoneCode').val().length <= 0) {
            LayerFun('phone_code');
            return;
        }

        if (password.length <= 0) {
            LayerFun('password');
            return;
        }
        //hashFund password binding
        var $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
        ShowLoading("show");
        Hash(token, hash_type, hash, pass_word_hash, phone, phoneCode, function (response) {
            if (response.errcode == '0') {
                ActiveClick($this, btnText);
                ShowLoading("hide");
                LayerFun('bindSuccess');
                window.location.href = 'BaSecurity.html';
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            LayerFun(response.errcode);
            return;
        })
    })
});