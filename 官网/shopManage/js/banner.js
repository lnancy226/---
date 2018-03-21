$(document).ready(function() {

    var timer = null;
    var num = 0;

    $("#box ol li").mouseover(function() {
        core($(this).index());
        num = $(this).index();
    });
    //====================
    function　 core(num) {
        $("#nav li").eq(num).addClass("active").siblings().removeClass("active");
        // 每隔1.5秒 让ul里面的li 对应的li（本来是索引 这里索引用变量来控制）淡入，让别人淡出
        $("#box ul li").eq(num).fadeIn(500).siblings().fadeOut(500);
    }

    function autoPlay() {
        num++;
        if (num > $("#nav li").length - 1) num = 0;
        core(num);
    }

    timer = setInterval(autoPlay, 3000);
    $("#box").mouseenter(function() {
        clearInterval(timer);
        $("#box>a").fadeIn();
    })
    $("#box").mouseleave(function() {
        timer = setInterval(autoPlay, 3000);
        $("#box>a").fadeOut();
    })
    $("#left").click(function() {
        num--;
        if (num < 0) num = $("#nav li").length - 1;
        core(num);
    })
    $("#right").click(function() {
        autoPlay();
    })
})