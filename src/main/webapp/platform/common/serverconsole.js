/**
 * 定义服务端console
 * 用于将日志保存到服务端
 */
var ServerConsole = window.ServerConsole || (function(document, $){

var that = {};

window.console = window.console || {info:function(){}, debug:function(){}};
var msgparts = [],
   _sysconsole = window.console;

//----------------------自定义console-----------------------------------------------------
// 在控制台输出一条消息，包含一个指向代码调用位置的超链接。假如是直接在控制台输入该命令，就不会出现超链接（和console.log()一样）。
that.info = function (msg){log("info", msg);};
that.elog = function (msg){log("elog",msg);};
that.debug = function (msg){log("debug", msg);};
// 在控制台输出一条带有“信息”图标的消息和一个指向代码调用位置的超链接。
that.log = function (msg){log("log", msg);};
// 在控制台输出一条带有“标志”图标的消息和一个指向代码调用位置的超链接。
that.warn = function (msg){log("warn", msg);};
//在控制台输出一条带有“警告”图标的消息和一个指向代码调用位置的超链接。
that.error = function (msg){log("", msg);};
//在控制台输出一条带有“错误”图标的消息和一个指向代码调用位置的超链接。
//assert : function (){}, //(expression[, object, ...])
//测试表达式expression是否为真。如果不是真，会在控制台写一条消息并抛出异常
that.trace = function (msg){log("trace", msg);};
//----------------------定义console 结束-----------------------------------------------------


/**
 * 输出日志
 * level :日志界别
 * msg: 日志内容
 */
function log(level, msg){
	//TODO: 添加一些公共属性
	//TODO: 发送日志到服务端
   try{
      if(level === 'info')
         _sysconsole.info(msg);
      else{
        if(_sysconsole.debug){
          _sysconsole.debug(msg);
        }else{
          _sysconsole.info("_debug:" + msg);
        }
      }
   }catch(e){}

   msgparts.push({'level': level, 'msgdata': currentMillise() + " " + level + " " + msg});
}

function send2server(data){
   var data={"SERVICE":"LogWriteService", "logInfo":data};
   // _sysconsole.info('send2server,data=' + JSON.stringify(data));
  $.ajax( {
      "type": "POST", 
      "contentType": "application/json; charset=utf-8",
      "url": Config.basePath + "/normal.do?method=doAction", 
      "dataType": "json",
      "data": JSON.stringify(data), //以json格式传递
      "cache": false,
      "success": function(resp) {
      },
      "error": function(errinfo){
      }
    });
}

/**
 * 每隔10秒发送一次日志
 */
function autoSavelog (argument) {
	 if(msgparts.length > 0){
         send2server(msgparts);
         msgparts = [];
     }else{
      	//
     }
   window.setTimeout(autoSavelog, 9900);
}

/**
 * 获取当前时间戳
 */
function currentMillise(){
  var x = new Date();
  return ''+x.getFullYear() + (x.getMonth() + 1) + x.getDate() + ' ' + x.getHours() + ':' + x.getMinutes() + ':' + x.getSeconds()  + ':' +  x.getMilliseconds();  
};


function init (argument) {
   window.console = that;
   autoSavelog();
   _sysconsole.info('ServerConsole模块初始化成功...');
}
init();

return that;
}(document, window.jQuery));
window.ServerConsole = ServerConsole;

