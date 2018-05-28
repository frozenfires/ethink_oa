/**
 * alert.js 
 *
 * 页面提示信息
 */
var Alert = window.Alert || (function(document, $) {
	
	var that = {}, staticZindex = 0;

   // confirmWindow
   var parts = ['<div class="Alert modal message hide ">'];
	parts.push('<div class="modal-header">');
	// parts.push('<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>');
	parts.push('</div>');
	parts.push('<div class="modal-body row-fluid">');
	parts.push('<h3 id="myModalLabel"></h3>');
	parts.push('</div>');
	parts.push('<div class="modal-footer">');
	parts.push('<button class="btn btn-large" data-dismiss="modal" aria-hidden="true">取消</button>');
	parts.push('<button id="prompted" class="btn btn-primary btn-large ">确定</button>');
	parts.push('</div>');
   parts.push('</div>');
	var confirmDiv = $(parts.join("\n"));

   // infoWindow
   parts = ['<div class="Alert modal message hide ">'];
   parts.push('<div class="modal-header">');
   // parts.push('<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>');
   parts.push('</div>');
   parts.push('<div id="myModalLabel" class="modal-body row-fluid">');
   // parts.push('<h3></h3>');
   parts.push('</div>');
   parts.push('<div class="modal-footer">');
   parts.push('<button id="close" class="btn btn-large btn-primary ">确定</button>');
   parts.push('</div>');
   parts.push('</div>');     
   var infoDiv = $(parts.join("\n"));

   // sucessWindow
   parts = ['<div class="Alert modal message hide ">'];
   parts.push('<div class="modal-header">');
   // parts.push('<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>');
   parts.push('</div>');
   parts.push('<div id="myModalLabel" class="modal-body row-fluid">');
   // parts.push('<h3></h3>');
   parts.push('</div>');
   parts.push('<div class="modal-footer">');
   parts.push('<button id="close" class="btn btn-large btn-primary ">确定</button>');
   parts.push('</div>');
   parts.push('</div>');     
   var sucessDiv = $(parts.join("\n"));

   // processingWindow
   parts = ['<div class="Alert modal message hide">'];
   parts.push('<div id="header" class="modal-header ">');
   // parts.push('<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>');
   parts.push('</div>');
   parts.push('<div class="modal-body row-fluid " >');
   // parts.push('<div class="span3" id="image"></div>');
   // parts.push('<div  class="span8">');
   parts.push('<h3 id="myModalLabel"></h3>');
   // parts.push('</div>');
   parts.push('</div>');
   parts.push('<div class="modal-footer ">');
   // parts.push('<button id="close" class="btn btn-primary">关闭</button>');
   parts.push('</div>');
   parts.push('</div>'); 
   var processingDiv = $(parts.join("\n"));
                   
   // errorWindow
   parts = ['<div class="Alert modal message hide" >'];
   parts.push('<div id="header" class="modal-header ">');
   // parts.push('<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>');
   parts.push('</div>');
   parts.push('<div class="modal-body row-fluid">');
   // parts.push('<div  class="span8">');
   parts.push('<h3 id="msgbody" >错误信息</h3>');
   // parts.push('</div>');
   parts.push('</div>');
   parts.push('<div class="modal-footer">');
   parts.push('<button class="btn btn-large btn-primary" data-dismiss="modal">关闭</button>');
   parts.push('</div>');
   parts.push('</div>');
   var errorDiv = $(parts.join("\n"));
   
  // ---confirm窗口--------------------------------------------------
   var _confirmCallback;
	confirmDiv.find("#prompted").click(function(){
      $(this).button('loading');
            try{
               confirmDiv.modal('hide');
               if($.isFunction(_confirmCallback)){
                  _confirmCallback();
                  _confirmCallback = null;
               }
           }catch(e){console.error(e, "Alert.confirm:");}
   });
   var bIsNoOccupy = false;
   that.SetNoOccupy = function(bFlag)
   {
      bIsNoOccupy = bFlag;
   }

   that.confirm = function(tip, callback){
      confirmDiv.find("#prompted").button('reset');
      _confirmCallback = callback;
      console.debug("confirm " + confirmDiv.css("display"));
      if (!isNeedToShow(confirmDiv)){
         return ;
      }

      if(showing(confirmDiv)){
         throw new Error("confirm 同时间时能显示一个。");
      }else{
         confirmDiv.find("#myModalLabel").html(tip);
         confirmDiv.modal({keyboard: false, backdrop: "static"});
         confirmDiv.css({'z-index': getZindex(confirmDiv)});
         // confirmDiv.modal('show');
      }
   };
   that.comfirmCancel = function(){
      console.debug("取消 infoCancel");
      confirmDiv.modal("hide");
   }; 
   
   // ---processing窗口--------------------------------------------------
   processingDiv.find("#close").click(function(){
            processingDiv.modal('hide');
   });
   that.processing = function(msg){
      console.debug("打开 processingDiv " + processingDiv.css("display"));
      if (!isNeedToShow(processingDiv)){
         return ;
      }      
      if(showing(processingDiv)){
         processingDiv.find("#myModalLabel").html(msg);
      }else{
         processingDiv.find("#image").html('<div class="progress progress-indeterminate"><div class="bar"></div></div>');
         processingDiv.find("#myModalLabel").html(msg);
         processingDiv.modal({keyboard: false, backdrop: "static"});
         // processingDiv.modal('show');
      }
      processingDiv.css({'z-index': getZindex(processingDiv)});
   };
   that.processingCancel = function(){
      console.debug("取消 processingCancel");
      processingDiv.modal("hide");
   };

   // ---success窗口--------------------------------------------------
   var _successCallback;
   sucessDiv.find("#close").click(function(){
      $(this).button('loading');
      sucessDiv.modal('hide');
      if($.isFunction(_successCallback)){
               _successCallback();
               _successCallback = null;
      }
   });
   that.success = function(msg, _callback){
      sucessDiv.find("#close").button('reset');         
      _successCallback = _callback;
      console.debug("sucessDiv " + sucessDiv.css("display"));
      if (!isNeedToShow(sucessDiv)){
         return ;
      }

      if(showing(sucessDiv)){
         sucessDiv.find("#myModalLabel").html(sucessDiv.find("#myModalLabel").html() + "||" +msg);
      }else{
         sucessDiv.attr("class", "modal message hide ");
         if(msg.indexOf("<") < 0){
            msg = "<h3>" + msg + "</h3>";
         }
         sucessDiv.find("#myModalLabel").html(msg);
         sucessDiv.modal({keyboard: false, backdrop: "static"});
         // sucessDiv.modal('show');
      }
      sucessDiv.css({'z-index': getZindex(sucessDiv)});
   };

   // ---info窗口--------------------------------------------------
   var _infoCallback;
   infoDiv.find("#close").click(function(){
      $(this).button('loading');
            infoDiv.modal('hide');
            if($.isFunction(_infoCallback)){
               _infoCallback();
               _infoCallback = null;
            }
   });
   that.info = function(msg, _callback){
	infoDiv.find('#close').button('reset');
      _infoCallback = _callback;
      console.debug("infoDiv.info " + infoDiv.css("display"));
      // if(showing(infoDiv)){
      //    var oldmsg = infoDiv.find("#myModalLabel").html();
      //    infoDiv.find("#myModalLabel").html(oldmsg + msg);
      // }else{
      if (!isNeedToShow(infoDiv)){
         return ;
      }  


         infoDiv.attr("class", "modal message hide ");
         if(msg.indexOf("<") < 0){
            msg = "<h3>" + msg + "</h3>";
         }
         infoDiv.find("#myModalLabel").html(msg);
         // 清除缓存数据，修复缺陷：莫名覆盖backdrop属性的问题
         var idata = infoDiv.data('modal');
         if(idata && idata.options && idata.options.backdrop){
            idata.options.backdrop = 'static';
         }
         infoDiv.modal({keyboard: false, backdrop: "static"});
         infoDiv.css({'z-index': getZindex(infoDiv)});
         // infoDiv.modal('show');
      // }
   };
   that.infoCancel = function(){
      console.debug("取消 infoCancel");
      _infoCallback = null;
      infoDiv.modal("hide");
   };
   

   // ---error窗口--------------------------------------------------
   var _errorCallback;
   errorDiv.on('hidden', function(){
      if(_errorCallback){_errorCallback();_errorCallback=null;}
   });
   that.error = function(msg, callback){
      console.debug("errorDiv " + errorDiv.css("display"));
      if (!isNeedToShow(errorDiv)){
         return ;
      }  

      _errorCallback = callback;
      try{// 如果有processing 正在弹出，先关闭。
         that.processingCancel();
      }catch(e){}
      if(showing(errorDiv)){
         var lastmsg = errorDiv.find("#msgbody").html();
         errorDiv.find("#msgbody").html(lastmsg + msg);
      }else{
         errorDiv.find("#msgbody").html(msg);
         errorDiv.modal({keyboard: false, backdrop: "static"});
      }
      errorDiv.css({'z-index': getZindex(errorDiv)});
   };

   
   /**
    * 底部的提示信息
    * 数据格式为数组[{type: '', rule: '',  value: '', level: ''},{},...]
    */
   parts = ['<div class="bottominfo">'];
   parts.push('</div>');
   var bottominfo = $(parts.join("\n"));
   that.bottominfo = function(infodata, clickAction, closeAction){
      if($.isArray(infodata) && infodata.length > 0){
         var citem, itemParts = [];
         for(var i=infodata.length -1; i>0; i--){
            var citem = infodata[i];
            itemParts.push('<div class="msgrow hide">');
            itemParts.push('<div class="left"><a class="" href="javascript:void(0);"></a><i class="level level'+citem.level+'"></i></div>');
            itemParts.push('<div class="msg">'+getBInfoMsg(citem)+'</div>');
            itemParts.push('<div class="right"><a class="" href="javascript:void(0);"></a></div>');
            itemParts.push('</div>');
         }

         citem = infodata[0];
         itemParts.push('<div class="ctrrow">');
         itemParts.push('<div class="left"><a class="flex collapse" href="javascript:void(0);"></a><i class="level level'+citem.level+'"></i></div>');
         itemParts.push('<div class="msg">'+getBInfoMsg(citem)+'</div>');
         itemParts.push('<div class="right"><a class="close_x" href="javascript:void(0);"></a></div>');
         itemParts.push('</div>');
         

         bottominfo.html(itemParts.join('\n'));

         // 绑定事件
         bottominfo.find('.ctrrow .flex').click(binfoFlexToggle);
         bottominfo.find('.ctrrow .close').click(function(){
            bottominfo.remove();
            DataContainer.setSysData('_binfoStatus', 'closed');
            if($.isFunction(closeAction)){
               closeAction();
            }
         });
         bottominfo.find('.msg').click(clickAction);

         var _binfoStatus = DataContainer.getSysData('_binfoStatus');
         if(_binfoStatus !== 'collapse'){
            binfoFlexExpand();
         }

         if($('.bottominfo').length <= 0){
            $('.footer').before(bottominfo);
         }         
      }else{
         // no-op
      }
   }

   /**
    * 弹出窗口
    */
   that.popWindow = function(modalInstance){
      modalInstance.modal({keyboard: false, backdrop: "static"});
      return modalInstance;
   }

   /**
    * 关闭弹出窗口
    */
   that.closeWindow = function(modalInstance){
      modalInstance.modal('hide');
      return modalInstance;
   }

   

//-----------------------以下是内部方法-------------------------------------------------   

   /**
    * 展开底部提示。
    */
   function binfoFlexExpand (argument) {
      bottominfo.find('.msgrow').show();
      DataContainer.setSysData('_binfoStatus', 'expanded');
      bottominfo.find('.ctrrow .flex').removeClass('collapse').addClass('expanded');
   }

   /**
    * 收起底部提示
    */
   function binfoFlexCollapse (argument) {
      bottominfo.find('.msgrow').hide();
      DataContainer.setSysData('_binfoStatus', 'collapse');
      bottominfo.find('.ctrrow .flex').removeClass('expanded').addClass('collapse');
   }

   /**
    * 用于bottominfo的伸缩逻辑处理
    */
   function binfoFlexToggle (argument) {
      var status = DataContainer.getSysData('_binfoStatus');
      if(status === 'expanded'){
         binfoFlexCollapse();
      }else{
         binfoFlexExpand();
      }
   }

   /**
    * 用于bottominfo 中对item信息msg的提取
    */
   function getBInfoMsg (item) {
      var name = item.type === '0' ? '回收箱' : item.type + "面额钞箱";
      return name + "钞币存储量已" + item.rule + item.value + "！";
   }


   /**
    * 提供非阻断式的提示信息。 依赖于messenger插件
    */
   $._messengerDefaults = {
      extraClasses: 'messenger-fixed messenger-theme-future messenger-on-bottom messenger-on-right'
   };
   that.msg = function(msg, type, callback){
      $.globalMessenger().post({
         message: msg,
         type: type,
         showCloseButton: true,
         actions: {
            cancel: {
               label: '查看详情',
               phrase: 'Retrying TIME',
               auto: true,
               delay: 10,
               action: function(){
                  try{
                     callback();
                  }catch(e){
                     console.error(e);
                  }
               }
            }
         }
      });
   };


/**
 * 判断Dom对象是否处于展现状态。
 * obj :jqueyr包装后的dom对象。
 */
function showing (obj) {
   var showing = !confirmDiv.is(":hidden");
   return showing;
}   

function isNeedToShow(obj)
{
   // 如果 不抢占标志为true 那么，只有对象显示时，才为返回false
   if (bIsNoOccupy && !obj.is(":hidden"))
   {
         console.debug("目前无法显示提示信息，因为 非抢占标识为true 且 已经有提示信息存在。" + obj );
         return false;
   };
   return true;
}

function getZindex (sourceObj) {
   var zindex = Util.parseInt(sourceObj.css('z-index'), 0);
   staticZindex = zindex <= staticZindex ? staticZindex + 10 : zindex;
   console.info('zindex='+zindex+',staticZindex='+staticZindex);
   return staticZindex;
}


   return that;
// TranMng结束
}(document, window.jQuery));
window.Alert = Alert;
