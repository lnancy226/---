/**
 * Created by 919482722 on 2018/1/12.
 */
$(function () {
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
            $(".focus").focus();
            // console.log(info, "宝贝详情");
            $("#goodsName").attr("data-id",info.data.id);
            $(".site-pic li:eq(0)").css("display","block");
            if (info.data.rooFileList.length <= 6) {
                $(".upload").css("display","block");
            };
            $(".site-pic ul").on("click", ".dele", function () {
                $(this).parent("li").remove();
            });
            var goodsMarketprice = info.data.goodsMarketprice;
            var size = info.data.size;
            // console.log(size);
            if(size.indexOf("厘米") === -1){
                $("#unitSize").val("米");
                var endIndex = size.indexOf("米");
                // console.log(endIndex,"单位米");
                size=size.substring(0,endIndex);
                // var sizeArr = size.split('x');
                // console.log("米");

            }else{
                // console.log("厘米");
                var endIndex = size.indexOf("厘米");
                size=size.substring(0,endIndex);
            };
            var sizeArr = size.split('x');
            // console.log(sizeArr);

            var weight = info.data.weight;
            if(weight.indexOf("千克") === -1){
                var endIndexW = weight.indexOf("克");
                weight=weight.substring(0,endIndexW);
            }else{
                $("#unitWeight").val("千克");
                var endIndexW = weight.indexOf("千克");
                weight=weight.substring(0,endIndexW);
            };

            if (goodsMarketprice.toString().length >= 5) {
                goodsMarketprice = goodsMarketprice / 10000;
                $("#unitPrice").val("万元");
            }
            // console.log(goodsMarketprice,"除法");

            var secondTag = info.data.tag.tagName;
            // console.log(secondTag,"类型");
            // $("#secondTag").text(secondTag);
            // $("#secondTag").val(secondTag);
            $("#secondTag").find("option:eq(0)").text(secondTag);
            $("#secondTag").html("<option value=" + info.data.tag.id + ">" + info.data.tag.tagName + "</option>");
            // console.log($("#secondTag").val(),"select值");

            // 分区处理
            if(info.data.goodsClass === 0){
                info.data.myGoodsSort = "未分区";
            }else if(info.data.goodsClass === 1){
                info.data.myGoodsSort = "特价区";
            }else if(info.data.goodsClass === 2){
                info.data.myGoodsSort = "精品区";
            };
            // var y = info.data.goodsMarketprice.indexOf("元");
            // console.log(y,"匹配单位");
            if(info.httpCode ==200) {
                $("#mainPic").attr("src",info.data.goodsFile.url);
                $("#mainPicBanner").attr("src",info.data.goodsFile.url);
                // $(".site-pic ul")
                $.each(info.data.rooFileList,function(index,value){
                    $(".site-pic ul").append("<li><img src='" + value.url + "'><div class='dele'>×</div></li>");
                });
                $("#sort").prepend("<option selected='selected' value=" + info.data.goodsClass + ">" + info.data.myGoodsSort + "</option>");
                $("#goodsName").val(info.data.goodsName);
                $("#price").val(goodsMarketprice);
                // $("#secondTag").val(info.data.tag.tagName);
                $("#material").val(info.data.material);
                $("#weight").val(weight);
                $("#instr").val(info.data.remark);
                $("#size1").val(sizeArr[0]);
                $("#size2").val(sizeArr[1]);
                $("#size3").val(sizeArr[2]);
            }
        }
    });

    goodsTag();

    function goodsTag() {
        data = JSON.stringify({
            parentId: 0
        });
        // console.log(data);
        $.ajax({
            url: 'http://116.62.131.70:8080/roo-mobile-web/tag/read/list/goods?parentId=0',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", Authorization);
            },
            type: 'GET',
            contentType: "application/json;charset=utf-8",
            // data: data,
            success: function (info) {

                // console.log(info, "一级宝贝标签");
                $.each(info.data, function (index, value) {
                    $("#firstTag").append("<option value=" + value.id + ">" + value.tagName + "</option>");    //取到所有一级宝贝标签并将其导入到select中
                });

                //当一级标签更改的时候调取到相应二级标签的数据
                $("#firstTag").change(function () {
                    var firstTagId = $(this).find("option:selected").val();
                    $("#secondTag").find("option").remove();
                    requestSecondTag(firstTagId);
                    // console.log(firstTagId);
                });
            }
        });
    }

    function requestSecondTag(id) {
        $.ajax({
            url: 'http://116.62.131.70:8080/roo-mobile-web/tag/read/list/goods?parentId=' + id,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", Authorization);
            },
            type: 'GET',
            contentType: "application/json;charset=utf-8",
            success: function (info) {

                // console.log(info, "二级宝贝标签");
                $.each(info.data, function (index, value) {
                    $("#secondTag").append("<option value=" + value.id + ">" + value.tagName + "</option>");    //取到一级宝贝标签下所有二级宝贝标签并将其导入到select中
                });
            }
        });
    }

    //上传宝贝主图照片ProcessBannerFile
    function uploadMainPic(e) {
        var file = document.getElementById('mainImg').files[0];
        // console.log(file, "输出file");
        var img = document.getElementById("mainPic");
        var mainPicBanner = document.getElementById("mainPicBanner");
        var fd = new FormData();//创建一个fromdata
        fd.append("file", file); //将参数名与参数值以key value形式组合起来
        // console.log(fd, "fd");
        $.ajax({
            type: "post",
            url: "http://116.62.131.70:8080/roo-mobile-web/image",
            contentType: false,
            processData: false,
            file: file,
            dataType: "JSON",
            data: fd,
            success: function (info) {

                // console.log(info, "主图信息");
                // console.log(info.data[0].url, "主图原图");
                img.src = info.data[0].url;
                $("#uploadMinImg").text("更改主图");
                mainPicBanner.src = info.data[0].thumbnailUrl;
                $(".site-pic ul li:eq(0)").css("display", "block");
                $(".upload").css("display", "block");
            }
        });
    }

    function BannerLoaded() {
        document.getElementById('mainImg').addEventListener('change',
            uploadMainPic, false);
    }

    BannerLoaded();

    //上传幅图
    function assisPics() {
        var file = document.getElementById('file').files[0];
        var fd = new FormData();//创建一个fromdata
        fd.append("file", file); //将参数名与参数值以key value形式组合起来
        $.ajax({
            type: "post",
            url: "http://116.62.131.70:8080/roo-mobile-web/image",
            contentType: false,
            processData: false,
            file: file,
            dataType: "JSON",
            data: fd,
            success: function (info) {
                // console.log(info, "幅图");
                // $(".site-pic").append("<img src='"+ data.data.url +"' style='width:80px;'>");
                $(".site-pic ul").append("<li><img src='" + info.data[0].thumbnailUrl + "'><div class='dele'>×</div></li>");

                $(".site-pic ul").on("click", ".dele", function () {
                    $(this).parent("li").remove();

                    var assisLen = $(".site-pic ul").children().length;
                    // console.log(assisLen, "幅图数量");
                    if (assisLen >= 7) {
                        $('.upload').css('display', 'none');
                    } else {
                        $('.upload').css('display', 'block');
                    }
                });

                var assisLen = $(".site-pic ul").children().length;
                // console.log(assisLen, "幅图数量");
                if (assisLen >= 7) {
                    $('.upload').css('display', 'none');
                } else {
                    $('.upload').css('display', 'block');
                }
            }
        });
    }

    function InnerLoaded() {
        document.getElementById('file').addEventListener('change',
            assisPics, false);
    }

    InnerLoaded();

    // 提交
    $('#submit').on('click', function () {
        var id = $("#goodsName").attr("data-id");

        var goodsListArray = [];
        $(".site-pic li img").each(function (index,value) {
            var src=$(value).attr("src");
            goodsListArray.push(src);
            goodsSlideListArray = goodsListArray.slice(1);
        });
        var goodsMarketprice = $("#price").val();
        // var unitSize = $("#unitSize").find("option:selected").val() == 0 ? "厘米" : "米";
        goodsMarketprice = $("#unitPrice").find("option:selected").val() == '万元' ? goodsMarketprice * 10000 : goodsMarketprice;
        // console.log(goodsMarketprice, "价格转换");
        // console.log(goodsSlideListArray,"幅图");
        // var price = $("#price").val()+$("#unitPrice").find("option:selected").val();
        // console.log(price,"价格");
        var parameters = JSON.stringify({
            id:id,
            goodsImage: $("#mainPic").attr("src"),
            tagId: $("#secondTag").find("option:selected").val(),
            // goodsMarketprice: $("#price").val()+$("#unitPrice").find("option:selected").val(),
            goodsMarketprice: goodsMarketprice,
            goodsName: $("#goodsName").val(),
            goodsSlideList: goodsSlideListArray,
            material: $("#material").val(),
            size: $("#size1").val() + "x" + $("#size2").val() + "x" + $("#size3").val() + $("#unitSize").find("option:selected").val(),
            weight: $("#weight").val() + $("#unitWeight").find("option:selected").val(),
            remark: $("#instr").val(),
            goodsClass: $("#sort").find("option:selected").val()
        });
        // console.log(parameters, "编辑宝贝信息");
        $.ajax({
            url: 'http://116.62.131.70:8080/roo-mobile-web/goods',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", Authorization);
            },
            type: 'put',
            contentType: "application/json;charset=utf-8",
            data: parameters,
            success: function (info) {

                // console.log(info, "编辑宝贝");
                // console.log(id);
                if (info.httpCode == 200) {
                    location.href = './goodsDetail.html?goodsId='+id;
                }
            }
        });
    });

    $("#cancel").on("click", function () {
        location.href = './myGoods.html';
    });
})