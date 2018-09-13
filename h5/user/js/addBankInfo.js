$(function () {
    //token
    var token = GetCookie('user_token');
    GetUsAccount();

    //Get image
    var img = decodeURIComponent(window.location.search.split('=')[1]);
    $('.bankImg').attr('src', img);
    var start = img.indexOf('/'), end = img.indexOf('.');

    //Confirmation information to add a bank card
    var cash_type = GetCookie('ca_currency');
    $('.addBankBtn').click(function () {
        var cash_channel = img.substring(start + 1, end), cash_address = $('#BankCard').val(),
            name = $('#Name').val(), idNum = $('#IDCard').val(), pass_word_hash = hex_sha1($('#Password').val());

        if (cash_address.length <= 0) {
            LayerFun('pleaseCardNumber');
            return;
        }

        if (name.length <= 0) {
            LayerFun('pleaseEnterName');
            return;
        }

        if (idNum.length <= 0) {
            LayerFun('pleaseEnterIdNumber');
            return;
        }

        if (pass_word_hash.length <= 0) {
            LayerFun('pleaseEnterPassword');
            return;
        }
        ShowLoading("show");
        AddBank(token, cash_channel, cash_type, cash_address, name, idNum, pass_word_hash, function (response) {
            if(response.errcode == '0'){
                ShowLoading("hide");
                LayerFun('addBankSuccessfully');
                window.location.href = 'manageBankList.html';
            }
        }, function (response) {
            ShowLoading("hide");
            LayerFun(response.errcode);
        })
    })
});