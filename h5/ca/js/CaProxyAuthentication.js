$(function () {
    //get token
    var token = getCookie('ca_token');
    GetCaAccount();

    //Get url parameter-img address
    var href = window.location.search.split("?")[1];
    var newImgHtml = decodeURIComponent(href);
    $(".newImgBox>img").attr("src", newImgHtml);

    //添加代理类型
    var ca_channel = newImgHtml.substring(newImgHtml.indexOf('/') + 1, newImgHtml.indexOf('.'));
    $('.addBankBtn').click(function () {
        var card_nm = $('#BankCard').val(), name = $('#Name').val(),
            idNum = $('#IDCard').val(), pass_word_hash = hex_sha1($('#Password').val());
        var $this = $(this), btnText = $(this).text();
        if(DisableClick($this)) return;
        AddAgencyType(token, ca_channel, card_nm, name, idNum, pass_word_hash, function (response) {
            if(response.errcode == '0'){
                ActiveClick($this, btnText);
                LayerFun('setSuccess');
                window.location.href = 'CaLookAgencyType.html';
            }
        }, function (response) {
            ActiveClick($this, btnText);
            LayerFun(response.errcode);
            return;
        })
    });
});