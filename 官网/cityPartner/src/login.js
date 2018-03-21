/**
 * Created by 919482722 on 2018/2/1.
 */
$(function () {
    $('#getMa').on('click', function () {
        var iphone = $('#userName').val();
        var smsType = 2;

        var getsmscode = JSON.stringify({
            phone: iphone,
            smsType: smsType
        });
        console.log(iphone, smsType, "输出测试");
        $.ajax({
            url: 'http://116.62.131.70:8080/roo-mobile-web/app/smscode',
            type: "POST",
            contentType: "application/json;charset=utf-8",
            data: getsmscode,
            success: function (info) {
                console.log(info, "发送验证码");
                alert("验证码已发送");
            }
        });
    })

    $(".submit").on("click", function () {
        loginShop();
    })

    function loginShop() {
        var iphone = $('#userName').val();
        var smscode = $("#ma").val();
        var params = JSON.stringify({
            phone: iphone,
            smscode: smscode
        });
        console.log(params, "登录提交信息");
        $.ajax({
            url: 'http://116.62.131.70:8080/roo-mobile-web/partner/auth',
            type: "POST",
            contentType: "application/json;charset=utf-8",
            data: params,
            success: function (info) {
                console.log(info, "登录信息");
                if (info.httpCode == 200) {
                    console.log("登录成功！");
                    // var Authorization = info.data;
                    // console.log(Authorization, "Authorization token");
                    $.cookie("Authorization", info.data.token);
                    // 目标城市
                    $.cookie('province',info.data.info.provinceName);
                    // $.cookie('city',info.data.info.cityName);
                    // $.cookie('cityId',info.data.info.cityId);
                    $.cookie('provinceId',info.data.info.provinceId);
                    // console.log($.cookie("Authorization"), "cookie");
                    window.location.href = "./adminCenter.html";
                }else{
                    alert('登录失败:'+info.msg);
                };
            },
            error: function (jqXHR,textStatus,errorThrown) {
                console.log(jqXHR,'返回jqXHR');
                console.log(textStatus,'返回的状态textStatus');
                console.log(errorThrown,'返回服务器的错误信息errorThrown');
                console.log(jqXHR.readyState,'返回当前状态');
                console.log(jqXHR.status,'返回状态码');
                console.log(jqXHR.statusText ,'返回状态码错误信息');
                console.log(jqXHR.responseText  ,'返回服务器响应返回的文本信息');
            }
        });
    }
});