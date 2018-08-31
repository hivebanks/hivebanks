$(function () {
   //获取用户token
    var token = GetCookie('user_token');
    GetUsAccount();

    //获取添加的银行列表
    GetBankList(token, function (response) {
        if(response.errcode == '0'){
            var data = response.rows, li = '';
            if(data ==false){
                $('.showBankRow').remove();
                $('.bankTitle').attr('name', 'noBankList');
                execI18n();
                return;
            }
            $.each(data, function (i, val){
                li+='<li class="width-20">' +
                    '<img src="img/'+ data[i].option_key.toLowerCase() +'.png">' +
                    '<span><i class="iconfont icon-duihao"></i></span>'+
                    '</li>'
            });
            $('.bankTypeBox').append(li);
        }
    }, function (response) {
        GetErrorCode(response.errcode);
    });

    //选择银行卡类型
    $(document).on('click', '.bankTypeBox li', function(){
        $(this).addClass('border').siblings().removeClass('border').siblings().find('.icon-duihao').hide();
        $(this).find('.icon-duihao').show();
        $('.next').show();
        var imgHtml = $(this).find('img').attr('src');
        //选择代理方式下一步操作
        $('.next').click(function(){
            window.location.href = 'addBankInfo.html?img=' + encodeURIComponent(imgHtml);
        })
    })
});