//@ sourceURL=verifyinfo2.js
(function(){
	
	var options={    
	    rules:{
	    },
	    messages:{
	    },
	    focusCleanup:true
    };
	
	//定义表格
	var oTable = null;
	//查询回调方法
	var callback;
	//是否根据更新日期排序
	var isOrderTime=false;
	//选择分派人员模态窗口
	var selectDelWorkerModal = $('#selectDelWorkerModal');
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
	
	//工单信息
	var workData=null;
	
function init (argument) {
	 console.info("******assignment2.js******");
	 workData = $("#linkContent").data("_userData");
	 console.info("&&&&&&&&&&&&&&&&&&&");
	 console.info(workData);
	 console.info("&&&&&&&&&&&&&&&&&&&");
	 if (workData.WORK_STATUS_DESC=='完成待审验'){
		 $("#verify,#notverify,#text").show();
	 }
	 
	 
	 $(".show input").attr("readonly","readonly");
	 $(".show input").each(function(){
		 var id = this.id;
		 if(id!="" && id!= undefined && id!= null && workData.hasOwnProperty(id)){
			 $(this).val(workData[id]);
		 }
	 });
	
     $('#verify').click(function(){
    	 operate(this.id);
     });
     $('#notverify').click(function(){
    	 operatenot(this.id);
     });
     
     
     $("#commModal #window_confirm").click(function(){
    	 Alert.closeWindow(commModal);
    	 operatenot(operation);
     });
     $("#commModal #window_concel").click(function(){
    	 Alert.closeWindow(commModal);
     });
     
     $('#DISPATCH').click(function(){
    	 Alert.popWindow(selectDelWorkerModal);
     })
     $("#window_confirm").click(function(){
    	 Alert.closeWindow(selectDelWorkerModal);
    	 operate("DISPATCH");
     })
     $("#window_concel").click(function(){
    	 Alert.closeWindow(selectDelWorkerModal);
     })
     $("#RET").click(function(){
    	 _View.tranLinkReturn();
     });
};
init();

/**
 * 回填datatable中的数据
 */
function retrieveData(sSource, aoData, fnCallback) {     
  var jsonData=Util.formToJson(aoData);
  Util.addParameter(jsonData,"SERVICE","CommonQueryService");
  Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
  Util.addParameter(jsonData,"SQLID","selectDelWorker");
  Util.addParameter(jsonData,"AREA", workData.workapp_CUS_AREA_ID);
  Util.addParameter(jsonData,"IS_PAGE",true);
  TranMng.submitServer(jsonData,function(response){
	console.info("*******可分派人员信息**********");
	console.info(response);
	fnCallback(response);
  });
}

function selectDelWorkerInfo() {
	if (oTable == null) { //仅第一次检索时初始化Datatable
		$("#selectDelWorkerResult").show();
		oTable = $('#selectDelWorkerResult').dataTable( {
			"oLanguage": {"sUrl":"theme/page_cn.txt"},
			"aoColumns":[ { "mDataProp": "USER_ID" },
				  			{ "mData": "USER_NAME","sDefaultContent": "" },
				  			{ "mData": "MOBILEPHONE","sDefaultContent": "" },
				  			{ "mData": "ADDRESS_NAME","sDefaultContent": "" },
				  			{ "sDefaultContent": "" }
				  		],
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


		
function operate(operation){
	console.info("***********operate()***********");
	var jsonData={};
	var selectWorker = null;
	var remark = $("#verufylist").val();
	if(remark.length == 0){
		remark="审验通过";
	}
	Util.addParameter(jsonData,"SERVICE","WorkverifyService");
	Util.addParameter(jsonData,"WORKAPP_ID",workData.ID);
	Util.addParameter(jsonData,"WORK_FLOW_ID",workData.WORK_FLOW_ID);
    //Util.addParameter(jsonData,"TASKID",workData.id);
    Util.addParameter(jsonData,"OPERATION","verify");
    Util.addParameter(jsonData,"REMARK",remark);
    TranMng.submitServer(jsonData,function(response){
    	if(response.SUCCESS){
    		Alert.error("审验成功！");
    		_View.tranLinkReturn();
    	}else{
    		Alert.error("审验失败！");
    	}
    });
    console.info(jsonData);
}

function operatenot(operation){
	console.info("***********operatenot()***********");
	var jsonData={};
	var selectWorker = null;
	var remark = $("#verufylist").val();
	if(remark.length == 0){
		remark="审验不通过";
	}
	Util.addParameter(jsonData,"SERVICE","WorkverifyService");
	Util.addParameter(jsonData,"WORKAPP_ID",workData.ID);
	Util.addParameter(jsonData,"WORK_FLOW_ID",workData.WORK_FLOW_ID);
    //Util.addParameter(jsonData,"TASKID",workData.id);
    Util.addParameter(jsonData,"OPERATION","notverify");
    Util.addParameter(jsonData,"REMARK",remark);
    TranMng.submitServer(jsonData,function(response){
    	if(response.SUCCESS){
    		Alert.error("审验驳回成功！");
    		_View.tranLinkReturn();
    	}else{
    		Alert.error("审验驳回失败！");
    	}
    });
    console.info(jsonData);
}



})();