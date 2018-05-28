//@ sourceURL=F008.js
(function(){
	
	var options={    
		    rules:{
		    	AGENTA_ID:{required:true,maxlength:10},
		    	AGENTA_NAME:{required:true},
		    	AGENT_ADDRESS:{required:true},
		    	LINKMAN:{required:true,maxlength:20},
		    	EMAIL:{required:true,maxlength:30},
		    	TEL:{required:true,maxlength:15}
		    },
		    messages:{
		    	AGENTA_ID: {required:"请输入代理商编号!",maxlength:"代理商编号长度不能超过10"},
		    	AGENTA_NAME: {required:"请输入代理商名称!",maxlength:"代理商编号长度不能超过30"},
		    	AGENT_ADDRESS: {required:"请输入代理商地址!",maxlength:"代理商编号长度不能超过50"},
		    	LINKMAN: {required:"请输入联系人!",maxlength:"联系人长度不能超过20"},
		    	EMAIL: {required:"请输入邮箱!",maxlength:"邮箱长度不能超过20"},
		    	TEL: {required:"请输入电话!",maxlength:"电话长度不能超过20"}
		    }
		  };
	
	
	
	//定义表格
	var oTable = null;
	//选择行的数据
	//var aSelected = [];
	//查询回调方法
	var callback;
	
	//增加代理商模态窗口
	var addAgentWindow = $('#addAgentModal');
	//编辑代理商模态窗口
	var editAgentWindow = $('#editAgentModal');
	
	
function init (argument) {
	
	$('#agent_search').click(function(){
		agent_search();
	   });
	
	$('#add_save').click(function(){
		add_save();
	   });
	
	$('#edit_save').click(function(){
		edit_save();
	   });
	$('#query').click(function(){
           search();
	   });
	
	$('#ADD').click(function(){
        add();
	   });
	
	$('#EDIT').click(function(){
        edit();
	   });
	$('#DELETE').click(function(){
        deleteRows();
	   });
	
	Util.resetForm("addAgentForm");
	$('#addAgentForm').validate(options);
	$('#editAgentForm').validate(options);
	$('#cancel').click(cancel);

};

init();

function cancel(){
	View.hub();
}
//回填修改代理商界面
function response_edit(response){
	//获取数据
	var jsonData=response.DATA[0];
	//填充数据到界面
	Util.fillData(jsonData,"editAgentForm");
	//$('#o_type').text(jsonData.ORG_TYPE);
  }

function edit(){
	 
	var selectedtr = $("#agentInfo tr.row_selected");
	if(selectedtr.length==0){
		Alert.error("请选择一行进行修改!");
		return;
	}
	//选中的具体第一行的行中所有内容
	var selectData = oTable.fnGetData( selectedtr[0] );
	if(selectData === null){
		Alert.error("请选择一行进行修改!");
		return;
	}
	
	if(selectedtr.length>1){
		Alert.error("只能选择一行进行修改!");
		return;
	}
	  Util.clearForm("editAgentForm");
	 Alert.popWindow(editAgentWindow);
	  var jsonData={};
	  Util.addParameter(jsonData,"SERVICE","CommonQueryService");
      Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
      Util.addParameter(jsonData,"SQLID","selectAgentDetail");
      Util.addParameter(jsonData,"AGENTA_ID", selectData.AGENT_ID);
      TranMng.submitServer(jsonData,response_edit);
	
}

//编辑保存响应
function editResponse(response){
	//关闭编辑窗口
	Alert.closeWindow(editAgentWindow);
	if(response.SUCCESS){
		agent_search();
	}
}

//编辑保存
function edit_save(){
	 var flag= $("#editAgentForm").valid();
	 if(!flag){
		 return;
	 }
	var formArray=$('#editAgentForm').serializeArray();//编辑条件
	var jsonData=Util.formToJson(formArray);
	
	var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
	var ema=jsonData.EMAIL;
	 if(ema!=""){
		 if(!re.test(ema)){
			 Alert.error("邮箱格式错误！");
			 return;
		  }
	 }	 
	 var phone_re = /^0\d{2,3}-?\d{7,8}$/;
	 var tel= /^1\d{10}$/;
	 var tel_value=jsonData.TEL;
	 if(tel_value!=""){
		 if(!tel.test(tel_value)&&!phone_re.test(tel_value)){
			 Alert.error("电话号码格式不正确！");
			 return;
		 }		 
	 }	 
	
	Util.addParameter(jsonData,"SERVICE","CommonExecuteService");
    Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
    Util.addParameter(jsonData,"SQLID","updateAgent");
    
    TranMng.submitServer(jsonData,editResponse);
}

//删除响应
function deleteResponse(response){
	Alert.processingCancel();
	agent_search();
	if(!response.SUCCESS){
		Alert.error(response.MESSAGE);
	}
	
}

//删除按钮
function deleteRows(){
	var selectedtr1 = $("#agentInfo tr.row_selected");
	if(selectedtr1.length==0){
		Alert.error("请选择一行进行删除！");
		return;
	}
	//选中的具体第一行的行中所有内容
	var selectData1 = oTable.fnGetData( selectedtr1[0] );

	Alert.confirm("你确定要删除这些数据吗？",function()
	{
		  var jsonData={};
		  var rowData =[];	 
		  $.each(selectData1,function(index,value){
			  var row={};
			  if(index === "AGENT_ID"){
			  Util.addParameter(row,"AGENTA_ID",value);
	             //其中index相当于JAVA中的LIST中的索引，VALUE为索引对应的值，其中索引从0开始
              rowData.push(row);
			  }
	      });
			 Util.addParameter(jsonData,"SERVICE","CommonQueryService");
			 Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
			 Util.addParameter(jsonData,"ID",rowData[0].AGENTA_ID);
			 Util.addParameter(jsonData,"SQLID","selecCusByAgentID");
			 Alert.processing("交易提交中，请稍候...");
			 TranMng.submitServer(jsonData,function(res){
				 if(res.SUCCESS){
					 if(res.DATA.length>0){
						 Alert.error("该代理商下面有客户，不能删除！");
					 }else{
					     Util.addParameter(jsonData,"BATCHDATA",rowData);
						 Util.addParameter(jsonData,"SERVICE","CommonExecuteService");
						 Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
						 Util.addParameter(jsonData,"SQLID","deleteAgent");
						 Alert.processing("交易提交中，请稍候...");
						 TranMng.submitServer(jsonData,deleteResponse);
					 }
				 }
			 });		
	});
}

//添加代理商
function add(){
	//$(':input','#addUserForm').val('');  
	Util.clearForm("addAgentForm");
	//弹出增加代理商窗口
	Alert.popWindow(addAgentWindow);
}


//增加按钮保存
function add_save(){
	 var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
	 var ema=$("#EMAIL").val();
	 if(ema!=""){
		 if(!re.test(ema)){
			 Alert.error("邮箱格式错误！");
			 return;
		  }
	 }	 
	 var phone_re = /^0\d{2,3}-?\d{7,8}$/;
	 var tel= /^1\d{10}$/;
	 var tel_value=$("#TEL").val();
	 if(tel_value!=""){
		 if(!tel.test(tel_value)&&!phone_re.test(tel_value)){
			 Alert.error("电话号码格式不正确！");
			 return;
		 }
		 
	 }	 
	 var flag= $("#addAgentForm").valid();
	 if(!flag){
		 return;
	 }
	 var formArray=$('#addAgentForm').serializeArray();//查询条件
	 var jsonData=Util.formToJson(formArray);
	     Util.addParameter(jsonData,"SERVICE","CommonExecuteService");
	     Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
	     Util.addParameter(jsonData,"SQLID","insertAgent");
	     Alert.closeWindow(addAgentWindow);
	     TranMng.submitServer(jsonData,response_add);
	
}

//增加完成响应
function response_add(response){
	if(response.SUCCESS){
		agent_search();
	}else{
		Alert.error("该代理商已存在！");
	}
}



//查询分页回调方法
function responseFunction(response){
	 callback(response);
	 //清空选择行数组
	 aSelected=[];
}
  

function retrieveData( sSource, aoData, fnCallback ) {
	     
		      var formArray=$('#agentQueryForm').serializeArray();//查询条件
		      var paramArray=aoData.concat(formArray);//合并查询条件和分页表格所需要的参数
		      var jsonData=Util.formToJson(paramArray);
		      Util.addParameter(jsonData,"SERVICE","CommonQueryService");
		      Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
		      Util.addParameter(jsonData,"SQLID","selectAgentPage");
		      Util.addParameter(jsonData,"IS_PAGE",true);
		        callback=fnCallback;
		       TranMng.submitServer(jsonData,responseFunction);
	   }
		

		//"查询"按钮的处理
function agent_search() {
			if (oTable == null) { //仅第一次检索时初始化Datatable
				$("#agentInfo").show();
				oTable = $('#agentInfo').dataTable( {
					//"bAutoWidth": true,
					//"sScrollX" : "1000px",
					"oLanguage": {"sUrl":"theme/page_cn.txt"},					
					"aoColumns": [
						  			{ "mDataProp": "AGENT_ID" },
						  			{ "mData": "AGENT_NAME","sDefaultContent": "" },
						  			{ "mData": "AGENT_ADDRESS","sDefaultContent": "" },
						  			{ "mData": "LINKMAN","sDefaultContent": "" },
									{ "mData": "EMAIL","sDefaultContent": "" },
						  			{ "mData": "TEL","sDefaultContent": "" }						  		
						  		],
					"bStateSave": false, // 保存cookie
					"bAutoWidth": false, // 自动调整列宽
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

})();

