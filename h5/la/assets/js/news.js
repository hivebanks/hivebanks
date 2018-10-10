$(function () {
    //get token
    var token = GetCookie("la_token");

    //get news list
    $(".preloader-wrapper").addClass("active");
    GetNewsList(token, function (response) {
        if (response.errcode == "0") {
            $(".preloader-wrapper").removeClass("active");
            console.log(response);
        }

    }, function (response) {
        $(".preloader-wrapper").removeClass("active");
        LayerFun(response.errcode);
    })

});