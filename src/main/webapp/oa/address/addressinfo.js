//@ sourceURL=F008.js
(function(){
	
	var options={    
		    rules:{
		    	ADDRESS_NAME:{required:true},
		    	ADDRESS_UPNAME:{required:true},
		    	ADDRESS_UPID:{required:true}
		    },
		    messages:{
		    	ADDRESS_NAME: "请输入区域名称",
		    	ADDRESS_UPNAME: "请输入上级区域名称!",
		    	ADDRESS_UPID: "请输入上级区域ID!"
		    }
		  };
	
	
	
	//定义表格
	var oTable = null;
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
	
function init (argument) {
	$('#ADDRESS_UPNAME').click(function(){
		show_BRATree();
	   });
	$('#ADDRESS_UPNAME_EDIT').click(function(){
		show_BRATree();
	   });
	
	$('#org_search').click(function(){
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
};

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
		Alert.error("请选择行进行删除！");
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
		     Util.addParameter(jsonData,"BATCHDATA",rowData);
			 Util.addParameter(jsonData,"SERVICE","CommonExecuteService");
			 Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
			 Util.addParameter(jsonData,"SQLID","deleteAddress");
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
		      Util.addParameter(jsonData,"SERVICE","CommonQueryService");
		      Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
		      Util.addParameter(jsonData,"SQLID","selectAddressPage");
		      Util.addParameter(jsonData,"IS_PAGE",true);
		        callback=fnCallback;
		       TranMng.submitServer(jsonData,responseFunction);
	   }


		

		//"查询"按钮的处理
function org_search() {
			if (oTable == null) { //仅第一次检索时初始化Datatable
				$("#orgInfo").show();
				oTable = $('#orgInfo').dataTable( {
					//"bAutoWidth": true,
					//"sScrollX" : "1000px",
					"oLanguage": {"sUrl":"theme/page_cn.txt"},
					"aoColumns": [
						  			{ "mDataProp": "ADDRESS_ID" },
						  			{ "mData": "ADDRESS_NAME","sDefaultContent": "" },
						  			{ "mData": "ADDRESS_UPNAME","sDefaultContent": "" },
						  			{ "mData": "ADDRESS_UPID","sDefaultContent": "" },
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

