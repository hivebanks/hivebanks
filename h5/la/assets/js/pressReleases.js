$(function () {
    //Get token
    var token = GetCookie('la_token');

    //get url this_news_id
    var news_id = GetQueryString("this_news_id");
    if (!news_id) {
        $(".modifyBtn").remove();
    } else {
        $(".distributeBtn").remove();
        $(".modifyBtn").removeClass("none");

        //call api news detail
        GetNewsDetail(token, news_id, function (response) {
            if (response.errcode == "0") {
                var data = response.rows;
                $("#title").val(data[0].title);
                $(".summernote").summernote("code", data[0].content);
                $("#author").val(data[0].author);
            }
        }, function (response) {
            LayerFun(response.errcode);
        })
    }

    //get key_code
    var key_code = "";
    GetKeyCode(token, function (response) {
        if (response.errcode == '0') {
            key_code = response.key_code;
        }
    }, function (response) {
        LayerFun(response.errcode);
    });

    //content
    $('.summernote').summernote({
        height: 200,
        tabsize: 2,
        lang: 'zh-CN',
        focus: true,
        callbacks: {
            onImageUpload: function (files, editor, $editable) {
                var formData = new FormData();
                formData.append('file', files[0]);
                formData.append('key_code', key_code);
                $.ajax({
                    url: 'http://agent_service.fnying.com/upload_file/upload.php',
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        var response = JSON.parse(data), url = response.url;
                        $('.summernote').summernote('insertImage', url, 'img');
                    },
                    error: function (data) {
                        console.log(data);
                    }
                });
            }
        },
    });

    //distribute
    $(".distributeBtn").click(function () {
        var title = $("#title").val(),
            content = $(".summernote").summernote("code"),
            author = $("#author").val();
        if (title.length <= 0) {
            LayerFun("pleaseInputNewsTitle");
            return;
        }
        if (content.length <= 0) {
            LayerFun("pleaseInputNewsContent");
            return;
        }
        if (author.length <= 0) {
            LayerFun("pleaseInputNewsAuthor");
            return;
        }
        $(".preloader-wrapper").addClass("active");
        Distribute(token, title, content, author, function (response) {
            if (response.errcode == "0") {
                $(".preloader-wrapper").removeClass("active");
                LayerFun("submitSuccess");
                setTimeout(function () {
                    window.location.href = "news.html";
                }, 2000);
            }

        }, function (response) {
            $(".preloader-wrapper").removeClass("active");
            LayerFun("publishingFailed");
        })

    });

    //modify
    $(".modifyBtn").click(function () {
        var title = $("#title").val(),
            content = $(".summernote").summernote("code"),
            author = $("#author").val();
        if (title.length <= 0) {
            LayerFun("pleaseInputNewsTitle");
            return;
        }
        if (content.length <= 0) {
            LayerFun("pleaseInputNewsContent");
            return;
        }
        if (author.length <= 0) {
            LayerFun("pleaseInputNewsAuthor");
            return;
        }
        $(".preloader-wrapper").addClass("active");
        ModifyNews(token, title, content, author, news_id, function (response) {
            if (response.errcode == "0") {
                $(".preloader-wrapper").removeClass("active");
                LayerFun("submitSuccess");
                setTimeout(function () {
                    window.location.href = "newsDetail.html?news_id=" + news_id;
                }, 2000);
            }

        }, function (response) {
            $(".preloader-wrapper").removeClass("active");
            LayerFun("publishingFailed");
        })

    })
});