//@ sourceURL=F008.js
(function(){
	
	var options={    
		    rules:{
		    	DEVICED_ID:{required:true,maxlength:10},
		    	DEVICE_NAME:{required:true,maxlength:10},
//		    	DEVICE_TYPE:{required:true},
//		    	HOST_NUM:{required:true,maxlength:30},
//		    	TCR_NUM:{required:true,maxlength:30},
//		    	MANAGER_NAME:{required:true,maxlength:10},
//		    	MANAGER_TEL:{required:true,maxlength:20},
//		    	ARRIVE_TIME:{required:true,maxlength:30},
//		    	SETUP_TIME:{required:true},
//		    	SETUP_BRANCH_ID:{required:true,maxlength:30},
//		    	SETUP_BRANCH_NAME:{required:true,maxlength:30},
//		    	SETUP_MAN:{required:true,maxlength:10},
//		    	SETUP_MAN_TEL:{required:true,maxlength:15},
//		    	SETUP_TYPE:{required:true,maxlength:2},
//		    	ACCPET_TIME:{required:true},
//		    	START_TIME:{required:true},
//		    	EXP_TIME:{required:true,maxlength:10},
//		    	SERVICER:{required:true,maxlength:30},
//		    	OUTOF_TIME:{required:true},
//		    	REPAIR_STATUS:{required:true,maxlength:2},
//		    	OUT_OF_SIGN:{required:true,maxlength:2},
//		    	LICENSE_TIME:{required:true},
		    	SETUP_BRANCH_NAME:{required:true}
		    },
		    messages:{
		    	DEVICED_ID: {required:"请输入设备编号!",maxlength:"设备编号长度不能超过10"},
		    	DEVICE_NAME:{required:"请输入设备名称!"},
//		    	DEVICE_TYPE: {required:"请选择设备类型!"},
//		    	HOST_NUM: {required:"请输入主机型号!",maxlength:"代理商长度不能超过30"},
//		    	TCR_NUM: {required:"请输入TCR型号!",maxlength:"联系人长度不能超过30"},
//		    	MANAGER_NAME: {required:"请输入管机员名称!",maxlength:"邮箱长度不能超过10"},
//		    	MANAGER_TEL: {required:"请输入管机员电话!",maxlength:"电话长度不能超过20"},
//		    	SETUP_MAN:{required:"请输入安装人员"},
//		    	SETUP_MAN_TEL:{required:"请输入安装人员电话"},
//		    	ARRIVE_TIME: {required:"请输入到货时间!"},
//		    	SETUP_TIME: {required:"请输入安装时间!"},
//		    	SETUP_BRANCH_ID: {required:"选择安装网点!"},
//		    	SETUP_BRANCH_NAME: {required:"选择安装网点!"},
//		    	SETUP_TYPE: {required:"请输入安装类型!"},
//		    	ACCPET_TIME: {required:"请输入验收时间!"},
//		    	START_TIME: {required:"请输入启用时间!"},
//		    	EXP_TIME:{required:"请输入质保期!",maxlength:"电话长度不能超过20"},
//		    	SERVICER: {required:"请输入维保方!",maxlength:"维保方长度不能超过30"},
//		    	OUTOF_TIME:{required:"请输入过保时间!"},
//		    	REPAIR_STATUS: {required:"请选择保修状态!"},
//		    	OUT_OF_SIGN: {required:"请选择过保续签!"},
//		    	LICENSE_TIME: {required:"请输入license到期时间!"},
		    	SETUP_BRANCH_NAME:{required:"请选择安装网点"}
		    },
		    
		  };
	
	
	
	//定义表格
	var oTable = null;
	//选择行的数据
	//var aSelected = [];
	//查询回调方法
	var callback;
	
	//增加设备模态窗口
	var addDevWindow = $('#addDevModal');
	//编辑设备模态窗口
	var editDevWindow = $('#editDevModal');
	//查看设备信息窗口
	var lookDevWindow = $('#lookDevModal');
	//查询条件中的安装时间
	$("input#SETUP_TIME_Q").on("mouseover",function(e){				
		$("input#SETUP_TIME_Q").calendar({
			format : 'yyyy-MM-dd',
			onSetDate : function (){					
			}
		});		
	})		
	
	$("input#ARRIVE_TIME").on("mouseover",function(e){	
		   $(this).calendar({
				format : 'yyyy-MM-dd',
				onSetDate : function (){
//					var parent_ID=$(e.target).parent().parent().parent().attr('id');	
//					var maxDate = $("#"+parent_ID).find("[name='SETUP_TIME']").val();
//					//$("#addDevForm").valid();
//					if (maxDate != '') { 
//						if (this.inpE.value > maxDate) {
//							this.inpE.value = '';
//							Alert.error("对不起，到货时间不能晚于安装时间！");
//						}
//					}					
				 } 
		  });
		});
		
		$("input#SETUP_TIME").on("mouseover",function(e){		
			$("input#SETUP_TIME").calendar({
				format : 'yyyy-MM-dd',
				onSetDate : function (){	
//					//$("#addDevForm").valid();
//					var parent_ID=$(e.target).parent().parent().parent().attr('id');	
//					compare_Time("SETUP_TIME","ARRIVE_TIME","到货时间","安装时间",parent_ID);	
				}
			});	
		});	 
		
		$("input#ACCPET_TIME").on("mouseover",function(e){	
			$("input#ACCPET_TIME").calendar({
				format : 'yyyy-MM-dd',		
				onSetDate : function (){
//					//$("#addDevForm").valid();
//					var parent_ID=$(e.target).parent().parent().parent().attr('id');	
//					compare_Time("ACCPET_TIME","SETUP_TIME","安装时间","验收时间",parent_ID);			
				}
			});
		});  
		
		
		$("input#START_TIME").on("mouseover",function(e){	
		
			$("input#START_TIME").calendar({
				format : 'yyyy-MM-dd',
				onSetDate : function (){	
//				//$("#addDevForm").valid();
//				var parent_ID=$(e.target).parent().parent().parent().attr('id');
//				compare_Time("START_TIME","ACCPET_TIME","验收时间","启用时间",parent_ID);	
				
				}
			});
		});
		
		$("input#OUTOF_TIME").on("mouseover",function(e){	
			$("input#OUTOF_TIME").calendar({
				format : 'yyyy-MM-dd',
				onSetDate : function (){
//					//$("#addDevForm").valid();
//					var parent_ID=$(e.target).parent().parent().parent().attr('id');
//					compare_Time("OUTOF_TIME","START_TIME","启用时间","过保时间",parent_ID);	
				}
			});
		
		});
		
		$("input#LICENSE_TIME").on("mouseover",function(e){	
			
			$("input#LICENSE_TIME").calendar({
				format : 'yyyy-MM-dd',
				onSetDate : function (){
//					//$("#addDevForm").valid();
//					var parent_ID=$(e.target).parent().parent().parent().attr('id');			
//					compare_Time("LICENSE_TIME","START_TIME","启用时间","liccese时间",parent_ID);	
				}
			});
		
		})
		
	    
		function compare_Time(timeA,timeB,time1,time2,parent_ID){
			var idA=$("#"+parent_ID).find("[name='"+timeA+"']").val();
			var idB=$("#"+parent_ID).find("[name='"+timeB+"']").val();	
			
			var ARRIVE_TIME=$("#"+parent_ID).find("[name='ARRIVE_TIME']").val();
			var SETUP_TIME=$("#"+parent_ID).find("[name='SETUP_TIME']").val();	
			var ACCPET_TIME=$("#"+parent_ID).find("[name='ACCPET_TIME']").val();
			var OUTOF_TIME=$("#"+parent_ID).find("[name='OUTOF_TIME']").val();	
			var START_TIME=$("#"+parent_ID).find("[name='START_TIME']").val();
			var LICENSE_TIME=$("#"+parent_ID).find("[name='LICENSE_TIME']").val();	
			if(ARRIVE_TIME==""){
				ARRIVE_TIME="2999-04-01 15:01";
			}
			if(SETUP_TIME==""){
				SETUP_TIME="2999-04-01 15:01";
			}
			if(ACCPET_TIME==""){
				ACCPET_TIME="2999-04-01 15:01";
			}
			if(OUTOF_TIME==""){
				OUTOF_TIME="2999-04-01 15:01";
			}
			if(START_TIME==""){
				START_TIME="2999-04-01 15:01";
			}		
			if(LICENSE_TIME==""){
				LICENSE_TIME="2999-04-01 15:01";
			}
			if(idB != ''){
				if(idA<idB){		
					Alert.error("对不起！"+time2+"不能小于"+time1+"!");
					$("#"+parent_ID).find("[name='"+timeA+"']").val("");
				}   
				else{ 
					if(LICENSE_TIME>=START_TIME && OUTOF_TIME>=START_TIME && START_TIME>=ACCPET_TIME&& ACCPET_TIME>=SETUP_TIME && SETUP_TIME>=ARRIVE_TIME ){
						$("#"+timeA).nextAll(".error").remove();
					}
					else{
						$("#"+parent_ID).find("[name='"+timeA+"']").val("");
						Alert.error("该时间同其他时间有冲突，请仔细核查并调整！");	
					}
				}
				
			}else{
				Alert.error("对不起，"+time1+"不能为空！");	
				$("#"+parent_ID).find("[name='"+timeA+"']").val("");
			}


		 }
	
	
function init (argument) {
	TranMng.loadOptions('DEVICE_TYPE', 'selectDecice_type');
	TranMng.loadOptions('DEVICE_MODEL', 'selectDecice_model');
	TranMng.loadOptions('SETUP_TYPE', 'selectSetup_type');
	TranMng.loadOptions('EXP_TIME', 'selectExp_time');
	$('#dev_search').click(function(){
		dev_search();
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
	$('#SETUP_BRANCH_NAME').click(function(){
		show_BRATree();
	   });
	$('#SETUP_BRANCH_ID').click(function(){
		show_BRATree();
	   });
	$('#LOOK').click(function(){
		look();
	   });
	$('#ensure').click(function(){
		ensure();
	   });

	Util.resetForm("addDevForm");
	$('#addDevForm').validate(options);
	$('#editDevForm').validate(options);
	$('#cancel').click(cancel);
	$("#ARRIVE_TIME").change(function(){
		if($("#ARRIVE_TIME").val()!=""||$("#ARRIVE_TIME").val()!=undefined){
			$("#ARRIVE_TIME").nextAll(".error").remove();
		}
	})

	$("#addDevForm").find(".select").each(function(){
	    $(this).change(function(){
	    	$(this).nextAll(".error").remove();   	    	
	    });
	});	  
	
};

init();

function cancel(){
	View.hub();
}


//uuid生成唯一的id
function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
 
    var uuid = s.join("");
    return uuid;
}

//回填修改资源界面
function response_edit(response){
	//获取数据
	var jsonData=response.DATA[0];
	//填充数据到界面	
	jsonData.BRACH_TREE_EDIT=jsonData.SETUP_BRANCH_ID_PRESENT;
	jsonData.BRACH_TREE_EDIT_ID=jsonData.SETUP_BRANCH_ID;
	var cusNames="";
	if(jsonData.ORG_NAME_A!="" && jsonData.ORG_NAME_A!=undefined){
		cusNames+=jsonData.ORG_NAME_A+"-";
	}
	if(jsonData.ORG_NAME_B!="" && jsonData.ORG_NAME_B!=undefined){
		cusNames+=jsonData.ORG_NAME_B+"-";
	}
	if(jsonData.ORG_NAME_C!="" && jsonData.ORG_NAME_C!=undefined){
		cusNames+=jsonData.ORG_NAME_C+"-";
	}
	if(jsonData.ORG_NAME_D!="" && jsonData.ORG_NAME_D!=undefined){
		cusNames+=jsonData.ORG_NAME_D+"-";
	}
	jsonData.SETUP_BRANCH_ID=cusNames.substr(0,cusNames.length-1);	
	Util.fillData(jsonData,"editDevForm");
	     
  }


function edit(){
	 
	var selectedtr = $("#devInfo tr.row_selected");
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
	  Util.clearForm("editDevForm");
	 Alert.popWindow(editDevWindow);
	  var jsonData={};
	  var allNames=selectData.SETUP_BRANCH_ID_PRESENT.split(",");
	  Util.addParameter(jsonData,"SERVICE","CommonQueryService");
      Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
      Util.addParameter(jsonData,"SQLID","selectDevDetail");
      Util.addParameter(jsonData,"ID", selectData.ID);
      Util.addParameter(jsonData,"ORG_ID_A", allNames[0]);
      Util.addParameter(jsonData,"ORG_ID_B", allNames[1]);
      Util.addParameter(jsonData,"ORG_ID_C", allNames[2]);
      Util.addParameter(jsonData,"ORG_ID_D", allNames[3]);
      TranMng.submitServer(jsonData,response_edit);
	
}

//编辑保存响应
function editResponse(response){
	//关闭编辑窗口
	Alert.closeWindow(editDevWindow);
	if(response.SUCCESS){
		dev_search();
	}
}

//编辑保存
function edit_save(){
 
	 var flag= $("#editDevForm").valid();
	 if(!flag){
		 return;
	 }
	 //检测select是否有值
	 var flag = false;
	 $("#editDevForm #errMsg").html("");
	 $("#editDevForm .select").each(function(){
	 var meg = {"DEVICE_TYPE":"请选择设备类型！",
			 	"DEVICE_MODEL":"请选择设备型号！",
			 	"SETUP_TYPE":"请选择安装类型！",
			 	"EXP_TIME":"请选择质保期！"
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
 
	 var formArray=$('#editDevForm').serializeArray();//编辑条件
	 var jsonData=Util.formToJson(formArray);	
	 ///增加校验
	 var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
	 var phone_re = /^0\d{2,3}-?\d{7,8}$/;
	 var tel= /^1\d{10}$/;
	 
	 var tel_value=jsonData.SETUP_MAN_TEL;
	 var tel_value_ma=jsonData.MANAGER_TEL;
	 if(tel_value_ma!=""){
		 if(!tel.test(tel_value_ma)&&!phone_re.test(tel_value_ma)){
			 Alert.error("管机员电话号码格式不正确！");
			 return;
		 }
	 }
	 if(tel_value!=""){
		 if(!tel.test(tel_value)&&!phone_re.test(tel_value)){
			 Alert.error("安装人员电话号码格式不正确！");
			 return;
		 }
	 }	
	 
	if(!checkTimeType()){
		 return false;
	}
	jsonData=checkTime(jsonData)
	Util.addParameter(jsonData,"SERVICE","CommonExecuteService");
    Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
    Util.addParameter(jsonData,"SQLID","updateDev");
    
    TranMng.submitServer(jsonData,editResponse);
}

//查看设备详细信息
function look(){
	var selectedtr = $("#devInfo tr.row_selected");
	if(selectedtr.length==0){
		Alert.error("请选择一行进行查看!");
		return;
	}
	//选中的具体第一行的行中所有内容
	var selectData = oTable.fnGetData( selectedtr[0] );
	if(selectData === null){
		Alert.error("请选择一行进行查询!");
		return;
	}
	
	if(selectedtr.length>1){
		Alert.error("只能选择一行进行查看!");
		return;
	}
	  Util.clearForm("lookDevForm");
	 Alert.popWindow(lookDevWindow);
	  var jsonData={};
	  var allNames=selectData.SETUP_BRANCH_ID_PRESENT.split(",");
	  Util.addParameter(jsonData,"SERVICE","CommonQueryService");
      Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
      Util.addParameter(jsonData,"SQLID","selectDevDetail");
      Util.addParameter(jsonData,"ID", selectData.ID);
      Util.addParameter(jsonData,"ID", selectData.ID);
      Util.addParameter(jsonData,"ORG_ID_A", allNames[0]);
      Util.addParameter(jsonData,"ORG_ID_B", allNames[1]);
      Util.addParameter(jsonData,"ORG_ID_C", allNames[2]);
      Util.addParameter(jsonData,"ORG_ID_D", allNames[3]);
      TranMng.submitServer(jsonData,response_look);
	
}


//回填查看资源界面
function response_look(response){
	//获取数据
	var jsonData=response.DATA[0];
	//填充数据到界面
	var cusNames="";
	if(jsonData.ORG_NAME_A!="" && jsonData.ORG_NAME_A!=undefined){
		cusNames+=jsonData.ORG_NAME_A+"-";
	}
	if(jsonData.ORG_NAME_B!="" && jsonData.ORG_NAME_B!=undefined){
		cusNames+=jsonData.ORG_NAME_B+"-";
	}
	if(jsonData.ORG_NAME_C!="" && jsonData.ORG_NAME_C!=undefined){
		cusNames+=jsonData.ORG_NAME_C+"-";
	}
	if(jsonData.ORG_NAME_D!="" && jsonData.ORG_NAME_D!=undefined){
		cusNames+=jsonData.ORG_NAME_D+"-";
	}
	
	jsonData.SETUP_BRANCH_ID_NAME=cusNames.substr(0,cusNames.length-1);	
	Util.fillData(jsonData,"lookDevForm");
}

//查看详细信息后点击确定
function ensure(){
	//关闭查看详细信息窗口
	Alert.closeWindow(lookDevWindow);
}


//删除响应
function deleteResponse(response){
	Alert.processingCancel();
	dev_search();
	if(!response.SUCCESS){
		Alert.error(response.MESSAGE);
	}
	
}

//删除按钮
function deleteRows(){
	var selectedtr1 = $("#devInfo tr.row_selected");
	if(selectedtr1.length==0){
		Alert.error("请选择行一行进行删除！");
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
			  if(index === "ID"){
			  Util.addParameter(row,"ID",value);
	             //其中index相当于JAVA中的LIST中的索引，VALUE为索引对应的值，其中索引从0开始
              rowData.push(row);
			  }
	      });
		     Util.addParameter(jsonData,"BATCHDATA",rowData);
			 Util.addParameter(jsonData,"SERVICE","CommonExecuteService");
			 Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
			 Util.addParameter(jsonData,"SQLID","deleteDev");
			 Alert.processing("交易提交中，请稍候...");
			 TranMng.submitServer(jsonData,deleteResponse);
		
		});
}

//添加设备
function add(){
	//$(':input','#addUserForm').val('');  
	Util.clearForm("addDevForm");
	//弹出增加设备窗口
	Alert.popWindow(addDevWindow);
}


//js校验时间格式
function checkTimeType() {
		var ARRIVE_TIME = $("#ARRIVE_TIME").val();
		var SETUP_TIME = $("#SETUP_TIME").val();
		var OUTOF_TIME = $("#OUTOF_TIME").val();
		var START_TIME = $("#START_TIME").val();
		var ACCEPT_TIME = $("#ACCEPT_TIME").val();
		var LICENSE_TIME = $("#LICENSE_TIME").val();
        var reg = /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))(\s(([01]\d{1})|(2[0123])):([0-5]\d):([0-5]\d))?$/;
        if(ARRIVE_TIME!="" && ARRIVE_TIME!=null && ARRIVE_TIME!=undefined){
        	 if (!reg.test(ARRIVE_TIME)) {
        		 Alert.error("请选择正确的到货时间(格式: 2008-08-08 20:20:03 或者  2008-08-08)");
                 return false;
            }
        }else{
        	Alert.error("请选择到货时间");
            return false;
        }
        if(SETUP_TIME!="" && SETUP_TIME!=null && SETUP_TIME!=undefined){
            if (!reg.test(SETUP_TIME)) {
                Alert.error("请选择正确的安装时间(格式: 2008-08-08 20:20:03 或者  2008-08-08)");
                return false;
            }
        }else{
        	Alert.error("请选择安装时间");
            return false;
        }  
        if(ARRIVE_TIME!=""&&SETUP_TIME!=""){
        	if(ARRIVE_TIME>SETUP_TIME){
        		Alert.error("到货时间不能大于安装时间");
                return false;
        	}
        }
        if(OUTOF_TIME!="" && OUTOF_TIME!=null && OUTOF_TIME!=undefined){
        	if (!reg.test(ARRIVE_TIME)) {
       		 Alert.error("请选择正确的过保时间(格式: 2008-08-08 20:20:03 或者  2008-08-08)");
                return false;
           }
        }else{
        	Alert.error("请选择过保时间");
            return false;
        }
        if(START_TIME!="" && START_TIME!=null && START_TIME!=undefined){
        	alert(23);
        	if (!reg.test(START_TIME)) {
       		 Alert.error("请选择正确的启用时间(格式: 2008-08-08 20:20:03 或者  2008-08-08)");
                return false;
           }
        }
        if(ACCEPT_TIME!="" && ACCEPT_TIME!=null && ACCEPT_TIME!=undefined){
        	if (!reg.test(ACCEPT_TIME)) {
       		 Alert.error("请选择正确的验收时间(格式: 2008-08-08 20:20:03 或者  2008-08-08)");
                return false;
           }
        }
        if(LICENSE_TIME!="" && LICENSE_TIME!=null && LICENSE_TIME!=undefined){
        	if (!reg.test(LICENSE_TIME)) {
       		 Alert.error("请选择正确的LICENSE时间(格式: 2008-08-08 20:20:03 或者  2008-08-08)");
                return false;
           }
        }
         return true;
}

//增加按钮保存
function add_save(){
	 var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
	 var phone_re = /^0\d{2,3}-?\d{7,8}$/;
	 var tel= /^1\d{10}$/;
	 var tel_value=$("#SETUP_MAN_TEL").val();
	 var tel_value_ma=$("#MANAGER_TEL").val();	
	 if(tel_value_ma!=""){
		 if(!tel.test(tel_value_ma)&&!phone_re.test(tel_value_ma)){
			 Alert.error("管机员电话号码格式不正确！");
			 return;
		 }
	 }
	 if(tel_value!=""){
		 if(!tel.test(tel_value)&&!phone_re.test(tel_value)){
			 Alert.error("安装人员电话号码格式不正确！");
			 return;
		 }
	 }		 
	 var flag= $("#addDevForm").valid();
	 if(!flag){
		 return;
	 }
	 //检测select是否有值
	 var flag = false;
	 $("#addDevForm #errMsg").html("");
	 $("#addDevForm .select").each(function(){
	 var meg = {"DEVICE_TYPE":"请选择设备类型！",
			 	"DEVICE_MODEL":"请选择设备型号！",
			 	"SETUP_TYPE":"请选择安装类型！",
			 	"EXP_TIME":"请选择质保期！"
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
	 
	var formArray=$('#addDevForm').serializeArray();//查询条件
	var jsonData=Util.formToJson(formArray);
	     jsonData.ID=uuid();	
	     
	if(!checkTimeType()){
		return false;
	}   
	jsonData=checkTime(jsonData);
	Util.addParameter(jsonData,"SERVICE","CommonExecuteService");
	Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
	Util.addParameter(jsonData,"SQLID","insertDev");
	Alert.closeWindow(addDevWindow);
	TranMng.submitServer(jsonData,response_add);
	
}
//判断如果时间为空，则赋值为null
function checkTime(jsonData){
	if(jsonData.ACCPET_TIME==""){
		jsonData.ACCPET_TIME=null;		
	}
	if(jsonData.START_TIME==""){
		jsonData.START_TIME=null;		
	}	
	if(jsonData.LICENSE_TIME==""){
		jsonData.LICENSE_TIME=null;		
	}
	return jsonData;
};

//增加完成响应
function response_add(response){
	if(response.SUCCESS){
		Alert.error("添加设备成功！")
		dev_search();
	}else{
		Alert.error("添加设备失败！");
	}
}


//查询分页回调方法
function responseFunction(response){
	 callback(response);
	 //清空选择行数组
	 aSelected=[];
}
  

function retrieveData( sSource, aoData, fnCallback ) {
	     
		      var formArray=$('#devQueryForm').serializeArray();//查询条件
		      var paramArray=aoData.concat(formArray);//合并查询条件和分页表格所需要的参数
		      var jsonData=Util.formToJson(paramArray);
		      Util.addParameter(jsonData,"SERVICE","CommonQueryService");
		      Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
		      Util.addParameter(jsonData,"SQLID","selectDevPage");
		      Util.addParameter(jsonData,"IS_PAGE",true);
		        callback=fnCallback;
		       TranMng.submitServer(jsonData,responseFunction);
		      
	   }


		//"查询"按钮的处理
function dev_search() {			
			if (oTable == null) { //仅第一次检索时初始化Datatable
				$("#devInfo").show();
				oTable = $('#devInfo').dataTable( {
					//"bAutoWidth": true,
					//"sScrollX" : "1000px",
					"oLanguage": {"sUrl":"theme/page_cn.txt"},					
					"aoColumns": [
						  			
						  			{ "mData": "DEVICE_ID","sDefaultContent": ""},
						  			{ "mData": "ORG_NAME","sDefaultContent": "" },
									{ "mData": "MANAGER_NAME","sDefaultContent": "" },
									{ "mData": "MANAGER_TEL","sDefaultContent": "" },					  				
									{ "mData": "SETUP_MAN","sDefaultContent": "" },
									{ "mData": "SETUP_MAN_TEL","sDefaultContent": "" },
									{ "mData": "START_TIME","sDefaultContent": "" },
									{ "mData": "EXP_TIME","sDefaultContent": "" }
																
									//{ "mData": "DATE_FORMAT(START_TIME,'%Y-%m-%d %H:%i:%s')","sDefaultContent": "" }
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

function selectTree_add(response){
	console.info(response);
	var dataList=response.DATA;
   
	var newDataList=[];
     
     for(var o in dataList){ 
  	   var rowMap={};
  	    rowMap["id"]=dataList[o].ID;
  	    rowMap["id_all"]=dataList[o].ID;
  	    rowMap["pId"]=dataList[o].PID;
  	    rowMap["name_all"]=dataList[o].NAME;
  	    rowMap["name"]=dataList[o].NAME;
  	    if(rowMap["pId"]!=""){
  	    	for(var s in dataList){
  	    		if(dataList[s].ID==rowMap["pId"]){
  	    			rowMap["name_all"]+=","+dataList[s].NAME;
  	    			rowMap["id_all"]+=","+dataList[s].ID;
  	    			for(var b in dataList){
  	    				if(dataList[b].ID==dataList[s].PID){
  	    					rowMap["name_all"]+=","+dataList[b].NAME;
  	    					rowMap["id_all"]+=","+dataList[b].ID;
  	    					for(var c in dataList){
  	    						if(dataList[c].ID==dataList[b].PID){
  	    							rowMap["name_all"]+=","+dataList[c].NAME;
  	    							rowMap["id_all"]+=","+dataList[c].ID;
  	    						}
  	    					}
  	    				}
  	    			}
  	    		}
  	    	}
  	    }
  	    var ss=rowMap["name_all"].split(",");
  	    ss.reverse();
  	    var str="";
  	    for(var i=0;i<ss.length;i++){
  	    	str+=ss[i]+"-";
  	    }
  	    var cusnames=rowMap["id_all"].split(",");
  	    cusnames.reverse();
  	    var cus=""
  	    for(var i=0;i<cusnames.length;i++){
  	    	cus+=cusnames[i]+",";
	    }
  	    rowMap["id_all"]=cus.substr(0,rowMap["id_all"].length);
  	    rowMap["name_all"]=str.substr(0,rowMap["name_all"].length);
  	    console.info(rowMap);
 	    
  	    newDataList.push(rowMap);
     }  

     if(newDataList.length==0){
    	 Alert.error("对不起，请您先添加网点信息！");
    	 $(".dd").show();
    	 $("#menuContent").hide();
    	 $(".modal-footer").show();
    	 
     }else{
    	 $(".dd").hide();
    	 $("#menuContent").show();
    	 $("#menuContent_edit").show();
    	 $(".modal-footer").hide();
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
			onCheck:onCheck
      }
	};

	

	$(document).ready(function(){
		setting.check.chkboxType = { "Y" : "ps", "N" : "ps" };
		$.fn.zTree.init($("#treeDemo"), setting, newDataList);
		$.fn.zTree.init($("#treeDemo_edit"), setting, newDataList);
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
	$("#SETUP_BRANCH_NAME").attr("value",treeNode.name_all);	
	$("#SETUP_BRANCH_ID_PRESENT").attr("value",treeNode.id_all);
	$("#SETUP_BRANCH_NAME").nextAll(".error").remove();
	console.info("+++++"+treeNode.id_all);
	$("#BRACH_TREE_EDIT_ID").attr("value",treeNode.id);
	$("#SETUP_BRANCH_ID").attr("value",treeNode.name_all);
	$("#BRACH_TREE_EDIT").attr("value",treeNode.id_all);
	$(".dd").show();
	$("#menuContent").hide();
	$(".modal-footer").show();
	$("#menuContent_edit").hide();
}


function show_BRATree( treeId, treeNode, clickFlag){
	$("body").bind("mousedown", onBodyDown);
	var jsonData={};
	Util.addParameter(jsonData,"SERVICE","CommonQueryService");
	Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
	Util.addParameter(jsonData,"SQLID","selectBranchTree");
	TranMng.submitServer(jsonData,selectTree_add);
}



function hideMenu() {
	
	$("#menuContent").fadeOut("fast");
	$("#menuContent_edit").fadeOut("fast");
	$(".dd").show();
	$(".modal-footer").show();
	$("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
		
	if (!(event.target.id == "showBRATree" || event.target.id == "menuContent" ||event.target.id == "menuContent_edit"  || $(event.target).parents("#menuContent").length>0 || $(event.target).parents("#menuContent_edit").length>0)) {
		hideMenu();
	}
}
	
})();

