$(function () {
    //get user token
    var token = GetCookie('user_token');
    GetUsAccount();

    $('.googleEnable').click(function () {
       var code = $('#code').val();
       if(code.length <= 0){
           LayerFun('codeBad');
           return;
       }

       GoogleVerify(token, code, function (response) {
           if(response.errcode == '0'){
              LayerFun('verifySuccess');
              window.location.href = 'security.html';
           }
       }, function (response) {
           GetErrorCode(response.errcode);
       })
    });
});