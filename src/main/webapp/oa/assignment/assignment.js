//@ sourceURL=assignment.js
(function(){
	//定义表格
	var oTable = null;
   
	//查询回调方法
	var callback;
	//是否根据更新日期排序
	var isOrderTime=false;
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
	
	//工单状态
	const WORK_NEW_BUILD = "1";
	const WORK_WAIT_ASSIGNMENT = "2";
	const WORK_ASSIGNMENT_REJECT = "3";
	const WORK_ASSIGNMENT_VETO = "4";
	const WORK_ASSIGNMENT_SUSPEND = "5";
	const WORK_WAIT_DEAL = "6";
	const WORK_IN_DEAL = "7";
	const WORK_WAIT_EXAMIN = "8";
	const WORK_EXAMIN_REJECT = "9";
	const WORK_FINISH = "10";
	
$(".serch").hide();
$("#pull_down").click(function(){
    var style = $(".serch").css("display");

    if('none'== style){
        $("#pull_down").css("background-image",'url("../oa/appwork/upfile/pullup.PNG")');
        $(".serch").show();
    }else{
        $(".serch").hide();
        $("#pull_down").css("background-image",'url("../oa/appwork/upfile/pulldown.PNG")');
    }
});
	
function init (argument) {
	TranMng.loadOptions('Q_WORK_TYPE', 'selectworks_type');
	TranMng.loadOptions('Q_WORK_STATUS', 'selectworks_status', '', '', function(){
		$("#Q_WORK_STATUS ul").append("<li><a href='javascript:void(0);' value='2,5,6,7'>待审批+已挂起+待处理+处理中</a></li>");
		$("#Q_WORK_STATUS").selectValue("2,5,6,7");
		search();
	});
	TranMng.loadOptions('Q_DEVICE_TYPE', 'selectDecice_type');
	TranMng.loadOptions('Q_DEVICE_MODEL', 'selectDecice_model');
	TranMng.loadOptions('Q_PROPOSER_AREA', 'selectAddress');
	
	$("input#Q_WORK_APPTIME_BEGIN,input#Q_WORK_APPTIME_END").on("mouseover",function(e){	
		$(this).calendar({
			format : 'yyyy-MM-dd',		
			onSetDate : function (){
				var parent=$(e.target).parent().parent().parent();
				checkTime(parent);
			}
		});
	});  
	$('#search').click(search);
	$('#cancel').click(cancel);
	$("#queryResult").on("click", "tbody a", function(){
		operate($(this).parent().parent());
	});
	$("#queryResult").on("click", "tbody tr", function(){
		var selectData = oTable.fnGetData(this);
		WorkHistory.searchHistory(selectData);
	});
};
init();

function checkTime(parent){
	try{
		var beginObj = parent.find("[name='Q_WORK_APPTIME_BEGIN']");
		var endObj = parent.find("[name='Q_WORK_APPTIME_END']");
		
		var beginVal = beginObj.val();
		var endVal = endObj.val();
		var flag = true;
		
		beginObj.nextAll(".error").remove();
		endObj.nextAll(".error").remove();
		
		var reg = /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))(\s(([01]\d{1})|(2[0123])):([0-5]\d):([0-5]\d))?$/;
		if (beginVal != "" && !reg.test(beginVal)){
			addErrMsg(beginObj, "申请起始时间格式有问题");
			flag = false;
		}
		
		if (endVal != "" && !reg.test(endVal)){
			addErrMsg(endObj, "申请截止时间格式有问题");
			flag = false;
		}
		
		if (flag){
			
			if (beginVal != "" && beginVal > getCurrentDate()){
				addErrMsg(beginObj, "申请起始日期不能大于当前日期！");
				flag = false;
			}
			
			if (endVal != "" && endVal > getCurrentDate()){
				addErrMsg(endObj, "申请截止日期不能大于当前日期！");
				flag = false;
			}
			
			if (beginVal != "" && endVal != "" && beginVal > endVal){
				addErrMsg(endObj, "申请起始日期不能大于申请截止日期！");
				flag = false;
			}
			
		}

		return flag;
		
	}catch(e){
		console.debug("******assignment.js******checkTime******" + e)
	}
	
	return false;
}

