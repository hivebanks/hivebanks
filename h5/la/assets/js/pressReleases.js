$(function () {
    // $('#summernote').summernote({
    //     height:400,
    //     maxHeight:500,
    //     // airMode: true
    //     callbacks: {
    //         onImageUpload: function(files) {
    //             // 上传图片到服务器并且插入图片到编辑框
    //         }
    //     }
    //
    // });


    $("#fileInput").change(function () {
        var file = this.files[0];
        var src = getObjectURL(file);
        if (src) {
            var div = ("<div class='showImgItem'><img src='" + src + "' alt=''><div class='mask'><h1 class='' name=''>—</h1></div></div>");
            $(".showImgBox").append(div);
        }
    });

    //delete img
    $(document).on("click", ".mask", function (e) {
        $(this).parent(".showImgItem").remove();
    });

    //submit
    $(".fileBtn").click(function () {
        var newsTitle = $("#newsTitle").val();
        var newsContent = $("#newsContent").val();
        var imgList = $(".showImgItem").children("img");
        if (newsTitle.length <= 0) {
            LayerFun("pleaseInputTitle");
            return;
        }
        if (newsContent.length <= 0) {
            LayerFun("pleaseInputContent");
            return;
        }
        $(".preloader-wrapper").addClass("active");
       var code = UploadNews(newsTitle, newsContent, imgList, function (response) {

       });
        if(code == "0"){
            $(".preloader-wrapper").removeClass("active");
        }
    });

    //Display when selecting a picture
    function getObjectURL(file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }
});