$(function () {
    var token = GetCookie('user_token');//get user token
    GetUsAccount();

    var _email = '', emailList = '';
    $('.emailEnable').click(function () {//Click on the mailbox binding button event
        //Get user input
        var text = $('#email').val(),
            text_hash = hex_sha1(text),
            text_type = '1',
            password = $('#password').val(),
            pass_word_hash = hex_sha1(password);
        //Determine the validity of the input
        if (text == '') {
            LayerFun('emailNotEmpty');
            return;
        }

        if (password == '') {
            LayerFun('passNotEmpty');
            return;
        }
        _email = text.split('@')[1];//get email @-content
        var $this = $(this), btnText = $this.text();
        if (DisableClick($this)) return;
        TextModify(token, text_type, text, text_hash, pass_word_hash, function (response) {
            if (response.errcode == '0') {
                ActiveClick($this, btnText);
                emailList = EmailList();
                $('#goEmailVerify').modal('show');//Modify the successful prompt to go to the mailbox authentication
            }
        }, function (response) {
            ActiveClick($this, btnText);
            GetErrorCode(response.errcode);
        })
    });
    $('.GoEmailBtn').click(function () {//Go to the email authentication confirmation jump
        window.open(emailList[_email]);
    })
});