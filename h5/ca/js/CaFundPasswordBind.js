$(function () {
    //get token
    var token = GetCookie('ca_token');
    GetCaAccount();

    GetImgCode();
    $('#phone_imgCode').click(function () {
        GetImgCode();
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

    //Get binding information
    GetCaBindInformation(token, function (response) {
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
        if ($('#fundPassword').val() == '') {
            LayerFun('funPasswordNotEmpty');
            return;
        }

        if ($('#phone').val() == '') {
            LayerFun('phoneNotEmpty');
            return;
        }

        if ($('#phoneCode').val() == '') {
            LayerFun('codeNotEmpty');
            return;
        }

        if (password == '') {
            LayerFun('passwordNotEmpty');
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
                window.location.href = 'CaSecurity.html';
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            LayerFun(response.errcode);
            return;
        })
    })
});