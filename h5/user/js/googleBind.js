$(function () {
    //获取用户token
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
       GoogleBind(token, email, function (response) {
           if(response.errcode == '0'){
               ActiveClick($this, btnText);
               LayerFun("submitSuccess");
               $('.secret').text(response.secret);
               $('.googleInfo').show('fast');
               return;
           }
       }, function (response) {
           ActiveClick($this, btnText);
           LayerFun("submitFail");
           GetErrorCode(response.errcode);
       })
    });

    //查看流程
    $('.lookBtn').click(function () {
        $('.circuit').show('fast');
        return;
    })
});