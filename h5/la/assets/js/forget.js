$(function () {
    var emailList = '', _email = '';
    $('.forgetPassBtn').click(function () {
        var email = $('#email').val(), user = $('#userName').val();
        if (email.length <= 0) {
            LayerFun('emailNotEmpty');
            return;
        }
        if (user.length <= 0) {
            LayerFun('accountNotEmpty');
            return;
        }
        ForgetPassword(email, user, function (response) {
            if (response.errcode == '0') {
                $('#forgetSuccess').modal('show');//修改成功过显示提示
                emailList = EmailList();
                _email = $('#email').val().split('@')[1];
                return;
            }
        }, function (response) {
            LayerFun('modifyFail');
            LayerFun(response.errcode);
            return;
        })

    });

    //Go to the mailbox to verify
    $('.goEmailBtn').click(function () {
        window.open(emailList[_email]);
        window.location.href = 'login.html';
    });
});