/**
 * Created by 919482722 on 2018/2/6.
 */

$(function () {
    var Authorization =  $.cookie("Authorization");
    // var Authorization = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI5NTgyNTgyMDgyMTA4MDg4MzIiLCJleHAiOjE1MTg2MDQ0NzN9.xbg-ePqBk7PFXgQOn0A0aju_weBLeU-ZZJtHO3qRHzr44CxbizpRCEFAvvUjPwBCVRmGEfav0tzBfmnBxlbA3Q';
    console.log(Authorization,'token');
    var provinceId = $.cookie('provinceId');
    // var cityId = $.cookie('cityId');
    // 店铺列表类型-推荐/全部
    console.log(provinceId,"provinceId");

    // 目标城市
    $('.selectedP').text($.cookie('province'));
    // $('.selectedC').text($.cookie('city'));
    // 面包屑导航
    $('#province').html($.cookie('province')+"<span>-</span>");
    // $('#city').html($.cookie('city')+"<span>-</span>");
    requestCity(provinceId);
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

                console.log(info,"获取城市");
                $.each(info.data,function(index,value){
                    $("#manageCity").append("<option value=" + value.id + ">" + value.shortName + "</option>");    //取到所有一级宝贝标签并将其导入到select中
                });
                getAntique(info.data[0].id);
                $.cookie('cityId',info.data[0].id);
                $('#city').html(info.data[0].name+"<span>-</span>");

                //
                // 当城市标签更改的时候调取到相应古玩城的数据
                $("#manageCity").change(function () {
                    var cityId = $(this).find("option:selected").val();
                    var cityName = $(this).find("option:selected").text();
                    $('#city').html(cityName+"<span>-</span>");
                    $.cookie('cityId',cityId);
                    $("#curio").find("option").remove();
                    getAntique(cityId);
                });
            }
        });
    };

    // 获取古玩城
    // getAntique();
    // 获取古玩城
    function getAntique(cityId) {
        var cityId = cityId;
        console.log(cityId,'古玩城cityid');
        $.ajax({
            url:"http://116.62.131.70:8080/roo-mobile-web/curiocity/city/"+cityId,
            type:"GET",
            dataType: "JSON",
            contentType: "application/json;charset=utf-8",
            // beforeSend: function (request) {
            //     request.setRequestHeader("Authorization", Authorization);
            // },
            headers: {
                'Authorization': Authorization
            },
            success:function(info){
                //取到所有古玩城并将其导入到select中
                console.log(info,"古玩城");
                // var curioId = $('#curio').find("option:selected").val();
                var curioId = info.data[0].id;
                var curiocityName = info.data[0].curiocityName;
                // console.log(curioId,'古玩城Id');
                $.each(info.data,function(index,value){
                    $("#curio").append("<option value=" + value.id + ">" + value.curiocityName + "</option>");
                });
                requestShopData(cityId,curioId);
                // 古玩城更改时获取相应店铺数据
                $("#curio").change(function () {
                    curioId = $(this).find("option:selected").val();
                    curiocityName = $(this).find("option:selected").text();
                    $('#market').html(curiocityName);
                    // console.log(curioId,'古玩城id222');
                    // $("#shopList").remove();
                    requestShopData(cityId,curioId);
                });

                $('#market').html(curiocityName);
            }
        })
    };

    // 获取古玩城下店铺列表
    function requestShopData(cityId,curiocityId){
        console.log(provinceId,"proid7777777777");
        var cityId = cityId;
        var curiocityId = curiocityId;
        var recommoned =  $.cookie('recommoned');
        // 利用正则匹配页码
        var reg = /\d+/g;
        // 处理请求参数
        var search = location.search;
        // console.log(search,"url地址");
        // 进行匹配查找
        if (search == "") {
            var pageNum = 1;
        }else {
            var pageNum =  reg.exec(search)[0];
        };
        console.log(pageNum,"页码");
        var pageSize = 7;
        if(recommoned == 1){
            var data="curiocityId="+curiocityId+"&pageSize="+pageSize+"&pageNum="+pageNum+"&recommoned="+recommoned;
        };
        if(recommoned == 0){
            var data="curiocityId="+curiocityId+"&pageSize="+pageSize+"&pageNum="+pageNum;
        };
        $.ajax({
            url: "http://116.62.131.70:8080/roo-mobile-web/partner/shop/page?"+data,
            type: "GET",
            dataType: "JSON",
            contentType: "application/json;charset=utf-8",
            headers: {
                'Authorization': Authorization,
                'provinceId':provinceId,
                'cityId': cityId
            },
            error: function (jqXHR,textStatus,errorThrown) {
                console.log(jqXHR,'返回jqXHR');
                console.log(textStatus,'返回的状态textStatus');
                console.log(errorThrown,'返回服务器的错误信息errorThrown');
            },
            success:function(info){
                console.log(info,"古玩城下店铺");
                // 调用模板引擎处理店铺列表
                var shopsHtml = template("myShopList",info);
                $("#shopList").html(shopsHtml);
                // 总的页数
                var pageLen = info.pages;
                // 调用模板引擎处理分页
                var pagehtml = template('page', {
                    pageLen: pageLen,
                    pageNum: pageNum
                });

                $(".pagination").html(pagehtml);

                // info.total ? $("#dataTable").html(tableStr) : $("#dataTable").html("<div style='color:red;'>暂无古玩城</div>");
                if(info.total == 0){
                    // $('thead').html('');
                    $('#shopList').html('<tr><td style="color:red;">暂无商铺</td></tr>');
                }

                $.each(info.data,function(index,value){
                    if(value.recommoned == 0){
                        $('#shopList').on('click','.recommend',function () {
                            var id = $(this).attr('data-id');
                            console.log(id,"店铺id");
                            $.ajax({
                                url:"http://116.62.131.70:8080/roo-mobile-web/partner/shop/"+id+"/recommoned",
                                type:"PUT",
                                dataType: "JSON",
                                contentType: "application/json;charset=utf-8",
                                headers: {
                                    'Authorization': Authorization,
                                    'provinceId':provinceId,
                                    'cityId': cityId
                                },
                                success:function(info){
                                    console.log(info,"推荐店铺");
                                    window.location.reload();
                                }
                            })
                        })
                    };
                    if(value.recommoned == 1){
                        $('.recommend').text('取消推荐').css('color','#999');
                        $('#shopList').on('click','.recommend',function () {
                            var id = $(this).attr('data-id');
                            console.log(id,"店铺id");
                            $.ajax({
                                url:"http://116.62.131.70:8080/roo-mobile-web/partner/shop/"+id+"/unrecommoned",
                                type:"PUT",
                                dataType: "JSON",
                                contentType: "application/json;charset=utf-8",
                                headers: {
                                    'Authorization': Authorization,
                                    'provinceId':provinceId,
                                    'cityId': cityId
                                },
                                success:function(info){
                                    console.log(info,"取消推荐");
                                    window.location.reload();
                                },
                                error:function (error) {
                                    console.log(error,"取消推荐error");
                                }
                            })
                        })
                    };
                    if(value.shopState == 0){
                        // c89355
                        $('.closed').text('开启店铺').css('color','#666');
                        $('#shopList').on('click','.closed',function () {
                            var id = $(this).attr('data-id');
                            console.log(id,"店铺id");
                            $.ajax({
                                url:"http://116.62.131.70:8080/roo-mobile-web/partner/shop/"+id+"/open",
                                type:"PUT",
                                dataType: "JSON",
                                contentType: "application/json;charset=utf-8",
                                headers: {
                                    'Authorization': Authorization,
                                    'provinceId':provinceId,
                                    'cityId': cityId
                                },
                                success:function(info){
                                    console.log(info,"开启店铺");
                                    window.location.reload();
                                }
                            })
                        });
                    };
                    if(value.shopState == 1){
                        $('#shopList').on('click','.closed',function () {
                            var id = $(this).attr('data-id');
                            console.log(id,"店铺id");
                            $.ajax({
                                url:"http://116.62.131.70:8080/roo-mobile-web/partner/shop/"+id+"/unopen",
                                type:"PUT",
                                dataType: "JSON",
                                contentType: "application/json;charset=utf-8",
                                headers: {
                                    'Authorization': Authorization,
                                    'provinceId':provinceId,
                                    'cityId': cityId
                                },
                                success:function(info){
                                    console.log(info,"关闭店铺");
                                    window.location.reload();
                                }
                            })
                        });
                    }
                });
            }
        })
    }

    $('#shopList').on('click','.details',function () {
        var cityId = $.cookie('cityId');
        var id = $(this).attr('data-id');
        console.log(id,"店铺id");
        $.ajax({
            url:"http://116.62.131.70:8080/roo-mobile-web/partner/shop/"+id,
            type:"GET",
            dataType: "JSON",
            contentType: "application/json;charset=utf-8",
            headers: {
                'Authorization': Authorization,
                'provinceId': provinceId,
                'cityId': cityId
            },
            success:function(info){
                console.log(info,"店铺详情");
                $('#shops').css('display','none');
                $('#shopDetail').css('display','block');
                $('.myShopName').text(info.data.shopName);
                // 调用模板引擎处理店铺详情
                var shopsDetailHtml = template("myShopDetail",info.data);
                $(".content").html(shopsDetailHtml);
                $('.back').on('click',function () {
                    $('#shops').css('display','block');
                    $('#shopDetail').css('display','none');
                });
            }
        })
    });
    $('.freshen').on('click',function () {
        window.location.reload();
    })

    // 上移下移
    $(function(){
        //上移
        $('#shopList').on('click','.up',function () {
            var $tr = $(this).parents("tr");
            if ($tr.index() != 0) {
                $tr.fadeOut().fadeIn();
                $tr.prev().before($tr);
            }
        });
        //下移
        $('#shopList').on('click','.down',function () {
            var $tr = $(this).parents("tr");
            if ($tr.index() != 6) {
                $tr.fadeOut().fadeIn();
                $tr.next().after($tr);
            }
        });
    });

})