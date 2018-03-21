/**
 * Created by 919482722 on 2018/1/15.
 */

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

var goodId = GetQueryString("goodsId")
$.ajax({
    url: "http://116.62.131.70:8080/roo-mobile-web/goods/" + goodId,
    beforeSend: function (request) {
        request.setRequestHeader("Authorization", Authorization);
    },
    type: "GET",
    contentType: "application/json;charset=utf-8",
    success: function (info) {
        // console.log(info, "宝贝详情");
        if(info.data.goodsClass === 0) {
            info.data.goodsSort = "未分区";
        }else if(info.data.goodsClass === 1) {
            info.data.goodsSort = "特价区";
        }else if(info.data.goodsClass === 2) {
            info.data.goodsSort = "精品区";
        };

        // console.log(info, "宝贝详情2");
        // 调用模板引擎处理宝贝展厅
        var goodHtml = template("goodDetail", info.data);
        $("#detail").html(goodHtml);
    }
});

//    var mainImgSrc = $(".gallery .main-pic img").attr("src");
//    console.log(mainImgSrc,"主图src");
//    鼠标进入放大展示
$("#detail").on("mouseenter",".gallery .site-pic img",function () {
    var imgSrc = $(this).attr("src");
    // console.log(imgSrc,"图片src");
    $(".gallery .main-pic img").attr("src",imgSrc);
});

//    删除宝贝
$("#detail").on('click',".oprate .del",function () {
    var id = $(this).attr("data-goodId");
    $.ajax({
        url: "http://116.62.131.70:8080/roo-mobile-web/goods/"+id,
        beforeSend: function (request) {
            request.setRequestHeader("Authorization",Authorization);
        },
        // data: parameter,
        type: "DELETE",
        contentType: "application/json;charset=utf-8",
        success: function (info) {
            // console.log(info,"删除");
            if (info.httpCode == 200) {
                window.location.href = "./myGoods.html";
                alert("删除成功！");
            }
        }
    });
})

