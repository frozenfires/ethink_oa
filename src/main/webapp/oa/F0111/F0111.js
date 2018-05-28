//@ sourceURL=F0111.js
(function() {

	var options = {
		rules : {
			ORG_ID_P : {
				required : true,
				maxlength : 10,
				regex: "^[A-Za-z0-9]+$"
			
			},
			BRANCH_NAME : {
				required : true,
				maxlength : 20,
				regex: "^[A-Za-z0-9\u4e00-\u9fa5]+$"
			},
			ORG_TYPE : {
				required : true
			},
			LINKMAN : {
				required : true
			},
			ORG_PHONE : {
				required : true
			},
			ORG_ADDRESS : {
				required : true
			},
			EMAIL : {
				required : true,
				maxlength : 20,
				email:true
			},
			BRANCH_ADDRESS :{
				required : true
			}
		},
		messages : {
			ORG_ID_P : {
				required : "请输网点编号!",
				maxlength : "网点编码长度不能超过10",
				regex:"网点只能是字母或数字！"
			},
			BRANCH_NAME : {
				required : "请输入网点名称!",
				maxlength : "网点名称长度不能超过20",
				regex:" 网点名称输入非法"	
			},
			ORG_TYPE : {
				required : "请选择网点级别!"
			},
			LINKMAN : {
				required : "请输入联系人!",
			},
			ORG_PHONE : {
				required :  "请输入电话!"
			},
			ORG_ADDRESS : {
				required : "请输入网点地址!"
			},
			BRANCH_ADDRESS :{
				required : "请输入网点地址!"
			},
			EMAIL : {
				required : "请输入电子邮箱!",
				maxlength : "电子邮箱不能超过20",
				regex:"邮箱号码输入非法"	
			}
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

	function init(argument) {
		TranMng.loadOptions('AREA_ID', 'selectAddress');
		TranMng.loadOptions('AGENT_ID', 'selectAgent');
		Util.resetForm("addUserForm");
		validatorInit();
		$('#org_search').click(function() {

			org_search();
		});

		$('#add_save').click(function() {
			add_save();
		});

		$('#edit_save').click(function() {
			edit_save();
		});

		$('#query').click(function() {
			$("#menuContent").hide();
			$("#editmenuContent").hide();
			search();
		});

		$('#ADD').click(function() {
			$("#menuContent").hide();
			
			add();
		});

		$('#EDIT').click(function() {
			$("#editmenuContent").hide();
			edit();
		});
		$('#DELETE').click(function() {
			deleteRows();
		});
		$('#ORG_NAME').click(function() {
			$(".addhide").hide();
			show_ORGTree();
		});
		$('#EDITORG_NAME').click(function() {
			$(".addhide").hide();
			show_ORGTree();
		});
		$('#QuerORG_NAME').click(function() {
			$("#querymenuContent").hide();
			$(".queryhide").hide();
			$("#org_search").hide();
			
			show_ORGTree();
		});
		$('#addshowagent1').click(function() {
			showAgent1();//添加时显示代理商输入框
		});
		$('#addshowagent2').click(function() {
			showAgent2();//添加时隐藏输入框
		});
		$('#showagent2').click(function() {
			showAgent2();//添加时隐藏输入框
		});
		$('#showbranch1').click(function() {
			showbranch1();//添加时显示上级机构输入框
		});
		$('#showbranch2').click(function() {
			showbranch1();//添加时隐藏上级机构输入框
		});
		$('#showbranch3').click(function() {
			showbranch1();//添加时隐藏输入框
		});
		$('#showbranch4').click(function() {
			showbranch4();//添加时隐藏输入框
		});
		$('#editcus1').click(function() {
			hideditcus1();//添加时隐藏输入框
		});
		$('#editcus2').click(function() {
			showeditcus2();//添加时隐藏输入框
		});
		Util.resetForm("addOrgForm");
		$('#addOrgForm').validate(options);
		$('#editOrgForm').validate(options);
		$('#cancel').click(cancel);
		$("#ORG_ID_P").blur(function(){
	      search_cusinfcount(); 
	    });
	/*View.closeEvent(function(){
		$('#orgInfo tbody tr').die();
	
	});*/
	}
	;

	init();

	function cancel() {
		View.hub();
	}
	//回填修改用户界面
	function response_edit(response) {
		//获取数据
		var jsonData = response.DATA[0];
		//填充数据到界面
		Util.fillData(jsonData, "editOrgForm");

		$('#EDITORG_NAME').attr("value",jsonData.PORG_NAME);
		$('#EDITORG_TREE').attr("value",jsonData.PARENT_ORG_ID);
		if(jsonData.CUSTOMER_TYPE=="1"){
			$('#editshowAGENT_ID').hide();
			$('#btcustype').text("直签");
		}
		if(jsonData.CUSTOMER_TYPE=="2"){
			$('#editshowAGENT_ID').show();
			$('#btcustype').text("代理商");
		}
		if(jsonData.ORG_TYPE=="1"){
			$('#showeditorg').text("网点");
		}
		if(jsonData.ORG_TYPE=="2"){
			$('#showeditorg').text("支行");
		}
		if(jsonData.ORG_TYPE=="3"){
			$('#showeditorg').text("分行");
		}
		if(jsonData.ORG_TYPE=="4"){
			$('#showeditorg').text("总行");
		}
	}

	function edit() {
		var selectedtr = $("#orgInfo tr.row_selected");
		if(selectedtr.length==0){
			Alert.error("请选择一行进行修改！");
			return;
		}
		//选中的具体第一行的行中所有内容
		var selectData = oTable.fnGetData(selectedtr[0]);
	
		if (selectData === null) {
			Alert.error("请选择一行进行修改!");
			return;
		}

		/*if(aSelected.length==0){
			Alert.error("请选择一行进行修改!");
			return;
		}*/
		if (selectedtr.length == 0) {
			Alert.error("请选择一行进行修改!");
			return;
		}
		/*if(aSelected.length>1){
			Alert.error("只能选择一行进行修改!");
			return;
		}*/
		if (selectedtr.length > 1) {
			Alert.error("只能选择一行进行修改!");
			return;
		}
		Util.clearForm("editOrgForm");
		Alert.popWindow(editOrgWindow);
		var jsonData = {};
		Util.addParameter(jsonData, "SERVICE", "CommonQueryService");
		Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
		Util.addParameter(jsonData, "SQLID", "selectOrgDetail");
		//Util.addParameter(jsonData,"ORGG_ID",aSelected.toString());
		Util.addParameter(jsonData, "ORGG_ID", selectData.ORG_ID_P);
		TranMng.submitServer(jsonData, response_edit);
		
	}


	//编辑保存响应
	function editResponse(response) {
		//关闭编辑窗口
		Alert.closeWindow(editOrgWindow);
		if (response.SUCCESS) {
			org_search();
		}
	}

	//编辑保存
	function edit_save() {
		
		var flag = $("#editOrgForm").valid();
		if (!flag) {
			return;
		}
		
		
	
		//var agentid = $("#AGENT_ID").val();
		//var orgtype = $("#ORG_TYPE").val();
	
		var formArray = $('#editOrgForm').serializeArray(); //编辑条件
		var jsonData = Util.formToJson(formArray);
	
	    var st = jsonData.CUSTOMER_TYPE;
		
		if(st=="1"){
			 jsonData.AGENT_ID="";
			
		}
		//jsonData.CUSTOMER_TYPE="p";
		//alert(jsonData.CUSTOMER_TYPE+":11111111");
		Util.addParameter(jsonData, "SERVICE", "CommonExecuteService");
		Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
		Util.addParameter(jsonData, "SQLID", "updateOrg");
		//Util.addParameter(jsonData, "ORG_ID_P", selectData.ORG_ID_P);
		TranMng.submitServer(jsonData, editResponse);
	}

	//删除响应
	function deleteResponse(response) {
		Alert.processingCancel();
		org_search();
		if (!response.SUCCESS) {
			Alert.error(response.MESSAGE);
		}

	}
//删除前查询对应网点下设备记录行数
	function  search_devCount(response){
	
		var jsonData = response.DATA[1];
		
		if(jsonData.deleteFlag=="N"){
			Alert.error("该网点下有设备，不能删除该网点!");	
			
		}
		if(jsonData.deleteFlag=="Y"){
			 Alert.processing("交易提交中，请稍候...");
			 org_search();
			Alert.processingCancel();
			
			
		}
	}
	//删除按钮
	function deleteRows() {

		var selectedtr1 = $("#orgInfo tr.row_selected");
		//选中的具体第一行的行中所有内容
		if(selectedtr1.length==0){
			Alert.error("请选择一行进行删除！");
			return;
		}
		var selectData1 = oTable.fnGetData(selectedtr1[0]);
		/*if(aSelected.length==0){
			Alert.error("请选择行进行删除！");
			return;
		}*/
		if (selectedtr1.length == 0) {
			Alert.error("请选择行进行删除！");
			return;
		}
		Alert.confirm("你确定要删除这些数据吗？", function() {
			var jsonData = {};
			var rowData = [];
			$.each(selectData1, function(index, value) {
				var row = {};
				if (index === "ORG_ID_P") {
					Util.addParameter(row, "ORGG_ID", value);
					//其中index相当于JAVA中的LIST中的索引，VALUE为索引对应的值，其中索引从0开始
					rowData.push(row);
				}
			});
			var jsonData = {};
		
			Util.addParameter(jsonData, "SERVICE", "OACustomerInfoServicre");
			Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
			Util.addParameter(jsonData, "SQLID", "selectDevCountByid");
			//Util.addParameter(jsonData,"ORGG_ID",aSelected.toString());
			Util.addParameter(jsonData, "ORGG_ID", selectData1.ORG_ID_P);
			TranMng.submitServer(jsonData, search_devCount);//先判断网点有无设备信息  无则删除 有不能
		
			//Util.addParameter(jsonData, "BATCHDATA", rowData);
			//Util.addParameter(jsonData, "SERVICE", "CommonExecuteService");
		   // Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
			//Util.addParameter(jsonData, "SQLID", "deleteOrg");
		   // Alert.processing("交易提交中，请稍候...");
		//   TranMng.submitServer(jsonData, deleteResponse);

		});
	}

	//添加用户
	function add() {
		
		
		//$(':input','#addUserForm').val('');  
		Util.clearForm("addOrgForm");

		//弹出增加用户窗口
		Alert.popWindow(addOrgWindow);
	}


	//增加按钮保存
	function add_save() {
		var flag = $("#addOrgForm").valid();
		if (!flag) {
			return;
		}
  var orgtype=$("#ORG_TYPE").val();
		   //检测select是否有值
		 var flag = false;
		 $("#addOrgForm #errMsg").html("");
		 $("#addOrgForm .select").each(function(){
		
			 var meg = {"AREA_ID":"请选择所属区域！","CUSTOMER_TYPE":"请选择签售类别！","ORG_TYPE":"请选择机构级别！"};	 	
			 var sValue = $(this).selectValue();
			 if (meg[this.id] != undefined && (sValue == "" || sValue == null || sValue == undefined)){
				 $('<label for="AGENT_ID" class="error" style="display: inline-block;">' + meg[this.id] + '</label>').appendTo($(this).parent());
				 flag = true;
			 }
		 });
		
		 if (flag){
			 return false;
		 }
		
		
		var formArray = $('#addOrgForm').serializeArray(); //查询条件
		var jsonData = Util.formToJson(formArray);
		var error=$(".orgnameerror");
         if(Number(orgtype)<4){
			 
	
				var orgtree= jsonData.ORG_TREE;
				if(orgtree==null||orgtree==undefined||orgtree==""){	
				     
					  error.html('<font color="red">请选择上级机构!</font>');
					 return;
				}else{
					 error.html('');
				}
             }
		

		Util.addParameter(jsonData, "SERVICE", "CommonExecuteService");
		Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
		Util.addParameter(jsonData, "SQLID", "insertOrg");
		Alert.closeWindow(addOrgWindow);
		TranMng.submitServer(jsonData, response_add);

	}
    function  showAgent1(){
    	
    	$('.error').html('');
	  $("#showagentid").hide();

    	
    }
    function  showAgent2(){
    	$('.error').html('');
    	$("#showagentid").show();
    	$("#addOrgForm .select").each(function(){
    		
			 var meg = {"AGENT_ID":"请选择代理商！"};	 	
			 var sValue = $(this).selectValue();
			 if (meg[this.id] != undefined && (sValue == "" || sValue == null || sValue == undefined)){
				 $('<label for="AGENT_ID" class="error" style="display: inline-block;">' + meg[this.id] + '</label>').appendTo($(this).parent());
				 flag = true;
			 }
		 });
		 
		 if (flag){
			 return false;
		 }
  	  

      	
      }

	//增加完成响应
	function response_add(response) {
		if (response.SUCCESS) {
			org_search();
		} else {
			Alert.error("该机构已存在！");
		}
	}



	//查询分页回调方法
	function responseFunction(response) {
		callback(response);
		//清空选择行数组
		aSelected = [];
	}


	function retrieveData(sSource, aoData, fnCallback) {
		var formArray = $('#orgQueryForm').serializeArray(); //查询条件
		var paramArray = aoData.concat(formArray); //合并查询条件和分页表格所需要的参数
		var jsonData = Util.formToJson(paramArray);

		Util.addParameter(jsonData, "SERVICE", "CommonQueryService");
		Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
		Util.addParameter(jsonData, "SQLID", "selectOrgPage");
		Util.addParameter(jsonData, "IS_PAGE", true);
		callback = fnCallback;
		TranMng.submitServer(jsonData, responseFunction);

	}




	//"查询"按钮的处理
	function org_search() {
		if (oTable == null) { //仅第一次检索时初始化Datatable
			$("#orgInfo").show();
			oTable = $('#orgInfo').dataTable({
				//"bAutoWidth": true,
				//"sScrollX" : "1000px",
				"oLanguage" : {
					"sUrl" : "theme/page_cn.txt"
				},
				"aoColumnDefs" : [
					{
						"mRender" : function(data, type, row) {
							switch (row.ORG_TYPE) {
							case '1':
								return "网点";
								break;
							case '2':
								return "支行";
								break;
							case '3':
								return "分行";
								break;
							case '4':
								return "总行";
								break;
							default:
								break;
							}
							;
						},
						"aTargets" : [ 1 ]
					} ],
				"aoColumns" : [
					{
						"mDataProp" : "ORG_ID_P"
					},
					{
						"mData" : "CUSTOMER_TYPE",
						"sDefaultContent" : ""
					},
					{
						"mData" : "PORG_NAME",
						"sDefaultContent" : ""
					},
					{
						"mData" : "ORG_ADDRESS",
						"sDefaultContent" : ""
					},
					{
						"mData" : "ORG_NAME",
						"sDefaultContent" : ""
					},
					{
						"mData" : "LINKMAN",
						"sDefaultContent" : ""
					},
					{
						"mData" : "ORG_PHONE",
						"sDefaultContent" : ""
					},
					//{ "mData": "ORG_STATUS","sDefaultContent": "" },
					{
						"mData" : "EMAIL",
						"sDefaultContent" : ""
					},
					{
						"mData" : "AGENT_NAME",
						"sDefaultContent" : ""
					},
					{
						"mData" : "ADDRESS_NAME",
						"sDefaultContent" : ""
					}
				],
				"bStateSave" : false, // 保存cookie
				"bAutoWidth" : false, // 自动调整列宽
				"bProcessing" : true, //加载数据时显示正在加载信息
				"bServerSide" : true, //指定从服务器端获取数据
				"bFilter" : false, //不使用过滤功能
				"bLengthChange" : false, //用户不可改变每页显示数量
				"iDisplayLength" : 10, //每页显示8条数据
				"sAjaxSource" : "normal.do?method=doAction", //获取数据的url
				"fnServerData" : retrieveData, //获取数据的处理函数
				"sPaginationType" : "full_numbers" //翻页界面类型

			});

		} else {
			oTable.fnClearTable(0);
			oTable.fnDraw();
		}
	}

	function selectTree_add(response) {
		console.info(response);
		var dataList = response.DATA;

		var newDataList = [];

		for (var o in dataList) {
			var rowMap = {};
			rowMap["id"] = dataList[o].ID;
			rowMap["pId"] = dataList[o].PID;
			rowMap["name"] = dataList[o].NAME;
			newDataList.push(rowMap);
		}
	
	var setting = {
		
		check : {
			enable : false
		},
		data : {
			simpleData : {
				enable : true
			}
		},
		callback : {
			beforeClick : beforeClick,
			onCheck : onCheck
		}
	};



	$(document).ready(function() {
	
		$.fn.zTree.init($("#treeDemo"), setting, newDataList);
		$.fn.zTree.init($("#querytreeDemo"), setting, newDataList);
		$.fn.zTree.init($("#edittreeDemo"), setting, newDataList);
	});


	function onCheck(e, treeId, treeNode) {
	
		var treeObj = $.fn.zTree.getZTreeObj("treeDemo"),
			nodes = treeObj.getCheckedNodes(false),
			selectid = "";
		for (var i = 0; i < nodes.length; i++) {
			if (i < nodes.length - 1) {
				selectid += nodes[i].id + ",";
			} else {
				selectid += nodes[i].id;
			}
			$("#ORG_TREE").val(selectid);
			$("#EDITORG_TREE").val(selectid);
			$("#QueryORG_TREE").val(selectid);
		}
	}

	function beforeClick(treeId, treeNode, clickFlag) {
		
		$("#ORG_NAME").attr("value", treeNode.name);
		$("#ORG_TREE").attr("value", treeNode.id);
		$("#EDITORG_NAME").attr("value", treeNode.name);
		$("#EDITORG_TREE").attr("value", treeNode.id);
		$("#QueryORG_TREE").attr("value", treeNode.id);
		$("#QuerORG_NAME").attr("value", treeNode.name);
		$(".addhide").show();
		$(".queryhide").show();
		$(".orgnameerror").hide();
		$("#menuContent").hide();
		$("#editmenuContent").hide();
		
		$("#QuerymenuContent").hide();
		$("#org_search").show();
	}

	}
	//ztree查询网点父子id
	function show_ORGTree(treeId, treeNodetreeNode, clickFlag) {
		
		
		var jsonData = {};
		Util.addParameter(jsonData, "SERVICE", "CommonQueryService");
		Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
		Util.addParameter(jsonData, "SQLID", "selectOrgTree");
		TranMng.submitServer(jsonData, selectTree_add);
		$("#menuContent").show();
		$("#editmenuContent").show();
		$("#QuerymenuContent").show();
		$("body").bind("mousedown", onBodyDown);
		$("body").bind("mousedown", queryonBodyDown);
		$("body").bind("mousedown", editonBodyDown);
		
	}
	function onBodyDown(event) {
		
		if (!(event.target.id == "ORG_TREE" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
			hideMenu();
			$(".addhide").show();
		}
	}
	function hideMenu() {
 
		$("#menuContent").hide();
		
		$("body").unbind("mousedown", onBodyDown);
		$(".addhide").show();
		
	}
	

	
	function queryhideMenu() {
		
		$("#QuerymenuContent").hide();
		
		$("body").unbind("mousedown", queryonBodyDown);
		$(".queryhide").show();
		
	}
	function queryonBodyDown(event) {
		if (!(event.target.id == "QueryORG_TREE" || event.target.id == "QuerymenuContent" || $(event.target).parents("#QuerymenuContent").length > 0)) {
		
			queryhideMenu();
			
		}
	}

	function edithideMenu() {
		
		$("#editmenuContent").hide();
		
		$("body").unbind("mousedown", editonBodyDown);
	
	}
	function editonBodyDown(event) {
		if (!(event.target.id == "EDITORG_TREE" || event.target.id == "editmenuContent" || $(event.target).parents("#editmenuContent").length > 0)) {
			edithideMenu();
			
		}
	}
	
	function showbranch1(){
		$('.error').html('');
		$("#parentbranch").show();
		
		
	}
	function showbranch4(){
		$('.error').html('');
		$("#parentbranch").hide();
		
		
	}
	function hideditcus1(){
		$('.error').html('');
		$("#editshowAGENT_ID").hide();
		
	}
	function showeditcus2(){
		$('.error').html(''); 
		$("#editshowAGENT_ID").show();
		
		
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
	}
	function search_cusinfcount(){
		var jsonData = {};
		 var error=$(".idperror");
		 error.html('');
	
		var orgva= $("#ORG_ID_P").val();
		
		if(orgva.length>0){
		
	Util.addParameter(jsonData, "SERVICE", "CommonQueryService");
    Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
    Util.addParameter(jsonData, "SQLID", "selectCuscountTByID");
    Util.addParameter(jsonData, "ORG_ID_P", orgva);
    TranMng.submitServer(jsonData, search_cusCount);
		}
	}
	
	function  search_cusCount(response){
		
		var jsonData = response.DATA[0];
		
		if(jsonData.CUSINFOCOUNT>0){	
		     var error=$(".idperror");
			  error.html('<font color="red">网点编号重复添加!</font>');
		}else{
			 error.html('');
		}
		
	}
})();