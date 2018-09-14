$(function () {
    //get token
    var token = getCookie('ca_token');
    GetCaAccount();

    //Get url parameter-img address
    var href = window.location.search.split("?")[1];
    var newImgHtml = decodeURIComponent(href);
    $(".newImgBox>img").attr("src", newImgHtml);

    //Add proxy type
    var ca_channel = newImgHtml.substring(newImgHtml.indexOf('/') + 1, newImgHtml.indexOf('.'));
    $('.addBankBtn').click(function () {
        var card_nm = $('#BankCard').val(), name = $('#Name').val(),
            idNum = $('#IDCard').val(), pass_word_hash = hex_sha1($('#Password').val());
        var $this = $(this), btnText = $(this).text();
        if(DisableClick($this)) return;
        ShowLoading("show");
        AddAgencyType(token, ca_channel, card_nm, name, idNum, pass_word_hash, function (response) {
            if(response.errcode == '0'){
                ShowLoading("hide");
                ActiveClick($this, btnText);
                LayerFun('setSuccess');
                window.location.href = 'CaLookAgencyType.html';
            }
        }, function (response) {
            ShowLoading("hide");
            ActiveClick($this, btnText);
            LayerFun(response.errcode);
            return;
        })
    });
});