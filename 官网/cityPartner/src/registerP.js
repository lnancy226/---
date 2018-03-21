/**
 * Created by 919482722 on 2018/2/1.
 */

var type = $.cookie('type');
console.log(type,'type');
//选择省份
getProvince();
function getProvince() {

    var data  = JSON.stringify({
        level:0,
        parentId:0
    });

    $.ajax({
        url: 'http://116.62.131.70:8080/roo-mobile-web/cnarea/read/list',
        // beforeSend: function (request) {
        //     request.setRequestHeader("Authorization", Authorization);
        // },
        type: 'PUT',
        contentType: "application/json;charset=utf-8",
        data: data,
        success: function (info) {

            console.log(info,"获取省份");
            $.each(info.data,function(index,value){
                $(".province").append("<option value=" + value.id + ">" + value.shortName + "</option>");    //取到所有一级宝贝标签并将其导入到select中
            });
            // requestCity(myProvinceId);
            //
            // 当一级标签更改的时候调取到相应二级标签的数据
            // $(".province").change(function () {
            //     var provinceId = $(this).find("option:selected").val();
            //     $(".city").find("option").remove();
            //     // $(".district").find("option").remove();
            //     requestCity(provinceId);
            // });
        }
    });
}

//获取当前省份下市的数据，封装好的函数
// function requestCity(provinceId) {
//     var data  = JSON.stringify({
//         level:1,
//         parentId:provinceId
//     });
//
//     $.ajax({
//         url: 'http://116.62.131.70:8080/roo-mobile-web/cnarea/read/list',
//         type: 'PUT',
//         contentType: "application/json;charset=utf-8",
//         data: data,
//         success: function (info) {
//
//             console.log(info,"获取城市");
//             $.each(info.data,function(index,value){
//                 $(".city").append("<option value=" + value.id + ">" + value.shortName + "</option>");    //取到所有一级宝贝标签并将其导入到select中
//             });
//         }
//     });
// };

// 提交信息
$('#submit').on('click',function () {
    // if($('#typeResult').text() == '') {
    //     // alert('所属类型不能为空！');
    //     mui.toast('所属类型不能为空！');
    //     return;
    // };
    // if($('#cityResult').text() == '') {
    //     mui.toast('所在地区不能为空！');
    //     return
    // };
    parameters = JSON.stringify({
        type: type,
        name: $('#inputName').val(),
        no: $('#inputId').val(),
        provinceId: $(".province").find("option:selected").val(),
        // cityId: $(".city").find("option:selected").val(),
        phone: $("#inputTel").val(),
        remark: $('#inputText').val()
    });
    console.log(parameters,"城市合伙人申请提交参数");


    $.ajax({
        url: 'http://116.62.131.70:8080/roo-mobile-web/partner/apply',
        type: 'post',
        contentType: "application/json;charset=utf-8",
        data: parameters,
        success: function (info) {
            // console.log(info,"城市合伙人申请");
            if(info.httpCode == 200) {
                location.href = './login.html';
                alert('提交成功，请等待审核');
            }else{
                alert("提交失败:"+info.msg);
            }
        }
    });
})