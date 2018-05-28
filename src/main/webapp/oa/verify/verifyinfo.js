//@ sourceURL=F008.js
(function(){
	var options={    
		    rules:{
		    	ORGG_ID:{required:true,maxlength:10},
		    	ORGG_NAME:{required:true,maxlength:20},
		    	ORG_TYPE:{required:true},
		    	ADDRESS_NAME:{required:true},
		    	ADDRESS_UPNAME:{required:true},
		    	ADDRESS_UPID:{required:true},
		    	PARENT_ORG_ID:{maxlength:20},
		    	ORG_STATUS:{maxlength:1},
		    	ORG_ADDRESS:{maxlength:30},
		    	ORG_PHONE:{maxlength:15},
		    	ORG_CONTACTS:{maxlength:20}
		    },
		    messages:{
		    	ADDRESS_NAME: "请输入区域名称",
		    	ADDRESS_UPNAME: "请输入上级区域名称!",
		    	ADDRESS_UPID: "请输入上级区域ID!",
		    	ORGG_ID: {required:"请输入区域编码!",maxlength:"区域编码长度不能超过10"},
		    	ORGG_NAME: {required:"请输入区域名称!",maxlength:"区域名称长度不能超过20"},
		    	ORG_TYPE: {required:"请选择机构级别!"},
		    	PARENT_ORG_ID: {maxlength:"上级区域长度不能超过20"},
		    	ORG_STATUS: {maxlength:"机构状态不能超过1"},
		    	ORG_ADDRESS: {maxlength:"地址长度不能超过30"},
		    	ORG_PHONE: {maxlength:"电话长度不能超过15"},
		    	ORG_CONTACTS: {maxlength: "联系人长度不能超过20"}
		    }
		  };
	
	
	//定义表格
	var oTable = null;
	var Q_Occasion = "initial";
	var transferData = $("#mainContent").data("_userData");
    if(transferData == 'RET'){//页面返回
    	Q_Occasion = "notinitial"
    }
	//选择行的数据
	//var aSelected = [];
	//查询回调方法
	var callback;
	
	//增加用户模态窗口
	var addOrgWindow = $('#addOrgModal');
	//编辑用户模态窗口
	var editOrgWindow = $('#editOrgModal');
	//选中的具体的行数
	/*var selectedtr = $("#orgInfo tr.row_selected");
	//选中的具体第一行的行中所有内容
	var selectData = oTable.fnGetData( selectedtr[0] );*/
	
	$(".serch").hide();
	$("#pull_down").click(function(){
	    var style = $(".serch").css("display");

	    if('none'== style){
	        $(".serch").show();
	    }else{
	        $(".serch").hide();
	    }
	});
	
function init (argument) {
	  
	//$("#orgInfo .row_selected :last-child").live("click", operate);
	//$('a._look').live("click", operate);
	//$('a._modify').live("click", operate);
	TranMng.loadOptions('Q_WORK_TYPE', 'selectworks_type');
	TranMng.loadOptions('Q_WORK_STATUS', 'selectworks_status', '', '', function(){
		$("#Q_WORK_STATUS").selectValue("8");
		org_search();
	});
	
	TranMng.loadOptions('Q_DEVICE_TYPE', 'selectDecice_type');
	TranMng.loadOptions('Q_DEVICE_MODEL', 'selectDecice_model');
	TranMng.loadOptions('Q_WORK_DEPARTMENT', 'selectAddress');
	TranMng.loadOptions('Q_WORK_ASSIGN_DEPARTMENT', 'selectAddress');
    $('#temptable').on('click', '._look', operate);
    $('#temptable').on('click', '._modify', operate);
	
    $("input#Q_WORK_APPTIME_BEGIN,input#Q_WORK_APPTIME_END").on("mouseover",function(e){	
		$(this).calendar({
			format : 'yyyy-MM-dd',		
			onSetDate : function (){
				var parent=$(e.target).parent().parent().parent();
				checkTime(parent);
			}
		});
	});
    
	
	$('#verify').click(function(){
		verifylist();
	   });
	$('#notverify').click(function(){
		Notverifylist();
	   });
	
	$('#ADDRESS_UPNAME').click(function(){
		show_BRATree();
	   });
	$('#ADDRESS_UPNAME_EDIT').click(function(){
		show_BRATree();
	   });
	
	$('#org_search').click(function(){
		Q_Occasion = "notinitial";
		org_search();
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
	
	Util.resetForm("addOrgForm");
	$('#addOrgForm').validate(options);
	$('#editOrgForm').validate(options);
	$('#cancel').click(cancel);

	
	
	
	
	/*View.closeEvent(function(){
		$('#orgInfo tbody tr').die();
	
	});*/

	
	$("#orgInfo").on("click", "tbody tr", function(){
		var selectData = oTable.fnGetData(this);
		WorkHistory.searchHistory(selectData);
	});
};

function checkTime(parent){
	
	try{
		var flag = true;
		var beginObj = parent.find("[name='Q_WORK_APPTIME_BEGIN']");
		var endObj = parent.find("[name='Q_WORK_APPTIME_END']");
		var beginVal = beginObj.val();
		var endVal = endObj.val();
		var reg = /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))(\s(([01]\d{1})|(2[0123])):([0-5]\d):([0-5]\d))?$/;
		beginObj.nextAll(".error").remove();
		endObj.nextAll(".error").remove();
		
		if(beginVal!=""){
		if (!reg.test(beginVal)){
			Alert.error("起始日期格式错误！");
			flag = false;
		}
		}
		 if(endVal!=""){
		if (!reg.test(endVal)){
			Alert.error("结束日期格式错误！");
			flag = false;
		}
		}
		
		 if (reg.test(beginVal)){
		 if (beginVal != "" && beginVal > getCurrentDate()){
			Alert.error("查询起始日期不能大于当前日期！");
			//addErrMsg(beginObj, "查询起始日期不能大于当前日期！");
			flag = false;
		}
		 }
		
		 if (reg.test(endVal)){
		 if (endVal != "" && endVal > getCurrentDate()){
			Alert.error("查询截止日期不能大于当前日期！");
			//addErrMsg(endObj, "查询截止日期不能大于当前日期！");
			flag = false;
		}
		 }
		 
		 if (reg.test(beginVal)&&reg.test(endVal)){
		 if (beginVal != "" && endVal != "" && beginVal > endVal){
			Alert.error("查询起始日期不能大于查询截止日期！");
			//addErrMsg(endObj, "查询起始日期不能大于申请截止日期！");
			flag = false;
		}
		 }
		
		return flag;
		
	}catch(e){
		console.debug("******assignment.js******checkTime******" + e)
	}
	
	return false;
		
		
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


init();

function cancel(){
	View.hub();
}
//展示树
function show_BRATree( treeId, treeNode, clickFlag){
	var jsonData={};
	Util.addParameter(jsonData,"SERVICE","CommonQueryService");
	Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
	Util.addParameter(jsonData,"SQLID","selectAddressTree");
	TranMng.submitServer(jsonData,selectTree_add);
	
}



function selectTree_add(response){
	var dataList=response.DATA;
  
	var newDataList=[];
     
     for(var o in dataList){ 
  	   var rowMap={};
  	    rowMap["id"]=dataList[o].ID;
  	    rowMap["pId"]=dataList[o].PID;
  	    rowMap["name"]=dataList[o].NAME;
  	    newDataList.push(rowMap);
     }  
     if(newDataList.length==0){
    	 Alert.error("对不起，请您先添加区域信息！");
    	 $(".dd").show();
    	 $("#menuContent").hide();
    	 
     }else{
    	// $(".dd").hide();
    	 $("#menuContent").show();
    	 $("#menuContent_edit").show();
    	 $("#treeDemo").show();
    	 $("#treeDemo_EDIT").show();
     }
var setting = {
		check: {
			enable: false
			
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback:{
			beforeClick: beforeClick,
//			beforeClick_edit: beforeClick_edit,
			onCheck:onCheck
      }
	};

	

	$(document).ready(function(){
		setting.check.chkboxType = { "Y" : "ps", "N" : "ps" };
		$.fn.zTree.init($("#treeDemo"), setting, newDataList);
		$.fn.zTree.init($("#treeDemo_EDIT"), setting, newDataList);
	});


	 function onCheck(e,treeId,treeNode){
      var treeObj=$.fn.zTree.getZTreeObj("treeDemo"),
      nodes=treeObj.getCheckedNodes(true),
		selectid="";
      for(var i=0;i<nodes.length;i++){
	      if(i<nodes.length-1){
		   selectid+=nodes[i].id+",";
		  }else{
		   selectid+=nodes[i].id;
		  }
	      $("#BRACH_TREE").val(selectid);
	      $("#BRACH_TREE_EDIT").val(selectid);
        }
   }
}

function beforeClick( treeId, treeNode, clickFlag) {	
	$("#BRACH_TREE").attr("value",treeNode.id);
	$("#ADDRESS_UPNAME").attr("value",treeNode.name);
	$("#BRACH_TREE_EDIT").attr("value",treeNode.id);
	$("#ADDRESS_UPNAME_EDIT").attr("value",treeNode.name);	
}

//回填修改用户界面
function response_edit(response){
	//获取数据
	var jsonData=response.DATA[0];
	//填充数据到界面
	Util.fillData(jsonData,"editOrgForm");
	$('#o_type').text(jsonData.ORG_TYPE);
  }

function edit(){
	
	var selectedtr = $("#orgInfo tr.row_selected");
	
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
	
	/*if(aSelected.length==0){
		Alert.error("请选择一行进行修改!");
		return;
	}*/
	
	/*if(aSelected.length>1){
		Alert.error("只能选择一行进行修改!");
		return;
	}*/
	if(selectedtr.length>1){
		Alert.error("只能选择一行进行修改!");
		return;
	}
	  Util.clearForm("editOrgForm");
	  $("#treeDemo_EDIT").hide();
	 Alert.popWindow(editOrgWindow);
	  var jsonData={};
	  Util.addParameter(jsonData,"SERVICE","CommonQueryService");
      Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
      Util.addParameter(jsonData,"SQLID","selectAddressDetail");
      //Util.addParameter(jsonData,"ORGG_ID",aSelected.toString());
      Util.addParameter(jsonData,"ADDRESS_ID", selectData.ADDRESS_ID);
      TranMng.submitServer(jsonData,response_edit);
	
}

//编辑保存响应
function editResponse(response){
	//关闭编辑窗口
	Alert.closeWindow(editOrgWindow);
	if(response.SUCCESS){
		org_search();
	}
}

//编辑保存
function edit_save(){
	 var flag= $("#editOrgForm").valid();
	 if(!flag){
		 return;
	 }
	var formArray=$('#editOrgForm').serializeArray();//编辑条件
	var jsonData=Util.formToJson(formArray);
	Util.addParameter(jsonData,"SERVICE","CommonExecuteService");
    Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
    Util.addParameter(jsonData,"SQLID","upAddressOrg");
    
    TranMng.submitServer(jsonData,editResponse);
}

//删除响应
function deleteResponse(response){
	Alert.processingCancel();
	org_search();
	if(!response.SUCCESS){
		Alert.error(response.MESSAGE);
	}
	
}

//删除按钮
function deleteRows(){
	var selectedtr1 = $("#orgInfo tr.row_selected");
	
	if(selectedtr1.length==0){
		Alert.error("请选择行进行审验！");
		return;
	}
	//选中的具体第一行的行中所有内容
	var selectData1 = oTable.fnGetData( selectedtr1[0] );
	/*if(aSelected.length==0){
		Alert.error("请选择行进行删除！");
		return;
	}*/
	
	  Alert.confirm("你确定要删除这些数据吗？",function()
			{
		  var jsonData={};
		  var rowData =[];	 
		  $.each(selectData1,function(index,value){
			  var row={};
			  if(index === "ADDRESS_ID"){
			  Util.addParameter(row,"ADDRESS_ID",value);
	             //其中index相当于JAVA中的LIST中的索引，VALUE为索引对应的值，其中索引从0开始
              rowData.push(row);
			  }
	      });
			 Util.addParameter(jsonData,"SERVICE","CommonExecuteService");
			 Alert.processing("交易提交中，请稍候...");
			 TranMng.submitServer(jsonData,deleteResponse);
		
		});
}

//添加用户
function add(){
	//$(':input','#addUserForm').val('');  
	Util.clearForm("addOrgForm");
	//弹出增加用户窗口
	$("#treeDemo").hide();
	Alert.popWindow(addOrgWindow);
}


//增加按钮保存
function add_save(){
	 var flag= $("#addOrgForm").valid();
	 if(!flag){
		 return;
	 }
	 var formArray=$('#addOrgForm').serializeArray();//查询条件
	 var jsonData=Util.formToJson(formArray);
	     Util.addParameter(jsonData,"SERVICE","CommonExecuteService");
	     Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
	     Util.addParameter(jsonData,"SQLID","insertAddressOrg");
	     Alert.closeWindow(addOrgWindow);
	     TranMng.submitServer(jsonData,response_add);
	
}

//增加完成响应
function response_add(response){
	if(response.SUCCESS){
		org_search();
	}else{
		Alert.error("该机构已存在！");
	}
}



//查询分页回调方法
function responseFunction(response){
	 callback(response);
	 //清空选择行数组
	 aSelected=[];
}
  

function retrieveData( sSource, aoData, fnCallback ) {
	  
		      var formArray=$('#orgQueryForm').serializeArray();//查询条件
		      var paramArray=aoData.concat(formArray);//合并查询条件和分页表格所需要的参数
		      var jsonData=Util.formToJson(paramArray);
		      Util.addParameter(jsonData,"SERVICE","WorkOrderService");
		      Util.addParameter(jsonData, "Q_BusinessType", "verify");
		      //Util.addParameter(jsonData, "Q_Occasion", Q_Occasion);
		      TranMng.submitServer(jsonData,function(response){
		    	  console.info(response);
		    	  if (response.SUCCESS){
		    	      fnCallback(response);
		    	  }
		      });
		      
	   }
function operate(){
//	var seletedtr = $('#orgInfo tr.row_selected');
	var seletedtr = $(this).parents('tr');
	var selectData = oTable.fnGetData( seletedtr[0] );
	selectData.operate = $(this).text();
	console.info("1111111");
	console.info(selectData);
	console.info("2222222");
    _View.tranLinkOpen("../../oa/verify/verifyinfo2.html", selectData,'',function(){
    	$("#queryHistoryResult tbody").empty();
    	org_search();//界面返回在自动做一次查询
    });
    
    
}

		

		//"查询"按钮的处理
function org_search() {
	if (!checkTime($("#orgQueryForm"))){
		 return false;
	}
	
			if (oTable == null) { //仅第一次检索时初始化Datatable
				$("#orgInfo").show();
				oTable = $('#orgInfo').dataTable( {
					//"bAutoWidth": true,
					//"sScrollX" : "1000px",
					"oLanguage": {"sUrl":"theme/page_cn.txt"},
					"aoColumns": [
						{ "mData": "WORK_ID","sDefaultContent": "" },
			  			{ "mData": "WORK_TYPE_NAME","sDefaultContent": "" },
			  			{ "mData": "WORK_URGENT_NAME","sDefaultContent": "" },
			  			{ "mData": "WORK_STATUS_DESC","sDefaultContent": "" },
			  			{ "mData": "DEVICE_NO","sDefaultContent": "" },
			  			{ "mData": "DEVICE_NAME","sDefaultContent": "" },
			  			{ "mData": "DEVICE_MODEL_NAME","sDefaultContent": "" },
			  			{ "mData": "DEVICE_TYPE_NAME","sDefaultContent": "" },
			  			{ "mData": "CUS_ORG_NAME","sDefaultContent": "" },
						{ "mData": "WORK_APPTIME","sDefaultContent": "" },
			  			{ "sDefaultContent": "" }
						  		],
						  		"aoColumnDefs": [
				                    {
				                        "mRender": function (data, type, row) {
				                            switch (row.WORK_STATUS) {
				                                case '8':
				                                    return "<a class='_modify'>审验</a>";
				                                    break;

				                                default:
				                                    return "<a class ='_look'>查看</a>"
				                                    break;
				                            }
				                            ;
				                        }, "aTargets": [10]
				                    }],
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
		
		//选中表格行的处理
		/*$('#orgInfo tbody tr').live('click', function() { 
			
			var sData = oTable.fnGetData( this );
			var id = sData.ORG_ID;
			aSelected[0]=id;
			if ( $(this).hasClass('row_selected') ) {
	            $(this).removeClass('row_selected');
	        }
	        else {
	        	oTable.$('tr.row_selected').removeClass('row_selected');
	            $(this).addClass('row_selected');
	        }
		});	*/
		

})();

