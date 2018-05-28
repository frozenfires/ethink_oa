/**
 * _View.js 
 *
 * 页面控制器
 * 主要控制页面跳转，及页面数据传递。
 */
var _View = window._View || (function(document, $) {
	var that = {},
		// 交易是否能打开标志
		disableTranopen = false,
		// 当前交易
		currentTranCode, 
		// 上一次交易
		lastTranCode,
		// 视图关闭时触发
		_closeEvent = [],
		// 返回hub页面时触发
		_hubEvent = [],
		// 设备是否open标志
		_deviceOpened = false;

// 打开一个新的页面.
that.open = function(strTranid, funcComplete){
	try{
		viewOpenBefor(function(){
			_open(strTranid,funcComplete);
		}, strTranid);

	}catch(e){
		console.error(e);
	}
}


/**
 * 打开交易联动
 * targetTranid 目标交易id
 * tranData 联动数据
 */
that.tranLinkOpen = function(targetTranid, tranData){
	var tranData = tranData || {},
			mainContent = $("#mainContent");

	checkDevice(targetTranid, function(){
		closeDevice();
		// 保存当前交易码
		tranData.TRANCODE = currentTranCode;
		mainContent.data("_userData", tranData);
		
		_View.open(targetTranid, function(){
			mainContent.removeData("_userData");
		});
	});
}

/**
 * 返回hub页面。
 */
that.hub = function(){
	if(currentTranCode === 'hub'){
		console.debug('当前已是hub，请不要重复请求。');
		return;
	}
	if(currentTranCode!=undefined){
		console.elog(currentTranCode+' 交易结束，返回主界面...');		
	}
	closeCurrentView();
	currentTranCode = 'hub';
	that.open(Config.indexId, function(resp){
		$("#mainContent").html(resp).show();
		if($('.queryDev').is(':hidden')){
			$('.queryDev').show();
		}
		$.getScript('js/common/hub.js');
		for(var i=0; i<_hubEvent.length; i++){
			try{
				_hubEvent[i]();
			}catch(e){
				console.error(e);
			}
		}
	});
}

/**
 * 当前交易码
 */
that.current = function(){
	return currentTranCode;
}

/**
 * 上一次交易。
 */
that.last = function(){
	return lastTranCode;
}

/**
 * 弹出一个视图
 */
var popHeader = '<div class="hide largeModal" tabindex="-1" '+
	'' + 
	'>';
var popFooter = '</div>' +
	'<div class="modal-backdrop largeModal-backdrop in"></div>';
that.popView = function(viewid){
	console.info("准备弹出视图:" + viewid);

	var checked = checkDevice(viewid, function(){
		var url = Config.basePath + "/api/v/" + viewid;
		ajaxHtml(url, function(resp){
			if(resp.indexOf('<!--noView-->') > -1){
				// 系统提示，不继续进行下面的视图渲染。
				$("#popContent").empty().html(resp);
				return;
			}

			html = popHeader + resp + popFooter;
			var popInstance = $(html);
			popInstance.on('hidden', function () {
			  // 视图关闭时销毁实例。
			  popInstance.remove();
			});
			$('body').append(popInstance);
			popInstance.show();
			// 挂接关闭视图事件.
			popInstance.find('.popClose').click(function(){
				popInstance.hide();
				popInstance.remove();
			});
		});
	});
}

/**
 * 设置交易是否可以打开标志。
 */
that.disableTranopen = function(disabled){
//	console.debug('disableTranopen=====' + disabled);
//	disableTranopen = disabled;
}

/**
 * 当前系统是否有操作设备的交易
 */
that.hasDeviceTran = function(){
	return Config.hasDeviceTran;
}

/**
 * 判断当前用户是否有trancode的操作权限。
 */
that.hasTran = function(trancode){
	return Config.tranProp[trancode] ? true : false;
}

/**
 * 获取指定的交易名称
 */
that.getTranname = function(trancode){
	return Config.tranProp[trancode] ? Config.tranProp[trancode].NAME : '';
}

/**
 * 打印页面内容
 * 返回打印窗口document对象
 */
that.print = function(contentSelecter, callback){
	var phtml = $(contentSelecter).html();
	var pwin = window.open('./print.html', 'newwindow','height=600,width=830,top=0,left=0,toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no');
	if(pwin.attachEvent){
		pwin.attachEvent('onload', function(){
			$(pwin.document).find('#printContent').html(phtml);
			if($.isFunction(callback))
				callback(pwin.document);
		});
	}else{
		pwin.onload = function(){
			$(pwin.document).find('#printContent').html(phtml);
			if($.isFunction(callback))
				callback(pwin.document);
		}
	}
}

/**
 * 交易关闭事件。
 */
that.closeEvent = function(func){
	if($.isFunction(func)){
		_closeEvent.push(func);
	}
}

that.hubEvent = function(func){
	if($.isFunction(func)){
		_hubEvent.push(func);
	}
}

//----------------以下为私有方法------------------------------------------

// 打开一个新的页面.
function _open(strTranid,funcComplete){

	$("#changePwd").parent().hide();
	var mainContent = $("#mainContent"),
	url = [Config.basePath, "/api/v/"];
		
	url.push(strTranid);
	url.push(document.location.search);
	
	ajaxHtml(url.join(''), function(resp){
		if(resp.indexOf('<!--noView-->') < 0){
			lastTranCode = currentTranCode;
			currentTranCode = strTranid;
			
			tranOpenBefor(strTranid);
			
		
			var mainHtml = [];
			// mainHtml.push('<div class="tranName">');
			// mainHtml.push('<span>〉'+that.getTranname(strTranid)+'</span>');
			// mainHtml.push('</div>');
			mainHtml.push(resp);
			var htmlTemplet = mainHtml.join('\n');
			mainContent.empty().show().html(htmlTemplet);
			
			tranOpenAfter(strTranid);
			
			if($.isFunction(funcComplete)){
				funcComplete(resp);
			}else{
				// no-op
			}
		}else{
			// 不需要关闭当前页面
			//mainContent.empty().html(resp);
			resp = _.template(resp)(Config);
			$("#popContent").empty().html(resp);
		}
		
		try{
			Common.initControls();
		}catch(e){
			console.error(e);
		}
	}
	// , function(resp){
	// 	Alert.error(resp.MESSAGE, function(){
	// 		if(resp.MESSAGE == '登录超时'){
	// 			window.location.href = 'login.html';
	// 		}
	// 	});
	// }
	);
};

/**
 * 交易展现前处理
 */
function tranOpenBefor (viewid) {
	// 隐藏hub页面。
	$(".hub").hide();
	// 隐藏修改密码功能
	$("#changePwd").parent().hide();
	// 设置头信息
	$('.tranName').html('&nbsp;〉'+that.getTranname(viewid));
}

/**
 * 交易展现后处理
 */
function tranOpenAfter (viewid) {
	
}

/**
 * 获取远程hmtl文件
 */
function ajaxHtml (url, sucessCallBack, errorCallback) {
	$.ajax( {
  		"type": "GET", 
  		"contentType": "application/html; charset=utf-8",
  		"url": url, 
  		"dataType": "html",
  		"data": {}, //以json格式传递
  		"cache": false,
  		"success": function(resp) {
        	if($.isFunction(sucessCallBack)){
        		var htmlTemplet = resp;
				htmlTemplet = _.template(htmlTemplet)(Config);
        		sucessCallBack(htmlTemplet);
        	}
  		},
  		"error": ajaxHtmlError
  	});
}

/**
 * 错误处理方法
 */
function ajaxHtmlError (errObj) {
	Alert.error("没有找到资源文件");
	console.info("资源请求失败,status=" + errObj.status);
	console.info(errObj.responseText);
}

/**
 * 视图开启前检查设备是否正常打开
 */
function viewOpenBefor (_callBack, viewid) {
	if(currentTranCode !== Config.indexId){
		closeCurrentView();
	}

	_callBack();
}

/**
 * 关闭设备，并清空必要的数据。
 */
function closeDevice (argument) {
	try{
		EbCashIn.clearEvent();
		EbDispenser.clearEvent();
		if (Config.twoTeller) {
			EbCashIn.UnlockDevice();
			EbDispenser.UnlockDevice();
		}
		if(Config.getCurrentDevObject()){
			Config.getCurrentDevObject().CloseDevice();
		}
	}catch(e){
		console.info('_View.closeDevice error:' + e);
	}
}

function _doOpenDevice(_callBack){
	//如果当前尚未open设备，则立即open
	if (!_deviceOpened) {
		Alert.processing("系统正在初始化，请稍候...");
		// 打开存取款模块。
		var disRet = EbDispenser.OpenDeviceSync();
		var casRet = EbCashIn.OpenDeviceSync();
		if(disRet < 0 || casRet < 0){
			Alert.error("设备打开失败");
			return;
		}else{
			_deviceOpened = true;
		}
		console.debug('打开存取款模块成功');

		_wait(_callBack, function(){
			var status = EbDispenser.StDeviceStatus();
			console.debug('检查设备状态:'+status);
			if(status !== 'BUSY')
				return true;
			else
				return false;

		}, 2200, 30);
	}else{
		_callBack();
	}
}

/**
 * 等待条件满足时再执行
 * _break: 判断条件
 * _action: 条件满足时执行
 * _time: 隔多长时间检查以此
 * _int: 检查多少次后超时
 */
function _wait (_action, _break, _time, _int) {
	_action = _action || function(){};
	_break = _break || function(){};
	if(_break()){// 满足跳出条件
		_action();
	}
	else if(_int <= 0){// 超时退出
		_action(-1);
	}
	else{// 继续检查
		window.setTimeout(function(){
			_wait(_action, _break, _time, _int-1);
		} ,_time);
	}
}

/**
 * 检查设备是否存在。
 */
function checkDevice (viewid, _checkDeviceCallback) {
  _doOpenDevice(function(){
  	//判断交易模块的状态
	var dev = Config.getCurrentDevObject() || EbDispenser;
	var status = dev.StDeviceStatus();
	
	if(status !== 'NODEVICE' && status !== ''){
		//...
	}
	else if (status === "BUSY") { // 如果设备处于锁定状态则提示后终止操作，否则锁定设备后继续操作
		Alert.info("设备被锁定，请稍候再试...");
		disableTranopen = false;
		return;
	}else{
		var checked = {'NODEVICE': '设备未连接', '': '设备已断开'}[status] || '设备异常';
		Alert.info(checked + ',点击确定后重新连接。', function(){
			Alert.processing('正在连接，请稍候...');
			disableTranopen = false;
			var disRet = EbDispenser.OpenDeviceSync();
			var casRet = EbCashIn.OpenDeviceSync();
			Alert.processingCancel();
		});  
	}

	// 处理双柜员逻辑
	if(status != undefined && Config.twoTeller){
		var dev = Config.getCurrentDevObject() || EbDispenser;
		dev.LockDevice();
	}

	if($.isFunction(_checkDeviceCallback))
		_checkDeviceCallback(status);
  });
	
	
}


/**
 * 关闭当前视图，清除视图数据，解除视图事件。
 */
function closeCurrentView(){
	for (var i = _closeEvent.length - 1; i >= 0; i--) {
		try{
			_closeEvent[i]();
		}catch(e){}
	};
	_closeEvent=[];

	Alert.processingCancel();
	console.info("_View 清除事件绑定...");
	lastTranCode = currentTranCode;
	$("#mainContent *").off();
//	$("#mainContent").removeData("_userData").hide();
//	mainContent.empty();
	// 先将设备状态图标隐藏掉
};

/**
 * 判断给定交易是否需要使用设备
 */
function useDevice (viewid) {
	if(Config.tranProp && Config.tranProp[viewid] && Config.tranProp[viewid].AUTH === 'device'){
		// 当前交易不使用设备，则直接返回true，不进行校验。
		return true;
	}else{
		return false;
	}
}


console.info('View模块初始化成功...');
return that;
// 页面控制器结束
}(document, window.jQuery));
window._View = _View;