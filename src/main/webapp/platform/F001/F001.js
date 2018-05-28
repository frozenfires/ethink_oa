//@ sourceURL=F001.js
(function(){
	
	var options={    
		    rules:{
		    	USER_ID_P:{required:true,minlength:3,regex: "^[A-Za-z0-9]+$"},
		    	USER_NAME_P:{required:true,regex:"^[\u4E00-\u9FA5]{2,5}$|^[\u4E00-\u9FA5]{2,3}[a-zA-Z0-9]{1,3}$|^[a-zA-Z0-9]{3,8}$"},
		    	MOBILEPHONE_P:{required:true,regex:"^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$"},
		    	IDNUMBER:{required:true,regex:"^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$|^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9]|X)$"},
		    	OFFICEPHONE:{required:false,regNull:"^[0-9]+$|^[0-9]{3,4}-[0-9]+$"},
		    	HOMEPHONE:{required:false,regNull:"^[0-9]+$|^[0-9]{3,4}-[0-9]+$"},
		    	URGENTPHONE:{required:false,regNull:"^[0-9]+$|^[0-9]{3,4}-[0-9]+$"},
		    	ADDRESS:{required:true},
		    	SCHOOL:{required:true},
		    	MAJOR:{required:true},
		    	CONTRACTNUM:{required:true,regex:"^[0-9a-zA-Z]+$"},
		    	EMAIL:{required:true,email:true},
		    	WORKTIME:{required:true},
		    	JOINTIME:{required:true},
		    	BIRTHDAY:{required:true},
		    	ADDRESS_ID:{required:true},
			    ROLE_ID_P:{required:true},
				FREEZE_USER:{required:true},
				NATION:{required:true},
				SEX:{required:true},
				MARRIAGED:{required:true},
				POLITICS:{required:true},
				EDUCATION:{required:true},
				DRIVER:{required:true}, 
				APTITUDE:{required:true}
		    },
		    messages:{
		    	USER_ID_P: {required:"请输入登录名！",minlength:"登录名应大于三位！",regex:"登录名只能是字母或数字！"},
		        USER_NAME_P:{required:"请输入姓名！",regex:"用户名称为2-5个汉字，或者3-8个字母数字，或者2-3个汉字加1-3个字母数字！"},
		    	MOBILEPHONE_P:{required:"请输入手机号码！",regex:"手机号码格式不合法！"},
		    	IDNUMBER:{required:"请输入身份证号码！",regex:"身份证号码不合法！"},
		    	OFFICEPHONE:{regNull:"电话号码格式不合法！"},
			    HOMEPHONE:{regNull:"电话号码格式不合法！"},
			    URGENTPHONE:{regNull:"电话号码格式不合法！"},
			    ADDRESS:{required:"请输入家庭住址！"},
			    SCHOOL:{required:"请输入毕业院校！"},
			    MAJOR:{required:"请输入专业名称！"},
			    CONTRACTNUM:{required:"请输入劳动合同编号！",regex:"劳动合同编号有英文字母或数字字符组成！"},
		    	EMAIL:{required:"请输入邮箱地址！",email:"无效的电子邮件地址！"},
			    WORKTIME:{required:"请输入参加工作的时间！"},
		    	JOINTIME:{required:"请输入进入公司时间！"},
		    	BIRTHDAY:{required:"请输入出生日期！"}
		    },
		    focusCleanup:true
		  };
	
	//定义表格
	var oTable = null;
	//查询回调方法
	var callback;
	//是否根据更新日期排序
	var isOrderTime=false;
	//增加用户模态窗口
	var addUserWindow = $('#addUserModal');
	//编辑用户模态窗口
	var editUserWindow = $('#editUserModal');
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
	
function init (argument) {
	var nation = ['汉族','壮族','满族','回族','苗族','维吾尔族','土家族','彝族','蒙古族','藏族','布依族','侗族','瑶族','朝鲜族','白族','哈尼族','哈萨克族','黎族','傣族','畲族','傈僳族','仡佬族','东乡族','高山族','拉祜族','水族','佤族','纳西族','羌族','土族','仫佬族','锡伯族','柯尔克孜族','达斡尔族','景颇族','毛南族','撒拉族','布朗族','塔吉克族','阿昌族','普米族','鄂温克族','怒族','京族','基诺族','德昂族','保安族','俄罗斯族','裕固族','乌孜别克族','门巴族','鄂伦春族','独龙族','塔塔尔族','赫哲族','珞巴族'];
	for (var i in nation){
		$('<li><a href="javascript:void(0);" value="' + nation[i] + '">' + nation[i] + '</a></li>').appendTo($("#NATION>ul")); 
	}
	
	var education = ['初中','高中','中专','大专','本科','硕士','博士'];
	for (var i in education){
		$('<li><a href="javascript:void(0);" value="' + education[i] + '">' + education[i] + '</a></li>').appendTo($("#EDUCATION>ul")); 
	}
	
	var driver = ['A','B','C','无'];
	for (var i in driver){
		$('<li><a href="javascript:void(0);" value="' + driver[i] + '">' + driver[i] + '</a></li>').appendTo($("#DRIVER>ul")); 
	}
	
	var aptitude = ['光荣','NCR认证','迪宝认证','无'];
	for (var i in aptitude){
		$('<li><a href="javascript:void(0);" value="' + aptitude[i] + '">' + aptitude[i] + '</a></li>').appendTo($("#APTITUDE>ul")); 
	}
	
	var sex = ['男','女'];
	for (var i in sex){
		$('<li><a href="javascript:void(0);" value="' + sex[i] + '">' + sex[i] + '</a></li>').appendTo($("#SEX>ul")); 
	}
	
	var marriaged = ['未婚','已婚'];
	for (var i in marriaged){
		$('<li><a href="javascript:void(0);" value="' + marriaged[i] + '">' + marriaged[i] + '</a></li>').appendTo($("#MARRIAGED>ul")); 
	}
	  
	var politics = ['党员','团员','民主党派','群众'];
	for (var i in politics){
		$('<li><a href="javascript:void(0);" value="' + politics[i] + '">' + politics[i] + '</a></li>').appendTo($("#POLITICS>ul")); 
	}
	
	$("input#BIRTHDAY,input#WORKTIME,input#JOINTIME").on("mouseover",function(e){	
		$(this).calendar({
			format : 'yyyy-MM-dd',		
			onSetDate : function (){
				var parent=$(e.target).parent().parent().parent();
				checkTime(parent);
			}
		});
	});  
	
    $("#addUserForm,#editUserForm").find(".select").each(function(){
    	$(this).change(function(){
    		$(this).nextAll(".error").remove();
    	});
    });	  
	
	TranMng.loadOptions('ADDRESS_ID', 'selectAddress');
	TranMng.loadOptions('ROLE_ID_P', 'selectRole');
	Util.resetForm("addUserForm");
	Util.resetForm("editUserForm");
	$('#addUserForm').validate(options);
	$('#editUserForm').validate(options);
	validatorInit();
	$('#user_search').click(user_search);	
	$('#add_save').click(add_save);	
	$('#edit_save').click(edit_save);
	$('#query').click(user_search);
	$('#ADD').click(add);
	$('#EDIT').click(edit);
	$('#DELETE').click(deleteRows);
	$('#cancel').click(cancel);
	$('#addUserForm #USER_ID').click(function(){
          Alert.popWindow(editUserWindow);
	   });
	$('#addUserForm #ORG_ADMIN_P,#editUserForm #ORG_ADMIN_P').change(function(){
		$(this).dataValue(this.checked ? '1' : '');
	});
	

	for(idName in options.rules){
		if (options.rules[idName].required){
			var inputNode = $("#addUserForm,#editUserForm").find("#" + idName);
			if (inputNode){
				inputNode.each(function(){
					var labelNode = $(this).prev();
					if (labelNode){
						labelNode.html('<span style="color:red;">*</span>' + labelNode.text());
					}
				})
			}
		}
	}
	
	user_search();
};
init();

function checkTime(parent){
	
	try{
		var birthdayObj = parent.find("[name='BIRTHDAY']");
		var worktimeObj = parent.find("[name='WORKTIME']");
		var jointimeObj = parent.find("[name='JOINTIME']");
		var birthdayVal = birthdayObj.val();
		var worktimeVal = worktimeObj.val();
		var jointimeVal = jointimeObj.val();
		var flag = true;
		
		birthdayObj.nextAll(".error").remove();
		worktimeObj.nextAll(".error").remove();
		jointimeObj.nextAll(".error").remove();
		
		if (birthdayVal != "" && birthdayVal >= getCurrentDate()){
			addErrMsg(birthdayObj, "出生日期须小于当前日期！");
			flag = false;
		}
		
		if (worktimeVal != ""){
			if (worktimeVal > getCurrentDate()){
				addErrMsg(worktimeObj, "参加工作时间须小于等于当前日期！");
				flag = false;
			}else if (birthdayVal != "" && worktimeVal <= birthdayVal){
				addErrMsg(worktimeObj, "参加工作时间须大于出生日期！");
				flag = false;
			}
		}
		
		if (jointimeVal != ""){
			if (jointimeVal > getCurrentDate()){
				addErrMsg(jointimeObj, "进入公司时间须小于等于当前日期！");
				flag = false;
			}else{
				if (worktimeVal != ""){
					if (jointimeVal < worktimeVal){
						addErrMsg(jointimeObj, "进入公司时间须大于等于参加工作时间！");
						flag = false;
					}
				}else if (birthdayVal != ""){
					if (jointimeVal <= birthdayVal){
						addErrMsg(jointimeObj, "进入公司时间须大于出生日期！");
						flag = false;
					}
				}
			}
		}		
		
		return flag;
		
	}catch(e){
		console.debug("******F001.js******checkTime******" + e)
	}
	
	return false;
}

function addErrMsg(obj, errMsg){
	$('<label for="' + obj.attr("id") + '" class="error" style="display: inline-block;">'+ errMsg + '</label>')
	.appendTo(obj.parent());
}

function getCurrentDate(){
	var dateObj = new Date();
	var year = dateObj.getFullYear().toString();
	var month = dateObj.getMonth()+1;
	month = month > 9 ? month.toString() : "0" + month;
	var date = dateObj.getDate();
	date = date > 9 ? date.toString() : "0" + date;
	return year + "-" + month + "-" + date;
}

function validatorInit (argument) {
	jQuery.validator.addMethod("regex", //addMethod第1个参数:方法名称 
		function(value, element, params) { //addMethod第2个参数:验证方法，参数（被验证元素的值，被验证元素，参数） 
		var exp = new RegExp(params); //实例化正则对象，参数为传入的正则表达式 
		return exp.test(value); //测试是否匹配 
		}, 
		"格式错误");
	jQuery.validator.addMethod("nregex", //addMethod第1个参数:方法名称 
		function(value, element, params) { //addMethod第2个参数:验证方法，参数（被验证元素的值，被验证元素，参数） 
		var exp = new RegExp(params); //实例化正则对象，参数为传入的正则表达式 
		return exp.test(value); //测试是否匹配 
		}, 
		"格式错误");
	jQuery.validator.addMethod("regNull", //addMethod第1个参数:方法名称 
		function(value, element, params) { //addMethod第2个参数:验证方法，参数（被验证元素的值，被验证元素，参数）
		if(value !='' && value != null){
				var exp = new RegExp(params); //实例化正则对象，参数为传入的正则表达式 
				return exp.test(value); //测试是否匹配 
			}else{
				return true;
			}
		}, 
		"格式错误");
}

function cancel(){
	View.hub();
}

//回填修改用户界面
function response_edit(response){
	//获取数据
	var jsonData=response.DATA[0];
	console.debug("***jsonData*** ==>" + JSON.stringify(jsonData));
	
	//填充数据到界面
	Util.fillData(jsonData,"editUserForm");
	$('#editUserForm #ORG_ADMIN_P').change();
}

function edit(){
	 
	var seletedtr = $('#userInfo tr.row_selected');
	console.debug('seletedtr=%o', seletedtr);
	
	if(seletedtr.length==0){
		Alert.error("请选择一行进行修改！");
		return;
	}
	else if(seletedtr.length>1){
		Alert.error("只能选择一行进行修改！");
		return;
	}
	//获得当前选中的第一行的所有数据
	var selectData = oTable.fnGetData( seletedtr[0] );
	console.debug('selectData=%o',selectData);
	Util.clearForm("editUserForm");
	Alert.popWindow(editUserWindow);
	$("#ROLE_STATUS3").val(selectData.FREEZE_USER);
	
	
	// 查询用户数据
	var jsonData={};
	Util.addParameter(jsonData,"SERVICE","CommonQueryService");
    Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
    Util.addParameter(jsonData,"SQLID","selectUserDetailInfo");
    Util.addParameter(jsonData,"USER_ID_P",selectData.USER_ID+'');
    TranMng.submitServer(jsonData,response_edit);  
}
/*$("#ROLE_STATUS").change(function (){
	alert($("#ROLE_STATUS").val());
});*/
//编辑保存响应
function editResponse(response){
	//关闭编辑窗口
	Alert.closeWindow(editUserWindow);
	if(response.SUCCESS){
		isOrderTime=true;
		user_search();
	}else{
		Alert.error("编辑用户失败");
	}
}

//编辑保存
function edit_save(){
	if(!($("#editUserForm").valid())){
	 return;
	}
	
	if (!checkTime($("#editUserForm"))){
		 return false;
	}
	
	var formArray=$('#editUserForm').serializeArray();//编辑条件
	var jsonData=Util.formToJson(formArray);
	//var ROLE_STATUS=$("#ROLE_STATUS").val();//获取用户状态下拉框的value值
	var st = $("#ROLE_STATUS3").val();
	 //ROLE_STATUS3
	Util.addParameter(jsonData,"SERVICE","CommonExecuteService");
    Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
    Util.addParameter(jsonData,"ROLE_STATUS3",st);
    Util.addParameter(jsonData,"SQLID","updateUser");
    TranMng.submitServer(jsonData,editResponse);
}

//删除响应
function deleteResponse(response){
	Alert.processingCancel();
	user_search();
	if(!response.SUCCESS){
		Alert.error(response.MESSAGE);
	}
	
}

//删除按钮
function deleteRows(){
	//获得datatable表格中凡是tr行有类名row_selected的行
	var selectTr = $('#userInfo tr.row_selected');
	//如果没有选中任何行则不能进行修改
	if(selectTr.length==0){
		Alert.error("请选择行进行删除！");
		return false;
	}else if($("#userInfo tr.row_selected .sorting_1").text() == "admin"){
		Alert.error("不允许删除超级管理员！");
		return false;
	}
	else{
		Alert.confirm("你确定要删除这些数据吗？",function(){
		  var jsonData={}, rowData =[];	
		  //循环所有被选中的行
		  selectTr.each(function(){
			//获取每一个被选中的行的所有数据存放在trData中
		  	var trData = oTable.fnGetData(this);
		  	//将当前选中行的USER_ID取出放入数组rowData中
            rowData.push({"USER_ID_P": trData.USER_ID});
		  }); 
		  
		  Util.addParameter(jsonData,"BATCHDATA",rowData);
		  Util.addParameter(jsonData,"SERVICE","CommonExecuteService");
		  Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
		  Util.addParameter(jsonData,"SQLID","deleteUser");
		  Alert.processing("交易提交中，请稍候...");
		  TranMng.submitServer(jsonData,deleteResponse);
		
		});
	}
}

/**
 * bug编号:2739增加用户时消除上次记录中的多选框与下拉框内容
 * 增加了相应的清除方法
 */
//添加用户
function add(){
	//$(':input','#addUserForm').val('');  
	Util.clearForm("addUserForm");
	//bug编号:2739 增加代码2行
    //$('#ROLE_ID_P').selectValue("");
    $('#ORG_ADMIN_P').attr('checked',false);
	//弹出增加用户窗口
	Alert.popWindow(addUserWindow);
}



/*$("#ROLE_STATUS").change(function (){
	alert($("#ROLE_STATUS").val());
});*/

//增加按钮保存
function add_save(){
	 if(!($("#addUserForm").valid())){
		 return;
	 }
	 
	 //检测select是否有值
	 var flag = false;
	 $("#addUserForm #errMsg").html("");
	 $("#addUserForm .select").each(function(){
		 var meg = {"ADDRESS_ID":"请选择所属区域！",
				 "ROLE_ID_P":"请选择角色！",
				 "FREEZE_USER":"请选择用户状态！",
				 "NATION":"请选择民族！", 
				 "SEX":"请选择性别！", 
				 "MARRIAGED":"请选择婚姻状况！", 
				 "POLITICS":"请选择政治面貌！", 
				 "EDUCATION":"请选择学历！", 
				 "DRIVER":"请选择驾驶证类型！", 
				 "APTITUDE":"请选择资质！", 
			 };	 	
		 var sValue = $(this).selectValue();
		 if (meg[this.id] != undefined && (sValue == "" || sValue == null || sValue == undefined)){
			 $('<label for="' + this.id + '" class="error" style="display: inline-block;">' + meg[this.id] + '</label>').appendTo($(this).parent());
			 flag = true;
		 }
	 });
	 
	 if (flag){
		 return false;
	 }
	 
	 if (!checkTime($("#addUserForm"))){
		 return false;
	 }
	 
	 var formArray=$('#addUserForm').serializeArray();//查询条件
	 console.debug('formArray=' + jsonUtil.toString(formArray));
	 var jsonData=Util.formToJson(formArray);
	 var ROLE_STATUS=$("#ROLE_STATUS").val();//获取用户状态下拉框的值
	     Util.addParameter(jsonData,"SERVICE","CommonExecuteService");
	     Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
	     Util.addParameter(jsonData,"PASSWORD","123456");
	     Util.addParameter(jsonData,"ROLE_STATUS",ROLE_STATUS);//将用户状态select下拉框的值传入后台
	     Util.addParameter(jsonData,"SQLID","insertUser");
	     Alert.closeWindow(addUserWindow);
	     TranMng.submitServer(jsonData,response_add);
	
}

//增加完成响应
function response_add(response){
	if(response.SUCCESS){
		isOrderTime=true;
		user_search();
	}else{
		Alert.error("该用户已存在！");
	}
}

/**
 * 回填datatable中的数据
 */
function retrieveData( sSource, aoData, fnCallback ) {
	     
		      var formArray=$('#userQueryForm').serializeArray();//查询条件
		      var paramArray=aoData.concat(formArray);//合并查询条件和分页表格所需要的参数
		      var jsonData=Util.formToJson(paramArray);
		      
		      Util.addParameter(jsonData,"SERVICE","CommonQueryService");
		      Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");

		      Util.addParameter(jsonData,"SQLID","selectUserPage");
		      Util.addParameter(jsonData,"IS_PAGE",true);
		      if(isOrderTime){
		    	  Util.addParameter(jsonData,"ORDER_TIME","true");
		      }
		      isOrderTime=false;
		      TranMng.submitServer(jsonData,function(response){
		       	fnCallback(response);
		       	console.info(response);
		      });
}
		

		//"查询"按钮的处理
function user_search() {
			 
			if (oTable == null) { //仅第一次检索时初始化Datatable
				$("#userInfo").show();
				oTable = $('#userInfo').dataTable( {
					"oLanguage": {"sUrl":"theme/page_cn.txt"},
					"aoColumns":[ { "mDataProp": "USER_ID" },
						  			{ "mData": "USER_NAME","sDefaultContent": "" },
						  			{ "mData": "OFFICEPHONE","sDefaultContent": "" },
						  			{ "mData": "MOBILEPHONE","sDefaultContent": "" },
						  			{ "mData": "ADDRESS_NAME","sDefaultContent": "" },
									{ "mData": "EMAIL","sDefaultContent": "" },
						  			{ "sDefaultContent": "" }
						  		],
			  		"aoColumnDefs":[
						{"mRender" : function(data, type, row) {
							switch (row.FREEZE_USER) {
							case 'N':
								return "正常";
							case 'Y':
								return "冻结";
							default:
								return "未知";
							};
						}, "aTargets": [6]}],
					"bProcessing": true,					//加载数据时显示正在加载信息
					"bServerSide": true,					//指定从服务器端获取数据
					"bFilter": false,						//不使用过滤功能
					"bLengthChange": false,					//用户不可改变每页显示数量
					"iDisplayLength": 10,					//每页显示8条数据
					"sAjaxSource": "normal.do?method=doAction",  //获取数据的url
					"fnServerData": retrieveData,			//获取数据的处理函数
					"sPaginationType": "full_numbers"	    //翻页界面类型
					
					
				});
				
			}else{
					oTable.fnClearTable( 0 );
					oTable.fnDraw();
			}
}
// end
})();