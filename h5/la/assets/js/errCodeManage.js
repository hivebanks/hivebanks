$(function () {
    //get token
    var token = GetCookie('la_token');

    //error code list
    var tr = '';
    GetErrorList(token, function (response) {
        if(response.errcode == '0'){
            var data = response.row;
            if(data == false){
                GetDataEmpty();
                return;
            }
            $.each(data, function (i, val) {
                tr+="<tr class='errorItem'>" +
                    "<td><span class='code_key'>"+ data[i].code_key +"</span></td>" +
                    "<td class='padding-right-2 padding-left-2'>" +
                    "<div>" +
                    "<span class='errorMsg'>"+ data[i].code_value +"</span>" +
                    "<div class='errorMsgBox none flex baseline'>" +
                    "<input type='text'  class='form-control errorMsgInput'>" +
                    "<button class='confirmModifyErrorMsg btn btn-success btn-sm i18n' name='determine'></button>" +
                    "</div>" +
                    "</div>" +
                    "</td>" +
                    "<td><a href='javascript:;' class='editTableText i18n' name='edit'></a>" +
                    "<a href='javascript:;' class='none cancelEdit i18n' name='cancel'></a></td>" +
                    "</tr>";
            });
            $('#errorCodeTable').html(tr);
        }
    }, function (response) {
        GetDataFail();
        return;
    });

   //edit error code
   $(document).on('click', '.editTableText', function () {
       $(this).parents('.errorItem').siblings().find('.errorMsgBox').addClass('none');
       $(this).siblings('.cancelEdit').fadeIn('fast');
       $(this).parents('.errorItem').find('.errorMsg').fadeOut('fast');
       $(this).parents('.errorItem').find('.errorMsgBox').removeClass('none');
       $(this).parents('.errorItem').find('.errorMsgInput').val($(this).parents('.errorItem').find('.errorMsg').text());
   });

   //confirm modify error information
    $(document).on('click', '.confirmModifyErrorMsg', function () {
       var code_key = $(this).parents('.errorItem').find('.code_key').text(),
        code_value = $(this).prev('.errorMsgInput').val(), _this = $(this);
       SetErrorMsg(token, code_key, code_value, function (response) {
            if(response.errcode == '0'){
                _this.parent('.errorMsgBox').prev('.errorMsg').text(code_value);
                _this.parents('.errorItem').find('.errorMsg').fadeIn('fast');
                _this.parents('.errorItem').find('.errorMsgBox').addClass('none');
                _this.parents('.errorItem').find('.cancelEdit').fadeOut('fast');
                LayerFun('modifySuccess');
                return;
            }
       }, function (response) {
           GetDataFail();
           return;
       });

    });

    //cancel modify
    $(document).on('click', '.cancelEdit', function () {
        $(this).fadeOut('fast');
        $(this).parents('.errorItem').find('.errorMsg').fadeIn('fast');
        $(this).parents('.errorItem').find('.errorMsgBox').addClass('none');
    })
});