/**
 * systemmng.js 
 *
 * 子系统管理器
 * 主要控制主系统及子系统的生命周期，数据传输等操作。
 */
var Systemmng = window.Systemmng || (function(document, $) {
	var that = {},
	    openEventListener = {},
	    lastTranCode,
	    currentTranCode,
	    lastSystem,
	    currentSystem;
	
	/**
	 * 判断交易是否属于子系统
	 */
	that.isSubsystem = function(tranid){
		var tran = Config.tranProp[tranid];
		// 如果其父资源id是以'sys_'开头的，则属于子系统。
		if(tran.PID && tran.PID.indexOf('sys_') === 0){
			return true;
		}else{
			return false;
		}
	}

	that.getSystemId = function(tranid){
		var tran = Config.tranProp[tranid],
			url = tran.URL || '';

		url = url.split('/');
		if(url.length > 1){
			return url[1];
		}else{
			return '';
		}
	}

	/**
	 * 打开系统交易。
	 */
	that.open = function(strTranid, funcComplete){
		console.info('systemOpen----------------------->'+strTranid+',system='+that.getSystemId(strTranid)+',lastView='+currentTranCode);
		var systemid = Config.tranProp[strTranid].PID,
			systemurl = Config.tranProp[systemid] ? Config.tranProp[systemid].URL : '';

		if(systemurl && systemurl.indexOf("http://") > -1){
			openSystem_postMsg(strTranid, funcComplete);
		}else{
			openSystem_systemEvent(strTranid);
		}
	}
	
	/**
	 * 关闭子系统
	 */
	that.close = function(){
		$('._subsystem', document).each(function(){
			try{
				Systemmng.postMsg(this.id, 'hub', {'msgtype': 'logout', 'url':'hub'});
			}catch(e){
				console.error(e);
			}
		});
	}

	that.showSubystem=function(systemid){
		$("#subsystem #"+systemid, document).show();
		$('#mainsystem', document).hide();
		$("#subsystem", document).show();
	}

	that.showMainsystem=function(viewid){
		
		// if(currentSystem !== 'mainsystem'){
		// 	_View.hub();
		// }
		// if(viewid === 'hub'){
		// 	currentTranCode = 'adminMain';
		// }

		// lastSystem = currentSystem;
		// currentSystem = 'mainsystem';
		
		// $("#subsystem *", document).hide();
		// $('#mainsystem', document).show();
		EMenuexpand();
	}

	/**
	 * 发送消息的方式触发子系统打开交易
	 */
	that.postMsg = function(systemid, tranid, params){
		var _params = $.extend({
			systemid: systemid,
			tranid: tranid,
			msgtype: "tranopen"
		}, params);
		console.info(_params);
		console.info("准备打开子系统postMsg["+systemid+"]的交易["+tranid+"]");
		var targetWindow = $('#right #'+_params.systemid)[0].contentWindow;
		
		var msgObj = {
			"msgtype": _params.msgtype,
			"msgdata": {
				tranid: _params.tranid,
				tranurl: _params.url || Config.tranProp[_params.tranid].URL,
				sessionId: Config.sessionId,
				tokenData: {
					orgname: Config.orgName,
					orgid: Config.org,
					username: Config.userName,
					userid: Config.currentUser
				},
				trancloseEval: "Systemmng.showMainsystem('hub');"
			}
		};

		var targetUrl = Config.tranProp[systemid].URL;
		if(targetUrl.indexOf("http") < 0){
			targetUrl = "http://"+document.location.host + Config.basePath + targetUrl
		}
		targetWindow.postMessage(JSON.stringify(msgObj), targetUrl);
		that.showSubystem(systemid);
	}

	/**
	 * 触发子系统事件。
	 */
	that.triggerEvent = function(systemid, tranid) {
		console.info("准备打开子系统["+systemid+"]的交易["+tranid+"]");
		var targetDocument = document.getElementById(systemid).contentDocument,
			targetWindow = document.getElementById(systemid).contentWindow;

		if(targetWindow && targetWindow.$){
			targetWindow.$(targetDocument).triggerHandler('tranopen', [{
				tranid: tranid,
				tranurl: Config.tranProp[tranid].URL,
				tokenData: {
					orgname: Config.orgName,
					orgid: Config.org,
					username: Config.userName,
					userid: Config.currentUser
				},
				tranclose: function(){
					that.showMainsystem();
				}
			}]);

			that.showSubystem(systemid);
		}else{
			console.debug("无法打开目标系统交易，因为目标系统没有引入jquery");
		}
	}
	
	/**
	 * 当前交易码
	 */
	that.current = function(){
		if(currentSystem === 'mainsystem'){
			try{
				return _View.current();
			}catch(e){}
		}else{
			return currentTranCode;
		}
	}

	/**
	 * 打开管理平台主页面。
	 */
	that.hub = function(){
		that.open(Config.indexId);
	}
	
//-------------------------私有方法分割线----------------------------------------------------------------------------
	/**
	 * 保存常用交易
	 */
	function saveVisited () {
		var cookieId = Config.currentUser + '_visitedTrans',
			visited = Util.getCookie(cookieId),
			// viewid = that.current();
			viewid = lastTranCode;
		console.debug("Systemmng.saveVisited.info:::visited="+visited+",viewid="+viewid);
		// 如果主页列表中包含当前的viewid,则不保存为常用交易
		for (var i in Config.indexList) {
			if(Config.indexList[i].ID && Config.indexList[i].ID == viewid){
				return;
			}
		}
		if(viewid){
			if(!visited){
				visited = {};
			}

			if(!visited[viewid]){
				visited[viewid] = 0;
			}
			visited[viewid]++;
			console.debug(visited);
			Util.setCookie(cookieId, visited);
		}
	}

	/**
	 * 获取主系统window对象。
	 */
	function getMainObj (argument) {
		try{
			//此段代码含义为:在ifreams中父页面获取子页面的内容
			return document.getElementById('mainsystem').contentWindow;
		}catch(e){
			console.error(e);
		}
	}

	/**
	 * 收起菜单
	 */
	function EMenucollapse (argument) {
		
		$('#left').hide();
		$('#right').data('margin-left', $('#right').css('margin-left'));
		$('#right').css({'margin-left': '0px'});
		$("#right").css({'overflow':'auto'});
		$("#mainli").show();
	}

	/**
	 * 展开菜单
	 */
	function EMenuexpand (argument) {
		 
		$('#left').show();
		$('#right').css({'margin-left': $('#right').data('margin-left')});
		$("#mainli").hide();
	}
	
	/**
	 * 公共提交服务方法
	 */
	function _submitService(data, options) {
		var options = $.isFunction(options) ? {'success': options, 'timeout': options} : options;
		console.debug('_submitService.........');
		console.debug(options);
		$.ajax( {
	  		"type": "POST", 
	  		"contentType": "application/json; charset=utf-8",
	  		"url": Config.basePath + "/normal.do?method=doAction", 
	  		"dataType": "json",
	  		"data": JSON.stringify(data), //以json格式传递
	  		"cache": false,
	  		"success": function(resp) {
		        if(resp.SUCCESS === false && resp.MESSAGE==='登录超时'){
					if($.isFunction(options.timeout)){
						options.timeout(resp);
					}
		        }else{
		          resp.retmsg = resp.MESSAGE;
				  if($.isFunction(options.success)){
					  options.success(resp); //服务器端返回的对象的returnObject部分是要求的格式
				  }
		        }
	  		},
	      "error": function(errinfo){
	        console.info('submit.error:' + jsonUtil.toString(errinfo));
	        console.elog('submit.error:' + jsonUtil.toString(errinfo));
	      }
	  	});
	}

	/**
	 * 打开子系统交易。
	 */
	function openSystem_postMsg(strTranid, funcComplete){
		if(that.isSubsystem(strTranid)){
			$('#subsystem *', document).hide();

			var systemid = Config.tranProp[strTranid].PID,
				systemurl = Config.tranProp[systemid].URL,
				tranurl = Config.tranProp[strTranid].URL;
			var subsystem = $('#subsystem #'+systemid, document);

			// 向子系统发送事件，通知子系统打开交易
			if(subsystem.length < 1){
				console.debug("首次创建子系统实例");
				$('#subsystem', document).append('<IFRAME id="'+systemid+'" class="_subsystem" src="'+systemurl+'" frameborder="0" border="0" framespacing="0" marginwidth="0" marginheight="0" scrolling="no" width="100%" height="100%"></IFRAME>');
				$('#subsystem #'+systemid)[0].onload=function(){
					console.debug(systemid+' onloaded................................');
					// Systemmng.triggerEvent(systemid, strTranid);
					Systemmng.postMsg(systemid, strTranid);
				}
			}else{
				// Systemmng.triggerEvent(systemid, strTranid);
				Systemmng.postMsg(systemid, strTranid);
			}

		}else{
			console.info("方法使用错误，当前交易不是子系统交易"+strTranid);
		}
	}

	/**
	 * 打开交易，共享事件的方式
	 */
	function openSystem_systemEvent(strTranid){
		
		var systemid = that.getSystemId(strTranid),// 'manageSystem',
			systemurl = Config.basePath + '/' + systemid + '/index.html';
		
		Config.event[systemid] = Config.event[systemid] || {'current': {'viewid': '', 'status': ''}, 'trigger': null};
		var systemEvent = Config.event[systemid];
		lastTranCode = currentTranCode;
		currentTranCode = strTranid;
		lastSystem = currentSystem;
		currentSystem = systemEvent;
		if($('#right').width() < 1020 && strTranid !==Config.indexId){
				EMenucollapse();
		}else{
				EMenuexpand();
		}
		if($('#subsystem #'+systemid).length <= 0){
			systemEvent.current = {viewid:strTranid, status:'noopen'};
			
			$('#subsystem', document).append('<IFRAME id="'+systemid+'" class="_subsystem" src="'+systemurl+
				'" frameborder="0" border="0" framespacing="0" marginwidth="0" marginheight="0"'+
				' scrolling="no" width="100%" height="100%"></IFRAME>');
		}else{
			try{
				systemEvent.trigger({viewid:strTranid, status:'noopen'});
			}catch(e){
				console.error(e);
			}
		}
		
		saveVisited();

		// 显示当前交易子系统，隐藏其他子系统
		$('#subsystem > iframe').each(function(){
			console.info("Systemmng.js.openSystem_systemEvent iframe.id====" + this.id);
			var obj = $(this);
			if(this.id == systemid){
				obj.show();
			}else{
				obj.hide();
			}
		});
	}

	


	function init (argument) {
		_View.hubEvent(EMenuexpand);
	}
	systemReady(init);


	console.info("systemmng模块加载成功...");
	return that;
}(document, window.jQuery));
window.Systemmng = Systemmng;