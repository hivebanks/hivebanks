$(function () {
    //获取用户token
    var token = GetCookie('ca_token');
    GetCaAccount();

    $('.googleEnable').click(function () {
       var code = $('#code').val();
       if(code.length <= 0){
           LayerFun('codeNotEmpty');
           return;
       }
        var $this = $(this), btnText = $(this).text();
        if(DisableClick($this)) return;
       GoogleVerify(token, code, function (response) {
           if(response.errcode == '0'){
               ActiveClick($this, btnText);
              LayerFun('verifySuccess');
              window.location.href = 'CaSecurity.html';
           }
       }, function (response) {
           ActiveClick($this, btnText);
           GetErrorCode(response.errcode);
           return;
       })
    });
});