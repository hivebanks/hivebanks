$(function(){
    //get token
    var token = getCookie('ca_token');
    GetCaAccount();

    //获取银行列表
    GetBankList(token, function (response){
        if(response.errcode == '0'){
            var data = response.rows, li = '';
            if(data.length <= 0){
                $('.noData').show();
                return;
            }
            $.each(data, function (i, val){
                li+='<li class="width-20">' +
                    '<img src="img/'+ data[i].option_key.toLowerCase() +'.png">' +
                    '<span><i class="iconfont icon-duihao"></i></span>'+
                    '</li>'
            });
            $('.changePay').append(li);
        }
    }, function (response){
        LayerFun(response.errcode);
        return;
    });
    //选择代理类型
    $(document).on('click', '.changePay li', function(){
        $(this).siblings().find('.icon-duihao').hide();
        $(this).find('.icon-duihao').show();
        $('.next').show();
        var imgHtml = $(this).find('img').attr('src');
        //选择代理方式下一步操作
        $('.next').click(function(){
            window.location.href = 'CaProxyAuthentication.html?' + encodeURIComponent(imgHtml);
        })
    })
});