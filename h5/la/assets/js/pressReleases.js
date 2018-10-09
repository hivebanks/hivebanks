$(function () {
    $(function () {
        //Get token
        var token = GetCookie('la_token');
        //get key_code
        var key_code = "";
        GetKeyCode(token, function (response) {
            if (response.errcode == '0') {
                key_code = response.key_code;
                console.log(key_code);
            }
        }, function (response) {
            LayerFun(response.errcode);
        });

        $('.summernote').summernote({
            height: 200,
            tabsize: 2,
            lang: 'zh-CN',
            focus: true,
            callbacks: {
                onImageUpload: function (files, editor, $editable) {
                    console.log("666");
                    var formData = new FormData();
                    formData.append('file', files[0]);
                    formData.append('key_code', key_code);
                    $.ajax({
                        url: 'http://agent_service.fnying.com/upload_file/upload.php',//后台文件上传接口
                        type: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function (data) {
                            var response = JSON.parse(data), url = response.url;
                            $('.summernote').summernote('insertImage', url, 'img');
                        }
                    });
                }
            },
        });

        $(".getContentBtn").click(function () {
            console.log($(".summernote").summernote("code"));
        })
    });
    // $("#fileInput").change(function () {
    //     var file = this.files[0];
    //     var src = getObjectURL(file);
    //     if (src) {
    //         var div = ("<div class='showImgItem'><img src='" + src + "' alt=''><div class='mask'><h1 class='' name=''>—</h1></div></div>");
    //         $(".showImgBox").append(div);
    //     }
    // });

    //delete img
    // $(document).on("click", ".mask", function (e) {
    //     $(this).parent(".showImgItem").remove();
    // });

    //submit
    // $(".fileBtn").click(function () {
    //     var newsTitle = $("#newsTitle").val();
    //     var newsContent = $("#newsContent").val();
    //     var imgList = $(".showImgItem").children("img");
    //     if (newsTitle.length <= 0) {
    //         LayerFun("pleaseInputTitle");
    //         return;
    //     }
    //     if (newsContent.length <= 0) {
    //         LayerFun("pleaseInputContent");
    //         return;
    //     }
    //     $(".preloader-wrapper").addClass("active");
    //    var code = UploadNews(newsTitle, newsContent, imgList, function (response) {
    //
    //    });
    //     if(code == "0"){
    //         $(".preloader-wrapper").removeClass("active");
    //     }
    // });

    //Display when selecting a picture
    // function getObjectURL(file) {
    //     var url = null;
    //     if (window.createObjectURL != undefined) { // basic
    //         url = window.createObjectURL(file);
    //     } else if (window.URL != undefined) { // mozilla(firefox)
    //         url = window.URL.createObjectURL(file);
    //     } else if (window.webkitURL != undefined) { // webkit or chrome
    //         url = window.webkitURL.createObjectURL(file);
    //     }
    //     return url;
    // }
});