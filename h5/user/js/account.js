$(function () {
    // token
    var token = GetCookie('user_token');

    // Basic user information
    var base_amount = '';
    UserInformation(token, function (response) {
        if (response.errcode == '0') {
            var data = response.rows;
            var security_level = parseInt(data.security_level);
            SetCookie('us_id', data.us_id);
            SetCookie('us_level', data.us_level);
            SetCookie('us_account', data.us_account);
            base_amount = data.base_amount;
            $(".us_account").text(data.us_account);
            $(".us_nm").text(data.us_nm);
            $('.ctime').text(data.ctime);
            $('.us_account').text(data.us_account);
            $('.availableBalance').text(data.base_amount);
            $('.lockBalance').text(data.lock_amount);
            $('.levelNum').text(security_level);
            // $('.userLevelNum').text(us_level);
        }
    }, function (response) {
        layer.msg(response.errcode);
        if (response.errcode == '114') {
            window.location.href = 'login.html';
        }
    });

    //withdraw
    $('.withdrawBtn, .navWithdraw').click(function () {
        if (base_amount <= 0) {
            $('#noBalanceModal').modal('show');
            return;
        }
        window.location.href = "withdraw.html";
    });

    //change username
    $('.modifyNameBtn').click(function () {
        var us_account = $('#nickName').val();
        if (us_account.length <= 0) {
            LayerFun('pleaseEnterNickname');
            return;
        }
        ShowLoading("show");
        ModifyNickName(token, us_account, function (response) {
            if (response.errcode == '0') {
                $('#modifyName').modal('hide');
                ShowLoading("hide");
                LayerFun('modifySuccess');
                $('.us_account').text(response.us_account);
                SetCookie('us_account', response.us_account);
                return;
            }
        }, function (response) {
            ShowLoading("hide");
            LayerFun('modifyFail');
            LayerFun(response.errcode);
            return;
        });
    });

    var limit = 10, offset = 0, n = 0, type = '2';
    //trading status
    TradingStatus(token, limit, offset, type, function (response) {
        if (response.errcode == '0') {

        }
    }, function (response) {
        // LayerFun(response.errcode);
    });

    //Account change record
    var account_change_url = 'log_balance.php';

    function GetAccountChange(token, limit, offset, account_change_url) {
        var tr = '';
        AllRecord(token, limit, offset, account_change_url, function (response) {
            if (response.errcode == '0') {
                var pageCount = Math.ceil(response.total / limit);
                $('.totalPage').text(Math.ceil(response.total / limit));
                var data = response.rows;
                if (data == false) {
                    $('.eg').hide();
                    GetDataEmpty('accountChange', '5');
                    return;
                }
                $.each(data, function (i, val) {
                    tr += '<tr>' +
                        '<td><span title="' + data[i].hash_id + '">' + data[i].hash_id.substr(0, 20) + '...' + '</span></td>' +
                        '<td><span class="i18n" name="' + data[i].tx_type + '">' + data[i].tx_type + '</span></td>' +
                        '<td><span>' + data[i].tx_amount + '</span></td>' +
                        '<td><span>' + data[i].credit_balance + '</span></td>' +
                        '<td><span>' + data[i].ctime + '</span></td>' +
                        '</tr>'
                });
                $('.accountChange').html(tr);
                execI18n();
                if (n == 0) {
                    Page(pageCount);
                }
                n++;
            }
        }, function (response) {
            GetDataFail('accountChange', '5');
        });
    };
    GetAccountChange(token, limit, offset, account_change_url);

    //    Pagination
    function Page(pageCount) {
        $('.account_log_code').pagination({
            pageCount: pageCount,
            callback: function (api) {
                offset = (api.getCurrent() - 1) * limit;
                $('.currentPage').text(api.getCurrent());
                GetAccountChange(token, limit, offset, account_change_url);
            }
        });
    }

    //invite
    $(".inviteBtn").click(function () {
        var url = getRootPath() + "/h5/user/register.html?invite=" + window.btoa($(".us_nm").text());
        $(".inviteInput").val(url);

        $('#qrcode').qrcode({
            text: url,
            width: 570,
            height: 881
        });
        // console.log($("#qrcode").html());
        //canvas invite img
        var canvas = $("#qrcode canvas")[0];
        // var content = $("#inviteImg").get(0).getContext("2d");
        var content = canvas.getContext("2d");
        var qrImg = new Image();
        // qrImg.src = "https://gss0.bdstatic.com/7LsWdDW5_xN3otebn9fN2DJv/doc/pic/item/d0c8a786c9177f3eb8c21d8479cf3bc79e3d5641.jpg";
        qrImg.src = "img/inviteImg.jpg";
        // qrImg.src = canvas.toDataURL("image/png");
        qrImg.onload = function () {
            content.drawImage(this, 0, 0);
        };
        console.log(qrImg);
        // content.drawImage($("#qrcode").html(), 20, 20, 160, 160);
    });

    //copy invite address
    $('.copy_invite_address').click(function () {
        new ClipboardJS('.copy_invite_address');
        layer.msg("copy success")
    })
});