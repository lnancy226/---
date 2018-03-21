/**
 * Created by 919482722 on 2018/1/10.
 */
var Authorization = $.cookie("Authorization");  //全局token
console.log(Authorization,"全局token");

$(function () {
    $(".logout").on("click",function () {
        $.ajax({
            url: 'http://116.62.131.70:8080/roo-mobile-web/app/logout',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", Authorization);
            },
            type: "DELETE",
            contentType: "application/json;charset=utf-8",
            success: function(info) {
                console.log(info, "退出登录");
//                console.log(Authorization);
                if (info.httpCode == 200){
                    location.href = './login.html';
                }
            }
        });
    })

})