/**
 * 回填datatable中的数据
*/
function retrieveData( sSource, aoData, fnCallback ) {
  var formArray=$('#queryForm').serializeArray();//查询条件
  var paramArray=aoData.concat(formArray);//合并查询条件和分页表格所需要的参数
  var jsonData=Util.formToJson(paramArray);
  Util.addParameter(jsonData,"SERVICE","WorkOrderService");
  Util.addParameter(jsonData, "Q_BusinessType", "assignment");
  $("#queryForm input,#queryForm .select").each(function(){
	  if (this.id && this.value){
		 Util.addParameter(jsonData, this.id, this.value);
	  }
  });
  TranMng.submitServer(jsonData,function(response){
	  console.info("查询返回数据开始");
	  console.info(response);
	  console.info("查询返回数据结束");
	  fnCallback(response);
   });
}
		
//查询
function search() {
	
	if (!checkTime($("#queryForm"))){
		 return false;
	}
	
	if (oTable == null) { //仅第一次检索时初始化Datatable
		$("#queryResult").show();
		oTable = $('#queryResult').dataTable( {
			"oLanguage": {"sUrl":"theme/page_cn.txt"},
			"aoColumns":[ 
							{ "mData": "WORK_ID","sDefaultContent": "" },
				  			{ "mData": "WORK_TYPE_NAME","sDefaultContent": "" },
				  			{ "mData": "WORK_URGENT_NAME","sDefaultContent": "" },
				  			{ "mData": "WORK_STATUS_DESC","sDefaultContent": "" },
				  			{ "mData": "DEVICE_NO","sDefaultContent": "" },
				  			{ "mData": "DEVICE_NAME","sDefaultContent": "" },
				  			{ "mData": "DEVICE_MODEL_NAME","sDefaultContent": "" },
				  			{ "mData": "CUS_ORG_NAME","sDefaultContent": "" },
							{ "mData": "WORK_APPTIME","sDefaultContent": "" },
				  			{ "sDefaultContent": "" }
				  		],
	  		"aoColumnDefs":[
				{"mRender" : function(data, type, row) {
					switch (row.WORK_STATUS) {
						case WORK_NEW_BUILD:
						case WORK_WAIT_ASSIGNMENT:
						case WORK_ASSIGNMENT_SUSPEND:
							return "<a>审批</a>";
						case WORK_WAIT_DEAL:
						case WORK_IN_DEAL:
							return "<a>重新派单</a>";
					    default:
					    	return "<a>查看</a>";
					};
				}, "aTargets": [9]}],
			"bProcessing": true,					//加载数据时显示正在加载信息
			"bServerSide": true,					//指定从服务器端获取数据
			"bFilter": false,						//不使用过滤功能
			"bLengthChange": false,					//用户不可改变每页显示数量
			"iDisplayLength": 5,					//每页显示8条数据
			"sAjaxSource": "normal.do?method=doAction",  //获取数据的url
			"fnServerData": retrieveData,			//获取数据的处理函数
			"sPaginationType": "full_numbers"	    //翻页界面类型	
		});
		
	}else{
			oTable.fnClearTable( 0 );
			oTable.fnDraw();
	}
}

function operate(trObj){
	console.info("***********operate()***********");
	var selectData = oTable.fnGetData(trObj[0]);
    _View.tranLinkOpen("../../oa/assignment/assignment2.html", selectData, '', function(){
    	$("#queryHistoryResult tbody").empty();
    	search();//界面返回在自动做一次查询
    });
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

function addErrMsg(obj, errMsg){
	$('<label for="' + obj.attr("id") + '" class="error" style="display: inline-block;">'+ errMsg + '</label>')
	.appendTo(obj.parent());
}

function cancel(){
	View.hub();
}
// end
})();