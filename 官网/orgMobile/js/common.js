/**
 * Created by IBM on 2016/4/28.
 */
var AjaxForm = function(cfg){
    if (!window.FormData){
        alert("Sorry, your browser doesn't supoort FormData!");
    }

    /**
     * null or undefined 返回true, 否则false
     */
    this.isNullOrUndefined = function(v, errMsg){
        if (!v){
            alert(errMsg);
            return true;
        }
        return false;
    };

    var cfg = cfg || {};
    if (this.isNullOrUndefined(cfg.id, "id can't be empty")) return;
    if (this.isNullOrUndefined(cfg.url, "url can't be empty")) return;

    this.id = cfg.id; // 表单id
    this.method = cfg.method || "POST"; //默认POST方法
    this.url = cfg.url;
    this.async = !cfg.sync; //同步否
    this.resultType = cfg.resultType || "text"; //返回结果类型 json对象或text
    this.formData = new FormData(document.getElementById(this.id)); //form数据
    this.xhr = new XMLHttpRequest(); //当前请求对象

    /**
     * 超时事件
     * 配置格式：
     *   timeout : xxx,
     *   onTimeout: function(event){}
     */
    if (cfg.timeout){
        this.xhr.timeout = cfg.timeout;
        this.xhr.ontimeout = cfg.onTimeout;
    }

    /**
     * 发送过程事件
     * 配置格式:
     * onProgress: function(loaded, total){}
     */
    if (cfg.onProgress){ //发送数据过程
        this.xhr.upload.onprogress = function(e){
            if (e.lengthComputable) {
                cfg.onProgress(e.loaded, e.total);
            }
        };
    }

    /**
     * 上传完成事件
     */
    if (cfg.onComplete){
        this.xhr.onload = function(event){
            var res = event.target.responseText;
            if (this.resultType === 'json'){
                if ((typeof JSON) === 'undefine'){
                    res = eval("("+res+")");
                } else{
                    res = JSON.parse(res);
                }
            }
            cfg.onComplete(res);
        };
    }

    /**
     * 发出请求
     */
    this.request = function(){
        this.xhr.open(this.method, this.url, this.async);
        this.xhr.send(this.formData);
    };
};