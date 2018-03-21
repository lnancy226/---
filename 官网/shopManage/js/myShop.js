/**
 * Created by 919482722 on 2018/1/10.
 */
$(function () {
    // 用户店铺信息-获取用户店铺id
    $.ajax({
        url: "http://116.62.131.70:8080/roo-mobile-web/member/shop",
        beforeSend: function (request) {
            request.setRequestHeader("Authorization",Authorization);
        },
        type: "GET",
        contentType: "application/json;charset=utf-8",
        success: function (info) {
            // console.log(info,"用户店铺信息");
            // console.log(info.data.bannerFile.url,"banner");
            var shopId = info.data.id;
            var userId = info.data.memberId;
            var mygoodsSort = 0;
            // console.log(shopId,userId,"商铺id，用户id");
            getShopDetail(shopId);
            getGoodsList(userId,mygoodsSort);

            $(".exhibition .nav li").on("click",function () {
                // var goodsClass;
                // console.log($(this),"this");
                $(this).children('a').addClass('active').parent().siblings().children('a').removeClass('active');
                mygoodsSort = $(this).attr('data-goods');
                // console.log(mygoodsSort, "宝贝展厅分区id2");
                getGoodsList(userId,mygoodsSort);
            });

            $(".exhibition .nav li:eq(0)").on("click",function () {
                var mygoodsSort = 0;
                getGoodsList(userId,mygoodsSort);

            });
            // console.log(mygoodsSort, "宝贝展厅分区id");
        }
    });

    // 店铺详情
    function getShopDetail(id) {
        $.ajax({
            url: "http://116.62.131.70:8080/roo-mobile-web/shop/"+id,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization",Authorization);
            },
            type: "GET",
            contentType: "application/json;charset=utf-8",
            success: function (info) {
                // console.log(info,"店铺详情");
                var shopListArray = info.data.rooFileList;
                var shopSlideListArray = [];
                // shopSlideListArray.push(info.data.bannerFile.url);
                $(shopListArray).each(function (index,value) {
                    // var src=$(value).attr("src");
                    shopSlideListArray.push(value.url);
                    // shopSlideListArray = shopListArray.slice(1);
                });
                // console.log(shopSlideListArray,"店铺附图");
                shopType = info.data.shopType == 1 ? "古玩城店铺" : "独立店铺";
                // console.log(shopType);
                // var shopInfoItem = ;

                var shopInfo = {
                    shopInfoItem: [
                        {
                            shopName: info.data.shopName,
                            shopType: shopType,
                            areaInfo: info.data.areaInfo,
                            shopFloor: info.data.shopFloor,
                            shopAddress: info.data.shopAddress,
                            shopTel: info.data.shopTel,
                            remark: info.data.remark
                        }
                    ]
                }
                // console.log(shopInfo);
                // console.log(info.data);
                // console.log(info.data.rooFileList,"店内照片");
                // 调用模板引擎处理轮播图
                var banner = template('banner', info.data);
                $('.banner').html(banner);
                var navHtml = template('navList', info.data);
                $("#nav").html(navHtml);

                var shopInfoHtml = template("shopInfo",shopInfo);
                $('.shopContent').html(shopInfoHtml);

                $(".edit").on("click",function () {
                    $(".edit-shop").hide();
                    $(".edit-shopInfo").show();
                    editMyShop(info);
                    submitMyShopInfo(info,shopSlideListArray);
                });
            }
        });
    };

    // 编辑店铺信息
    function editMyShop(info) {
        // console.log(info,"编辑我的店铺");
        var areaInfo = info.data.areaInfo;
        areaInfoArr = areaInfo.split(',');
        // console.log(areaInfoArr,"详细地址");
        var shopTypeStr = '';
        if(info.data.shopType === 1){
            shopTypeStr = "古玩城店铺";
        }else if(info.data.shopType === 2){
            shopTypeStr = "古玩城柜台";
        }else if(info.data.shopType === 3){
            shopTypeStr = "独立店铺";
        };


        $("#shopName").val(info.data.shopName);
        $("#floor").val(info.data.shopFloor);
        $("#houseNum").val(info.data.shopAddress);
        $("#tel").val(info.data.shopTel);
        $("#instr").val(info.data.remark);
        $(".province").prepend("<option value=" + info.data.proviceId + ">" + info.data.provinceName + "</option>");
        $(".city").prepend("<option value=" + info.data.cityId + ">" + info.data.cityName + "</option>");
        $(".district").prepend("<option value=" + info.data.cityId + ">" + info.data.cityName + "</option>");
        $("#nature").prepend("<option value=" + info.data.shopType + ">" + shopTypeStr + "</option>");
        $("#detailAddress").val(areaInfoArr[2]);
        var myProvinceId = info.data.proviceId;
        getProvince(myProvinceId);
    };

    function getProvince(myProvinceId) {

        var data  = JSON.stringify({
            level:0,
            parentId:0
        });

        $.ajax({
            url: 'http://116.62.131.70:8080/roo-mobile-web/cnarea/read/list',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", Authorization);
            },
            type: 'PUT',
            contentType: "application/json;charset=utf-8",
            data: data,
            success: function (info) {

                // console.log(info,"获取省份");
                $.each(info.data,function(index,value){
                    $(".province").append("<option value=" + value.id + ">" + value.shortName + "</option>");    //取到所有一级宝贝标签并将其导入到select中
                });
                requestCity(myProvinceId);

                // 当一级标签更改的时候调取到相应二级标签的数据
                $(".province").change(function () {
                    var provinceId = $(this).find("option:selected").val();
                    $(".city").find("option").remove();
                    // $(".district").find("option").remove();
                    requestCity(provinceId);
                });
            }
        });
    }

    function requestCity(provinceId) {
        var data  = JSON.stringify({
            level:1,
            parentId:provinceId
        });

        $.ajax({
            url: 'http://116.62.131.70:8080/roo-mobile-web/cnarea/read/list',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", Authorization);
            },
            type: 'PUT',
            contentType: "application/json;charset=utf-8",
            data: data,
            success: function (info) {

                // console.log(info,"获取城市");
                $.each(info.data,function(index,value){
                    $(".city").append("<option value=" + value.id + ">" + value.shortName + "</option>");    //取到所有一级宝贝标签并将其导入到select中
                });
                requestArea(info.data[0].id);

                // 当二级标签更改的时候调取到相应三级标签的数据
                $(".city").change(function () {
                    var cityId = $(this).find("option:selected").val();
                    requestArea(cityId);
                });
            }
        });
    };

    function requestArea(cityId) {
        var data  = JSON.stringify({
            level:2,
            parentId:cityId
        });

        $.ajax({
            url: 'http://116.62.131.70:8080/roo-mobile-web/cnarea/read/list',
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", Authorization);
            },
            type: 'PUT',
            contentType: "application/json;charset=utf-8",
            data: data,
            success: function (info) {

                // console.log(info,"获取县区");
                $.each(info.data,function(index,value){
                    $(".district").append("<option value=" + value.id + ">" + value.name + "</option>");    //取到所有一级宝贝标签并将其导入到select中
                });

                // 当二级标签更改的时候调取到相应三级标签的数据
                // $(".city").change(function () {
                //     var cityId = $(this).find("option:selected").val();
                //     requestArea(cityId);
                // });
            }
        });
    }

    function submitMyShopInfo(info,shopSlideListArray) {
        // console.log(shopSlideListArray,"店铺附图");
        $("#submitShopInfo").on("click",function () {
            var parameters = JSON.stringify({
                id:info.data.id,
                shopBanner: info.data.bannerFile.url,
                shopSlideList: shopSlideListArray,
                shopName: $("#shopName").val(),
                remark: $("#instr").val(),
                shopTel: $("#tel").val(),
                shopType: $("#nature").find("option:selected").val(),
                curiocityId: info.data.curiocityId,
                shopFloor: $("#floor").val(),
                shopAddress: $("#houseNum").val()
            });

            $.ajax({
                url: "http://116.62.131.70:8080/roo-mobile-web/shop",
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization",Authorization);
                },
                data:parameters,
                type: "put",
                contentType: "application/json;charset=utf-8",
                success: function (info) {
                    // console.log(info,"编辑店铺提交");
                    if(info.httpCode == 200){
                        window.location.reload();
                    }
                }
            });
        })
    }

    // 宝贝展厅
    function getGoodsList(id,goodsClass) {
        // mygoodsSort = $("#sortId").text();
        // console.log(mygoodsSort,"宝贝分区展示2");

        // var pageNum = 1;
        var pageSize = 8;
        var id = id;
        var goodsClass = goodsClass;

        // 利用正则匹配页码
        var reg = /\d+/g;
        // 处理请求参数
        var search = location.search;
        // console.log(search,"url地址");
        // 进行匹配查找
        if (search == "") {
            pageNum = 1;
        }else {
            var pageNum =  reg.exec(search)[0];
        };

        // // 设定默认页码
        // pageNum = pageNum;


        // console.log(pageNum,"页码");

        var parameter = JSON.stringify({
            pageNum: pageNum,
            pageSize: pageSize,
            id: id,
            goodsClass: goodsClass
        });
        // console.log(parameter,"宝贝分区参数");
        $.ajax({
            url: "http://116.62.131.70:8080/roo-mobile-web/member/"+id+"/goods",
            beforeSend: function (request) {
                request.setRequestHeader("Authorization",Authorization);
            },
            data: parameter,
            type: "PUT",
            contentType: "application/json;charset=utf-8",
            success: function (info) {
                // console.log(info,"宝贝展厅");

                // 总的数据条数
                // var total = info.total;
                // 总的页数
                var pageLen = info.pages;

                // 调用模板引擎处理宝贝展厅
                var goodsHtml = template("myGoodsList",info);
                $("#goodsListBox").html(goodsHtml);

                // 调用模板引擎处理分页
                var pagehtml = template('page', {
                    pageLen: pageLen,
                    pageNum: pageNum
                });

                $(".exhibition .page").html(pagehtml);

            }
        });
    };

    // $(".edit").on("click",function () {
    //     $(".edit-shop").hide();
    //     $(".edit-shopInfo").show();
    // });

    // $(".exhibition .item").hover(function () {
    //     // console.log($(this));
    //     $(this).children(".operate").show();
    // },function () {
    //     $(this).children(".operate").hide();
    //
    // })

    // 宝贝展厅鼠标hover效果 删除
    $(".exhibition #goodsListBox").on("mouseenter", ".item",function () {
        $(this).children(".operate").show();
    }).on("mouseleave",".item",function () {
        $(this).children(".operate").hide();
    }).on("click", ".deleGoods",function () {
        // console.log($(this).attr("data-goodId"),"data-goodId");
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
                    window.location.reload();
                    alert("删除成功！");
                }
            }
        });

    });


})