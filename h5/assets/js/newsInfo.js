$(function () {
   $(document).on("click", ".leftNewsTitle", function () {
       $(this).addClass("activeNews").siblings(".leftNewsTitle").removeClass("activeNews");
   })
});