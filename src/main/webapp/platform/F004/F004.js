//@ sourceURL=F004.js
(function(){
	
	var options={    
		    rules:{
		    	ROLE_ID:{required:true},
		    	ROLE_NAME:{required:true}
		    },
		    messages:{
		    	ROLE_ID: "请输入角色ID!",
		    	ROLE_NAME: "请输入角色名称!"
		    }
		  };
	
	
	
	//定义表格
	var oTable = null;
	//选择行的数据
	//var aSelected = [];
	//查询回调方法
	var callback;
	
	//增加用户模态窗口
	var addRoleWindow = $('#addRoleModal');
	//编辑用户模态窗口
	var editRoleWindow = $('#editRoleModal');
	
function init (argument) {
	
	$('#role_search').click(function(){
		role_search();
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
	Util.resetForm("addRoleForm");
	$('#addRoleForm').validate(options);
	$('#editRoleForm').validate(options);
	$('#cancel').click(cancel);

	/*View.closeEvent(function(){
		$('#roleInfo tbody tr').die();
	});*/
};

init();

function cancel(){
	View.hub();
}

//回填修改资源界面
function response_edit(response){
	//获取数据
	var jsonData=response.RoleDetail[0];
	//填充数据到界面
	Util.fillData(jsonData,"editRoleForm");
	var setting = {
			check: {
				enable: true
				
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			callback:{
                onCheck:onCheck
            }
		};

		

		setting.check.chkboxType = { "Y" : "ps", "N" : "ps" };
		JSON.stringify(response.RoleTree);
		$.fn.zTree.init($("#roleTreeUpdate"), setting, response.RoleTree);
		initUpdateRoleTree();

		 function onCheck(e,treeId,treeNode){
            var treeObj=$.fn.zTree.getZTreeObj("roleTreeUpdate"),
            nodes=treeObj.getCheckedNodes(true),
			selectid="";
            for(var i=0;i<nodes.length;i++){
		      if(i<nodes.length-1){
			  	selectid+=nodes[i].id+",";
			  }else{
			  	selectid+=nodes[i].id;
			  }
		      	$("#ROLE_TREE_UPDATE").val(selectid);
              }
         }
  }

function initUpdateRoleTree(){
	var treeObj=$.fn.zTree.getZTreeObj("roleTreeUpdate"),
    nodes=treeObj.getCheckedNodes(true),
	selectid="";
    for(var i=0;i<nodes.length;i++){
    	if(i<nodes.length-1){
    		selectid+=nodes[i].id+",";
    	}else{
    		selectid+=nodes[i].id;
    	}
     	$("#ROLE_TREE_UPDATE").val(selectid);
    }
}

function edit(){ 
	var selectedtr = $("#roleInfo tr.row_selected");
	/*if(aSelected.length==0){
		Alert.error("请选择一行进行修改!");
		return;
	}*/
	console.info("{{{{{{{{{{{{{{{{{{{{{{{{{{{");
	if(selectedtr.length==0){
		Alert.error("请选择一行进行修改");
		return;
	}
	/*if(aSelected.length>1){
		Alert.error("只能选择一行进行修改!");
		return;
	}*/								   
	var selectData = oTable.fnGetData( selectedtr[0] );
	console.info(selectData);
	Util.clearForm("editRoleForm");
	Alert.popWindow(editRoleWindow);
	console.info(selectData.ROLE_ID.toString());
  var jsonData={};
  Util.addParameter(jsonData,"SERVICE","SelectRoleResourceService");
 // Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
 // Util.addParameter(jsonData,"SQLID","selectRoleDetail");
 // Util.addParameter(jsonData,"ROLE_ID",aSelected.toString());
  Util.addParameter(jsonData,"ROLE_ID",selectData.ROLE_ID.toString());
  TranMng.submitServer(jsonData,response_edit);
	
}

//编辑保存响应
function editResponse(response){
	//关闭编辑窗口
	Alert.closeWindow(editRoleWindow);
	if(response.SUCCESS){
		role_search();
	}
}

//编辑保存
function edit_save(){
	var flag= $("#editRoleForm").valid();
	if(!flag){
		return;
	}
	
	 var formArray=$('#editRoleForm').serializeArray();//编辑条件
	 var jsonData=Util.formToJson(formArray);
	 Util.addParameter(jsonData,"SERVICE","UpdateRoleService");
	 // Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
	 // Util.addParameter(jsonData,"SQLID","updateRole");
		 
	 TranMng.submitServer(jsonData,editResponse);
	 
}

//删除响应
function deleteResponse(response){
	Alert.processingCancel();
	role_search();
	if(!response.SUCCESS){
		Alert.error(response.MESSAGE);
	}
	
}

//删除按钮
function deleteRows(){
	var selectedtr = $("#roleInfo tr.row_selected");
	if(selectedtr.length==0){
		Alert.error("请您选择一行进行删除");
		return;
	}
	/*if(aSelected.length==0){
		Alert.error("请选择行进行删除！");
		return;
	}*/
	var selectData1 = oTable.fnGetData( selectedtr[0] );
	  Alert.confirm("你确定要删除这些数据吗？",function()
			{
		  var jsonData={};
		  var rowData =[];
		  //此段代码含义：将选中的具体一行取出并且根据列名循环此行，取出此行的每一列的数据
		  $.each(selectData1,function(index,value){
			  var row={};
			 // Util.addParameter(row,"ROLE_ID",value);
			  if(index ==="ROLE_ID"){
			  Util.addParameter(row,"ROLE_ID",value);
	             //其中index相当于JAVA中的LIST中的索引，VALUE为索引对应的值，其中索引从0开始
              rowData.push(row);
			  }
	      });
		     //rowData.push(selectData1.ROLE_ID);
		  	 //selectData1.ROLE_ID
		     //Util.addParameter(jsonData,"BATCHDATA",selectData1.ROLE_ID);
		     Util.addParameter(jsonData,"BATCHDATA",rowData);
			 Util.addParameter(jsonData,"SERVICE","DeleteRoleService");
			 Alert.processing("交易提交中，请稍候...");
			 TranMng.submitServer(jsonData,deleteResponse);
		
		});
}

//添加用户
function add(){
	//$(':input','#addUserForm').val('');  
	Util.clearForm("addRoleForm");
	
	//弹出增加用户窗口
	Alert.popWindow(addRoleWindow);
	
	 var jsonData={};
	 Util.addParameter(jsonData,"SERVICE","CommonQueryService");
     Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
     Util.addParameter(jsonData,"SQLID","selectResourceTree");
     TranMng.submitServer(jsonData,selectTree_add);
}


function selectTree_add(response){

		 console.info(response);
	     var dataList=response.DATA;
	     var newDataList=[];
	       
	       for(var o in dataList){ 
	    	   var rowMap={};
	    	    rowMap["id"]=dataList[o].ID;
	    	    rowMap["pId"]=dataList[o].PID;
	    	    rowMap["name"]=dataList[o].NAME;
	    	    newDataList.push(rowMap);
	       }  
	  
	var setting = {
			check: {
				enable: true
				
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			callback:{
                onCheck:onCheck
            }
		};

		

		$(document).ready(function(){
			setting.check.chkboxType = { "Y" : "ps", "N" : "ps" };
			$.fn.zTree.init($("#treeDemo"), setting, newDataList);
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
		      $("#ROLE_TREE").val(selectid);
              }
         }
}


//增加按钮保存
function add_save(){
	
	 var flag= $("#addRoleForm").valid();
	 if(!flag){
		 return;
	 }
	 var formArray=$('#addRoleForm').serializeArray();//查询条件
	 var jsonData=Util.formToJson(formArray);
	     Util.addParameter(jsonData,"SERVICE","AddRoleService");
	    // Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
	    // Util.addParameter(jsonData,"SQLID","insertRole");
	     Alert.closeWindow(addRoleWindow);
	     TranMng.submitServer(jsonData,response_add);
	
}

//增加完成响应
function response_add(response){

	if(response.SUCCESS){
		role_search();
	}else{
		Alert.error("该角色已存在！");
	}
}



//查询分页回调方法
function responseFunction(response){
	 callback(response);
	 //清空选择行数组
	 aSelected=[];
}
  

function retrieveData( sSource, aoData, fnCallback ) {
	     
		      var formArray=$('#roleQueryForm').serializeArray();//查询条件
		      var paramArray=aoData.concat(formArray);//合并查询条件和分页表格所需要的参数
		      var jsonData=Util.formToJson(paramArray);
		      
		      Util.addParameter(jsonData,"SERVICE","CommonQueryService");
		      Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
		      Util.addParameter(jsonData,"SQLID","selectRolePage");
		      Util.addParameter(jsonData,"IS_PAGE",true);
		        callback=fnCallback;
		       TranMng.submitServer(jsonData,responseFunction);
	   }
		

		//"查询"按钮的处理
function role_search() {
			
			if (oTable == null) { //仅第一次检索时初始化Datatable
				$("#roleInfo").show();
				oTable = $('#roleInfo').dataTable( {
					"oLanguage": {"sUrl":"theme/page_cn.txt"},
					"aoColumns": [
						  			{ "mDataProp": "ROLE_ID" },
						  			{ "mData": "ROLE_NAME","sDefaultContent": "" },
									{ "mData": "ROLE_DESC","sDefaultContent": "" }
						  		],
					"bProcessing": true,					//加载数据时显示正在加载信息
					"bServerSide": true,					//指定从服务器端获取数据
					"bFilter": false,						//不使用过滤功能
					"bLengthChange": false,					//用户不可改变每页显示数量
					"iDisplayLength": 10,					//每页显示10条数据
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
		/*$('#roleInfo tbody tr').live('click', function() { 
			
			var sData = oTable.fnGetData( this );
			var id = sData.ROLE_ID;
			
			var index = jQuery.inArray(id, aSelected);
			if ( index === -1 ) {
				aSelected.push( id );
			} else {
				aSelected.splice( index, 1 );
			}
		    $(this).toggleClass('row_selected');
		    
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

