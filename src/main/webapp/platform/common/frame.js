Frame = window.Frame || (function(document, $, Systemmng){

/**
 * 初始化方法
 */
var that = {};

function init(){
	// 隐藏锁屏页面
	$('#lockscreenPage').hide();
	$('#head-userName').text(Config.userName);
	if(Config.lockStatus === 'lock'){
		$('#frame').hide();
		$('#lockscreenPage').show();
		_submitService({"SERVICE": "logoutService"}, function(response){
			console.debug('跳转到登录页面');
			Alert.info("系统将跳转至登录页面...",function(){
				window.location.href = Config.basePath+"/login.html";
			});
		});
		return true;
	}
	//此段代码作用为：当按下键盘中的F5不再刷新页面
	$(window).keydown( function(event){
		if(event.keyCode ===116){
			//取消回车
			event.keyCode = 0;
			//防止ie浏览器中的时间冒泡(代码从下往上冒泡)
			event.cancelBubble = true; 
			return false; 
		}
	} );
	// 加载菜单
	showTrancode(trancodeLoaded);
	// 注册事件
	events();
	// 退出
	logout();
	// 返回主页按钮
//	cancelMain();
	// 锁定函数处理
	$("#lockscreen").click(lockscreen);	
	// 解锁函数处理
	$("#llogin").click(unlockscreen);	
	$("#lusername,#lpassword").keydown(function(){
	    if(event.keyCode === 13){
	    	unlockscreen();
	    }
	});
	$("#mainli").hide();
	//屏蔽鼠标右键方法
	/*$(document).ready(function(){
		$(document).bind("contextmenu",function(e){
		return false;
		});
	});*/
	
	
}
init();

/**
 * 返回主页
 */
/*function cancelMain(){
	$("#mainPage").click(function(){
		$("#adminMain").click();
	});
}*/

//使鼠标点击右键无法生效
/*document.oncontextmenu = function() {
	return false;
}*/

function trancodeLoaded (argument) {
	Systemmng.hub();
}

/**
 *	锁屏 
 */
function lockscreen(){
	if (window.confirm("您确定要锁定屏幕吗?")){
		// 隐藏当前页面
		$('#frame').hide();
		$('#lockscreenPage').show();
		$('#lusername').val(Config.currentUser);
		$('#lpassword').val('');
		var jsonData = {};
		Util.addParameter(jsonData,"SERVICE", "SetLockService");
		Util.addParameter(jsonData, "lockStatus", "lock");
		Util.encryptParameters(jsonData);
		_submitService(jsonData,function(resp){
			if(resp.SUCCESS){
				console.info('set lockStatus success...');
			}else{
				console.info('set lockStatus error...');
			}
		});
		return true;
	}else{
		return "留在本页";
	}
}

/**
 *	 解锁
 */
function unlockscreen(){
	if($("#lusername").val() === ''){
		Alert.error("请录入用户名");
		return;
	}else if($("#lpassword").val() === ''){
		Alert.error("请录入密码");
		return ;
	}
	var jsonData = {};
	Util.addParameter(jsonData,"SERVICE", "ValidateUserService");
	Util.addParameter(jsonData, "lockStatus", "unlock");
	Util.addParameter(jsonData, "lockUserName", $("#lusername").val());
	Util.addParameter(jsonData, "password", $("#lpassword").val());
	Util.encryptParameters(jsonData);
	_submitService(jsonData,function(resp){
		if(resp.SUCCESS){
			$('#lockscreenPage').hide();
			$('#frame').show();
			refreshWindow();
			console.info('set unlockStatus success...');
		}else{
			$('#frame').hide();
			$('#lockscreenPage').show();
			$('#lusername').val(Config.currentUser);
			$('#lpassword').val('');
			Alert.error('密码输入错误,请重新输入!');
			console.info('set unlockStatus error...');
		}
	});
}

/**
 * 解屏后刷新
 */
function refreshWindow(){
	var w = screen.availWidth;
	var h = screen.availHeight;
	window.resizeTo(w-1,h-1);
	setTimeout(function(){
		window.resizeTo(w,h);
	},100);
}


/**
 * 获取子窗口对象
 */
function getMainWindow(){
	return document.getElementById('mainsystem').contentDocument.getElementById('mainsystem').contentWindow;
}

/**
 * 退出方法
 */
function logout(){
	$(".header #logout").live('click', function(){
		var obj = Systemmng.current();
		if(obj === undefined){
			obj = Config.indexId;
		}
		console.log(obj);
		if(window.confirm('您确定要退出系统吗？')){
			Systemmng.close();
			window.setTimeout(function(){
				_submitService({"SERVICE": "logoutService"}, function(response){
					console.debug('跳转到登录页面');
					window.location.href = Config.basePath + "/login.html";
				});
			}, 100);
		}
	} );
	
	$(".header #changePwd").live('click', function (){
		View.tranLinkOpen('F012');
	});
}

/**
 * 为菜单绑定事件
 */
function events(){
	// 交易
	$(".tranopen").live('click',(function(){
		if(!ishub()){
			Alert.info('请先完成或取消当前交易，再进行操作',function(){
				
			});
			return; 
		}
		$('.menuC li.hubopen').removeClass("hubopen");
		$(this).parent('li').addClass("hubopen");
		Systemmng.open(this.id);
	}));
}


/**
 * 1 判断当前系统交易是否正常退出 false表示当前交易已经退出
 * 2 如果正常退出，返回主页，就允许切换菜单，否则给予提示（请先完成当前的交易）
 */
function ishub(){
	try{
		// 获取当前交易
		var currenttran = Systemmng.current();
	
		if(currenttran === undefined){
			currenttran = Config.indexId;
		}
		console.log('当前交易：'+currenttran);
		// 获取交易AUTH标志
		var tranProp = Config.tranProp;
	
		// console.log('tranProp='+jsonUtil.toString(tranProp));
		var auth = tranProp[currenttran]['AUTH'] === undefined ? '' : tranProp[currenttran]['AUTH'];
		
		console.log(tranProp);
		console.log('auth=' + auth);
		if(auth === 'hub' || auth === 'device' ){
			return false;
		}else{
			return true;
		}
	}catch (e) {
		
		console.error(e);
		return false;
	}
}

/**
 * 按交易权限显示交易图标
 * 从后台服务中查询菜单后进行显示
 */
function showTrancode (callBack) {
	// 当前系统所有交易的配置信息
	console.debug("<<<<<<<当前系统所有交易的配置信息");
	Config.tranProp = {};
	// 当前系统是否有操作设备的交易。
	Config.hasDeviceTran = false
	var queryPrameter = {};
	Util.addParameter(queryPrameter, "SERVICE", "SelectMenuService");
	Util.addParameter(queryPrameter, "TRANCODE", "1");
	_submitService(queryPrameter, {
			'timeout': function(resp){
	          Alert.error(resp.MESSAGE, function(){
	            // 退回到登录页面
	            window.top.location = Config.basePath+"/login.html";
	          });
			},
			'success': function(response){

				
				if(response.FIRST.length == 1){
					console.debug("当前角色无匹配菜单");
					console.debug(response.FIRST[0]);
					//Config.tranProp[tranid] = response.FIRST[0];
					
				}
		if(response.SUCCESS){
			 var divContent=[];
			 //循环一级菜单
			 $.each(response.FIRST, function (n, item) { 
				 if(n===0){
					 // 特殊处理首页菜单
					 divContent.push('<div class="accordion-group">');
					 divContent.push('	<div class="accordion-heading">');
					 divContent.push('		<a id="'+Config.indexId+'" class="accordion-toggle tranopen" data-toggle="collapse" data-parent="#menu">');
					 divContent.push('			<span>'+item.NAME+'</span>');
					 divContent.push('		</a>');
					 divContent.push('	</div>');
					 divContent.push('</div>');
				 }else{
					 divContent.push('<div class="accordion-group">');
					 divContent.push('	<div class="accordion-heading">');
					 divContent.push('		<a class="accordion-toggle" data-toggle="collapse" data-parent="#menu" href="#'+item.ID+'">');
					 divContent.push('			<span>'+item.NAME+'</span>');
					 divContent.push('		</a>');
					 divContent.push('	</div>');

					 divContent.push('	<div id="'+item.ID+'" class="accordion-body collapse">');
					 divContent.push('		<div class="accordion-inner">');
					 divContent.push('		<ul class="nav nav-list bs-docs-sidenav affix-top">');
				 }
				 
				 

				 //循环二级菜单
				 $.each(response.ALL, function (key, value_s) {				 	
				 	// console.debug('value_s =' + jsonUtil.toString(value_s));
				 	if(value_s.STATUS === 'hide'){
				 		// no-op
				 	}
					else if (value_s.PID==item.ID){
						// 分割线
						divContent.push('<div class="menu-hr"/>');

						divContent.push('<li><a id="'+value_s.ID+'" href="#" class="tranopen">');
						divContent.push(value_s.NAME);
						divContent.push('</a></li>');
					}
					// 保存每个交易的属性。
					Config.tranProp[value_s.ID] = value_s;
					
				 });
				 

				 divContent.push('		</ul>');
				 divContent.push('		</div>');
				 divContent.push('	</div>');
				 divContent.push('</div>');

				 divContent.push('<div class="menu-hr"/>');
			 });
			 
			// 动态添加主页列表
			for ( var i in Config.indexList) {
				Config.tranProp[Config.indexList[i].ID] = Config.indexList[i];
			}
			 
			 // divContent += '<div class="footer navbar navbar-fixed-bottom">';
			 // divContent += $('#hubFooter').html();
			 // divContent == '</div>';
			 
			 // $('#hubFooter').html('');
			 
		     $("#menu").html(divContent.join('\n'));
		}

		if($.isFunction(callBack)){
				callBack();
		}
	}

			
		});
}


function _submitService(data, options) {

	var options = $.isFunction(options) ? {'success': options, 'timeout': options} : options;
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

return that;
	
}(document, window.jQuery, Systemmng));
window.Frame = Frame;