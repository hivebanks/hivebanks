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

       GoogleBind(token, email, function (response) {
           if(response.errcode == '0'){
               $('.secret').text(response.secret);
               $('.googleInfo').show('fast');
               return;
           }
       }, function (response) {
           GetErrorCode(response.errcode);
       })
    });

    //查看流程
    $('.lookBtn').click(function () {
        $('.circuit').show('fast');
        return;
    })
});