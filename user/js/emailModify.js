$(function () {
    var token = GetCookie('user_token');//获取用户token
    GetUsAccount();

    var _email = '', emailList = '';
    $('.emailEnable').click(function () {//点击邮箱绑定按钮事件
        //获取用户输入的内容
        var text = $('#email').val(),
            text_hash = hex_sha1(text),
            text_type = '1',
            password = $('#password').val(),
            pass_word_hash = hex_sha1(password);
        //判断输入的有效性
        if (text == '') {
            LayerFun('emailNotEmpty');
            return;
        }

        if (password == '') {
            LayerFun('passNotEmpty');
            return;
        }
        _email = text.split('@')[1];//获取邮箱@后内容
        var $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
        TextModify(token, text_type, text, text_hash, pass_word_hash, function (response) {
            if (response.errcode == '0') {
                ActiveClick($this, btnText);
                emailList = EmailList();
                $('#goEmailVerify').modal('show');//修改成功提示前往邮箱认证
            }
        }, function (response) {
            ActiveClick($this, btnText);
            GetErrorCode(response.errcode);
        })
    });
    $('.GoEmailBtn').click(function () {//前往邮箱认证确认跳转
        window.open(emailList[_email]);
    })
});