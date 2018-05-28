/**
 * _TranMng.js 
 *
 * 交易控制器
 * 控制交易提交，及提交返回的一些公共处理。
 */
var _TranMng = window._TranMng || (function(document, $, Config, Util, Alert) {
  
  var that = {};
  var maintranlog ="";
  var tranlogid = "";
  var currentServiceName = "";
  var zNodes = [];

/**
 * 获取流水号
 * @returns {String}
 */
that.getSeqNo = function(){
  console.debug('getSeqNo begin...');
	    var data={};
	    Util.addParameter(data,"SERVICE","CreateSeqNoService");
	    var seqNo="";
		$.ajax( {
	  		"type": "POST", 
	  		"contentType": "application/json; charset=utf-8",
	  		"url": Config.basePath + "/normal.do?method=doAction", 
	  		"dataType": "json",
	  		async: false, 
	  		"data": JSON.stringify(data), //以json格式传递
	  		"cache": false,
	  		"success": function(resp) {
	  		 	//returnSeqNo(resp); //服务器端返回的对象的returnObject部分是要求的格式
	  			seqNo= resp.SEQNO;
	  		}
	  	});
    console.debug('getSeqNo return: ' + seqNo);
		return seqNo;	   	   
}

  /**
   * ajax提交服务器公共方法
   * url :提交服务的地址、
   * data: json 对象
   * responseFunction 回调方法
   */
  that.submitServer=function(){
  	var url, 
  		data, 
  		responseFunctionP;

  	 if(arguments.length === 2){
  	 	url = Config.basePath + "/normal.do?method=doAction";
  	 	data = arguments[0];
  	 	responseFunctionP = arguments[1];
  	 }
  	 else if(arguments.length === 3){
  	 	url = arguments[0];
  	 	data = arguments[1];
  	 	responseFunctionP = arguments[2];
  	 }

  	 if(""==responseFunctionP){
  		 responseFunctionP="commonResponse";
  	 }
  	 var responseF=eval(responseFunctionP);

     Util.encryptParameters(data);//数据加密
  	 // setCommonParameters(data);//设置公共参数
     data['TRANCODE'] = data['TRANCODE'] || '';//View.current();
     
  	 console.info("url="+url+",jsonData=" + jsonUtil.toString(data));//.substr(0, 500));
  	$.ajax( {
  		"type": "POST", 
  		"contentType": "application/json; charset=utf-8",
  		"url": url, 
  		"dataType": "json",
  		"data": JSON.stringify(data), //以json格式传递
  		"cache": false,
  		"success": function(resp) {
        console.info('submitServer.response:' + jsonUtil.toString(resp).substr(0, 500));
        console.info(resp);
        saveServerTime(resp);
        if(resp.SUCCESS === false && resp.MESSAGE==='登录超时'){
          Alert.error(resp.MESSAGE, function(){
            // 退回到登录页面
            window.top.location = Config.basePath + "/login.html";
          });
        }
        else{
          resp.retmsg = resp.MESSAGE;
          responseF(resp); //服务器端返回的对象的returnObject部分是要求的格式
        }
  		},
      "error": function(errinfo){
        console.info('submit.error:' + jsonUtil.toString(errinfo));
        console.elog('submit.error:' + jsonUtil.toString(errinfo));
      }
  	});
  	
   };

/**
 * 故障处理，不对数据处理，直接跳转到故障清除交易。
 */
that.deviceErrorWidthoutTranlink = function(){
  Alert.info("设备发生故障，点击确定后将进入故障清除处理", function(){
        View.tranLinkOpen("C002");
        Alert.SetNoOccupy(false);
  });
}

/**
 * 将tranlogId对应的交易画面，以只读的方式恢复到selecter 指定的区域。
 */
that.reverTranScreen = function(selecter, tranlogId, callback){
  

  var queryPrameter = {};
  Util.addParameter(queryPrameter, "TRANLOG_ID", tranlogId);
  Util.addParameter(queryPrameter, "SERVICE", "SelectTranExceptionService");
  _TranMng.submitServer(queryPrameter, function(response){
    var ret = {};
    if(!response.SUCCESS){
      // no-op;
    }
    else{
      ret=response.DATA[0]; 
      var errTranHtml = ret['SCREEN'],
        errTranData = ret['DATA'];

        // console.debug('errTranHtml=' + errTranHtml);
      if(errTranHtml){
        $(selecter).html(errTranHtml);
        // 控制界面元素为只读
        $(selecter + " *").attr("disabled", true)
          .unbind();
        // 置灰页签
        $(selecter + ' *[data-toggle="tab"]')
          .attr('data-toggle', 'tabremove')
          .attr('href', '#');

        if($.isFunction(callback)){
          callback();
        }
      }
    }
  });
}

/**
 *记录流水
 */
that.insertTranslog = function (jsonData, callback){
    //  collectCommLogData(jsonData);
    setCommonParameters(jsonData);
    Util.addParameter(jsonData,"SERVICE","CommonExecuteService");  
    Util.addParameter(jsonData,"DAO","TCRC_BASE_FUNCTION_DAO");  
    Util.addParameter(jsonData,"SQLID","insertTransLog"); 
    _TranMng.submitServer("normal.do?method=doAction",jsonData, callback);
}

/**
 * 更新流水
 */
that.updateTranslog = function (jsonData, callback){
   //   collectCommLogData(jsonData);
    setCommonParameters(jsonData);
    Util.addParameter(jsonData,"SERVICE","CommonExecuteService");  
    Util.addParameter(jsonData,"DAO","TCRC_BASE_FUNCTION_DAO");  
    Util.addParameter(jsonData,"SQLID","updateTransLog"); 
    _TranMng.submitServer("normal.do?method=doAction", jsonData, callback);
}

/**
 * 装载下拉列表选项
 */
that.loadOptionsEx = function(params, selecter, sqlid, keyname, valuename, filter, loadAfterFuc){
    var jsonData = params;
    if(!jsonData) {
      jsonData = {};
      Util.addParameter(jsonData,"SERVICE","CommonQueryService");
      Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
    };
    Util.addParameter(jsonData,"SQLID", sqlid);
    
    _TranMng.submitServer(jsonData, function(resp){
      if(resp.SUCCESS){
        var selectObj =  $('[name='+selecter+']');
        selectObj = selectObj.length > 0 ? selectObj : $('#'+selecter);

        var options = resp.DATA;
        // 过滤options
        if($.isFunction(filter)){
          options = filter(options);
        }
        
        var optionArray = [{V:"请选择", K:""}];
        optionArray = optionArray.concat(options);
        selectObj.each(function(){
          if(keyname && valuename){
            $(this).loadOption(optionArray, keyname, valuename);
          }else{
            $(this).loadOption(optionArray);
          }
        });
        
        try{
    		if($.isFunction(loadAfterFuc))
    			loadAfterFuc();
    	}catch(e){
    		console.info(e);
    	}
      }
    });
}

/**
 * 全程装载下拉列表选项
 */
that.loadOptions = function(selecter, sqlid, keyname, valuename, loadAfterFuc){
	that.loadOptionsEx(undefined, selecter, sqlid, keyname, valuename, '', loadAfterFuc);
    /*var jsonData={};
    Util.addParameter(jsonData,"SERVICE","CommonQueryService");
    Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
    Util.addParameter(jsonData,"SQLID", sqlid);
    _TranMng.submitServer(jsonData, function(resp){
      if(resp.SUCCESS){
        var selectObj =  $('[name='+selecter+']');
        if(keyname && valuename){
          selectObj.loadOption(resp.DATA, keyname, valuename);
        }else{
          selectObj.loadOption(resp.DATA);
        }
        
      }
    });*/
}

/**
 * 加载下拉树
 */
that.tree = function (id, serviceName) {
	if ($("#" + id).hasClass("selectTree")) {
		console.debug("currentServiceName : " + currentServiceName);
		if (currentServiceName == "") {
			currentServiceName = serviceName;
			zNodes = [];
			var jsonData = {};
			Util.addParameter(jsonData, "SERVICE", serviceName);
			_TranMng.submitServer(jsonData, function (response) {
				if (response.SUCCESS) {
					$.each(response.DATA, function (k, v){
						var node = {};
						node["id"] = v.ID;
						node["pId"] = v.PID;
						node["name"] = v.ID+'-'+v.NAME;
						if (v.PID) {
							node["open"] = false;
							node["nocheck"] = false;
						}
						zNodes.push(node);
					});
				}
			});
		}
		$("#" + id).on("click", function (){
			var ulId = id + "Tree";
			if ($("#menuContent").length == 0) {
				console.log("menuContent不存在!");
				$("form").append('<div id="menuContent" class="menuContent" style="display:none; position: absolute;">'
						+ '<ul id="' + ulId + '" class="ztree" style="margin-top:0; width:250px;"></ul></div>');
			}
			var setting = {
				view: {
					dblClickExpand: false
				},
				data: {
					simpleData: {
						enable: true
					}
				},
				callback: {
					onClick: onClick
				}
			};
			$.fn.zTree.init($("#" + ulId), setting, zNodes);
			showMenu();
			
			/* 下拉树相关 */
			function onClick(e, treeId, treeNode) {
				var zTree = $.fn.zTree.getZTreeObj(ulId);
				var nodes = zTree.getSelectedNodes();
				$("#" + id).val(nodes[0].name).dataValue(nodes[0].id);
				hideMenu();
			}

			function showMenu() {
				var cityObj = $("#" + id);
				var cityOffset = $("#" + id).offset();
				$("#menuContent").css({left:(cityOffset.left - 20) + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
				$("body").bind("mousedown", onBodyDown);
			}
			function hideMenu() {
				$("#menuContent").fadeOut("fast");
				$("body").unbind("mousedown", onBodyDown);
			}
			function onBodyDown(event) {
				if (!(event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
					hideMenu();
				}
			}
		});
	}
	/* 下拉树相关 */
};


// -------------------------以下为内部方法-----------------------------------

/**
 * 保存服务器时间
 */
function saveServerTime(resp){
	if(!resp.SERVERTIME){
		return;
	}
	Config.serverTime = resp.SERVERTIME;
}

/**
 * 设置公共参数
 */
function setCommonParameters (jsonData) {
   	// 面额详细信息
   	var amtDetail =  jsonData['TCRAMT_DETAIL'];
   	console.debug('setCommonParameters.amtDetail=' + amtDetail);
    amtDetail = jsonUtil.parse(amtDetail);
    if($.isArray(amtDetail)){
      for(var i=0; i<amtDetail.length; i++){
        var item = amtDetail[i];
        jsonData['REAL_V' + item.type] = item.count + '';
      }
      delete(jsonData['TCRAMT_DETAIL']);
    }
    else if($.isPlainObject(amtDetail)){
      for(type in amtDetail){
        var item = amtDetail[type];
        jsonData['REAL_V' + type] = item.count + '';
      }
      delete(jsonData['TCRAMT_DETAIL']);
    }

    // 下面数据要求转换为字符串类型
    if(jsonData['PATTERN'])
      jsonData['PATTERN'] = jsonData['PATTERN'] + ''; 
    if(jsonData['TCRAMT'])
      jsonData['TCRAMT'] = jsonData['TCRAMT'] + '';
    if(jsonData['BOXAMT'])
      jsonData['BOXAMT'] = jsonData['BOXAMT'] + ''; 
}

/**
 * 获取当前交易的截屏信息
 * 
 */
function getCurrentScreen (argument) {
  // 先保存各输入框的数据。
    $(".tranContent").find("input,select").each(function(){
      $(this).attr('value', this.value);
      if (this.type == "radio") {
        $(this).attr('checked',this.checked);
        //console.debug("this.type is radio  set attr to checked : " + this.checked + " ==== attr : " + $(this).is(":checked"));
      }
    });
    var tranContent = $(".tranContent").html();
    if(!tranContent || tranContent === ""){
       console.debug("注意... 交易%s的界面截图没有设置id:tranContent", tranContent);
    }
  return tranContent;
}

/**
 * 获取当前交易截屏对应的数据信息
 */
function getCurrentScreenData (argument) {
  var rootElement = document;
  var retdata = {};
  $(rootElement).find("input,select").each(function(){
    var name = this.id || this.name;
    var value = $(this).val() || "";
    retdata[name] = value;
  });
  // $.extend(true, retdata, data.bodyData);

  return jsonUtil.toString(retdata);
}

   
console.info('TranMng模块初始化成功...');
return that;
// TranMng结束
}(document, window.jQuery, Config, Util, Alert));
window.TranMng = window._TranMng = _TranMng;
