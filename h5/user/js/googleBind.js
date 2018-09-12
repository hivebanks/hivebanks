$(function () {
    //get user token
    var token = GetCookie('user_token');
    GetUsAccount();

    $('.phoneEnable').click(function () {
       var email = $('#email').val();
       if(email.length <= 0){
           LayerFun('emailNotEmpty');
           return;
       }

       if(!IsEmail(email)){
           LayerFun('emailBad');
           return;
       }
        var $this = $(this), btnText = $(this).text();
       if(DisableClick($this)) return;
       ShowLoading("show");
       GoogleBind(token, email, function (response) {
           if(response.errcode == '0'){
               ShowLoading("hide");
               ActiveClick($this, btnText);
               LayerFun("submitSuccess");
               $('.secret').text(response.secret);
               $('.googleInfo').show('fast');
           }
       }, function (response) {
           ShowLoading("hide");
           ActiveClick($this, btnText);
           LayerFun("submitFail");
           LayerFun(response.errcode);
       })
    });

    //View process
    $('.lookBtn').click(function () {
        $('.circuit').show('fast');
        return;
    })
});