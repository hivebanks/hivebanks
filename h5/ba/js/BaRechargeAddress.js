$(function(){
    GetUsAccount();
    var url = GetQueryString('bit_type');
    $('.bit_type').text(url);
    var bit_address = GetCookie('bit_address');
    $('#qrcode').qrcode({
        text:bit_address,
        width:200,
        height:200
    });
    $('.addressInput').val(bit_address);
    $('.copy_address').click(function(){
        new ClipboardJS('.copy_address');
        LayerFun('copySuccess');
    })
});
