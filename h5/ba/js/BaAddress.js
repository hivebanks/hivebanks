$(function () {
    //获取token
    var token = GetCookie('ba_token');
    GetBaAccount();
    //获取添加的地址
    var limit = 10, offset = 0, n = 0;

    function GetAddress(token, limit, offset) {
        var tr = '';
        QueryAddress(token, limit, offset, function (response) {
            if (response.errcode == '0') {
                var data = response.rows;
                if (data == false) {
                    GetDataEmpty('addressBox', '3');
                    $('.eg').hide();
                    return;
                }
                var pageCount = Math.ceil(data.length / limit);
                $('.totalPage').text(Math.ceil(data.length / limit));
                $('.currPage').text(limit + 1);
                var bind_us_id = '';
                for (var i = 0; i < data.length; i++) {
                    bind_us_id = data[i].bind_us_id;
                    if (data[i].bind_us_id == null) {
                        bind_us_id = "";
                    }
                    tr += '<tr>' +
                        '<td>' + data[i].bit_address + '</td>' +
                        '<td>' + bind_us_id + '</td>' +
                        '<td>' + data[i].utime + '</td>' +
                        '</tr>';
                }
                $('#addressBox').html(tr);
                if (n == 0) {
                    Page(pageCount);
                }
                n++;
            }
        }, function (response) {
            GetErrorCode(response.errcode);
            GetDataFail('addressBox', '3');
            return;
        });
    }

    GetAddress(token, limit, offset);

    //    分页
    function Page(pageCount) {
        $('.address_code').pagination({
            pageCount: pageCount,
            callback: function (api) {
                offset = (api.getCurrent() - 1) * limit;
                $('.currentPage').text(api.getCurrent());
                GetAddress(token, limit, offset);
            }
        });
    }

    //添加充值地址
    $('#confirmAddAddressBtn').click(function () {
        var bit_address = $('.addressInput').val().trim(), is_void = '1';
        if (bit_address.length <= 0) {
            LayerFun('pleaseEnterAddress');
        }
        AddAddress(token, bit_address, is_void, function (response) {
            if (response.errcode == '0') {
                $('.addressInput').val('');
                GetAddress(token, limit, offset);
                layer.msg('<p class="addAddressSuccess i18n" name="addAddressSuccess">添加成功</p>');
                execI18n();
            }
        }, function (response) {
            GetErrorCode(response.errcode);
            return;
        });
    });

    //显示添加地址框
    $('.addAddressBtn').click(function () {
        $('.addAddressInputBox').fadeToggle('fast');
    });

    //上传文件
    //获取配置文件
    var config_api_url = '';
    $.ajax({
        url: '../../assets/json/config_url.json',
        async: false,
        type: "GET",
        dataType: "json",
        success: function (data) {
            config_api_url = data.api_url;
            config_h5_url = data.h5_url;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });

    $('#file').on('change', function () {
       $('#fileText').text($(this).val())
    });
    $('.uploadFileBtn').click(function () {
        var file = $('#file').val(), name = file.substr(file.indexOf('.'));
        if(file == ''){
            LayerFun('pleaseSelectFile');
            return;
        }
        if(name != '.csv'){
            LayerFun('uploadCsv');
            return;
        }
        var formData = new FormData();
        var myData = $('#file')[0].files[0];
        formData.append('excel_path', myData);
        formData.append('token', token);
        $.ajax({
            type: 'POST',
            url: config_api_url + 'api/ba/upload_ba_bit_address_csv.php',
            data: formData,
            cache:false,
            processData:false,
            contentType:false,
            enctype:'multipart/form-data',
            success: function (data) {
                GetAddress(token, limit, offset);
                if(data.errcode == '0'){
                    LayerFun('addAddressSuccess');
                    return;
                }
                if(data.errcode == '1'){
                    LayerFun('duplicateAddress');
                    return;
                }
            },
            error: function (response) {
                GetErrorCode(response.errcode);
                return;
            }
        });
    });
});