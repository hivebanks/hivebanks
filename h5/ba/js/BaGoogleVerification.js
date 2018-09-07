$(function () {
    //get user token
    var token = GetCookie('ba_token');
    GetBaAccount();

    $('.googleEnable').click(function () {
       var code = $('#code').val();
       if(code.length <= 0){
           LayerFun('codeNotEmpty');
           return;
       }
        var $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
       GoogleVerify(token, code, function (response) {
           if(response.errcode == '0'){
               ActiveClick($this, btnText);
              LayerFun('verifySuccess');
              window.location.href = 'BaSecurity.html';
           }
       }, function (response) {
           ActiveClick($this, btnText);
           GetErrorCode(response.errcode);
           return;
       })
    });
});