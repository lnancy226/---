/**
 * Created by 919482722 on 2018/1/24.
 */
// console.log($.cookie('info'),'info');
window.onerror = function (err) {
    log('window.onerror: ' + err)
}
/*这段代码是固定的，必须要放到js中*/
function setupWebViewJavascriptBridge(callback) {
    //Android使用
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener(
            'WebViewJavascriptBridgeReady'
            , function() {
                callback(WebViewJavascriptBridge)
            },
            false
        );
    }

//iOS使用
    if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe)
    }, 0)
    console.log(window.WVJBCallbacks);

}

/*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
setupWebViewJavascriptBridge(function (bridge) {
    var u = navigator.userAgent;
   var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
   var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    var uniqueId = 1

    function log(message, data) {
        var log = document.getElementById('log')
        var el = document.createElement('div')
        el.className = 'logLine'
        el.innerHTML = uniqueId++ + '. ' + message + ':<br/>' + JSON.stringify(data)
//            console.log(log.children.length);
        if (log.children.length) {
            log.insertBefore(el, log.children[0])

        } else {
            log.appendChild(el)

        }
    }

    /* Initialize your app here */
    /*我们在这注册一个js调用OC的方法，不带参数，且不用ObjC端反馈结果给JS：打开本demo对应的博文*/
    // bridge.registerHandler('openWebviewBridgeArticle', function () {
    //     log("openWebviewBridgeArticle was called with by ObjC")
    // })
    /*JS给ObjC提供公开的API，在ObjC端可以手动调用JS的这个API。接收ObjC传过来的参数，且可以回调ObjC*/
    // bridge.registerHandler('getUserInfos', function (data, responseCallback) {
    //     console.log(data);
    //
    //     log("Get user information from ObjC: ", data)
    //     responseCallback({'userId': '123456', 'blog': '标哥的技术博客'})
    // })

    /*JS给ObjC提供公开的API，ObjC端通过注册，就可以在JS端调用此API时，得到回调。ObjC端可以在处理完成后，反馈给JS，这样写就是在载入页面完成时就先调用*/
    if (isiOS) {
        bridge.callHandler('getUserIdFromObjC', null, function (responseData) {
            // alert(responseData.accessToken);
            var token = responseData.accessToken;
            $.cookie("Authorization", token);
            log("JS call ObjC's getUserIdFromObjC function, and js received response token:", token)
        })
    }
if(isAndroid) {
    bridge.callHandler('getUserIdFromObjC', null, function (responseData) {
        // alert(responseData);
        var token = responseData;
        $.cookie("Authorization", token);
        log("JS call ObjC's getUserIdFromObjC function, and js received response token:", token)
    })
    // 调取安卓相机图片
    $('#appCamera').on('tap', function () {
        bridge.callHandler('getCamera', null, function (responseData) {
            // alert(responseData);
            var doorPhoto = responseData;
            // alert(doorPhoto+'door2');
            $.cookie("doorPhoto", doorPhoto);
            $('#blah').attr('src', responseData);
            log("JS call ObjC's getUserIdFromObjC function, and js received response doorPhoto:", responseData);
            // $.cookie("doorPhoto", doorPhoto);
        })
    })

}


    /*返回原生机构入口*/
    $('#back').on('tap',function () {
        bridge.callHandler('getBack', function() {
            log('返回原生机构入口')
        })
    })

    /*关闭机构*/
    $('#close').on('tap',function () {
        bridge.callHandler('closeOrg', function () {
            log('关闭机构')
        })
    })

    // 聊一聊
    $('.sendMessage').on('tap',function () {
        var data = $.cookie('info');
        bridge.callHandler('chatMore',data, function () {
            log('info',data);
        })
    })

    // 立即咨询
    $('.expDetail').on('click','.consult-now',function () {
        var tel = $.cookie('tel');
        bridge.callHandler('callPhone',{'tel':tel}, function () {
        })
    })

    // 调取安卓相机
    // var u = navigator.userAgent;
    // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    // var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    // if(isAndroid){
    //     $('#appCamera').on('click',function () {
    //         bridge.callHandler('getCamera',null, function (responseData) {
    //             alert(responseData);
    //         })
    //     })
    // }
})
