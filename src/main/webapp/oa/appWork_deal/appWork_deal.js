//@ sourceURL=F008.js
(function(){
	var options={    
		    rules:{		    	
		    },
		    messages:{		    	
		    }
		  };

	//定义表格
	var oTable = null;
	//选择行的数据
	//var aSelected = [];
	//查询回调方法
	var callback;
	$(".serch").hide();
	TranMng.loadOptions('Q_WORK_TYPE', 'selectworks_type');
//	TranMng.loadOptions('Q_WORK_STATUS', 'selectworks_status');
	TranMng.loadOptions('Q_DEVICE_TYPE', 'selectDecice_type');
	TranMng.loadOptions('Q_DEVICE_MODEL', 'selectDecice_model');
	TranMng.loadOptions('Q_WORK_DEPARTMENT', 'selectAddress');	
	TranMng.loadOptions('Q_WORK_ASSIGN_DEPARTMENT', 'selectAddress');	
	TranMng.loadOptions('Q_WORK_VERIFY_DEPARTMENT', 'selectAddress');
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

    var transferData = $("#mainContent").data("_userData");
   
function init (argument) {
	
	$('#deal').click(function(){
			operate();
	   });
	$('#deal_in').click(function(){
			deal_in();
	})	
	$('#conditionSearch').click(function(){ 	      
   	  		workapp_search();
	})
	workapp_search();	
	$('#cancel').click(cancel);
	$('#temptable').on('click', '._deal',operate_detail);
	$('#temptable').on('click', '._look',operate_look);	
	$("#queryResult").on("click", "tbody tr", function(){
		var selectData = oTable.fnGetData(this);
		WorkHistory.searchHistory(selectData);
	});
	
	TranMng.loadOptions('Q_WORK_STATUS', 'selectworks_status', '', '', function(){
		$("#Q_WORK_STATUS ul").append("<li><a href='javascript:void(0);' value='6,7'>待处理+处理中</a></li>");
		$("#Q_WORK_STATUS").selectValue("6,7");
		workapp_search();
	});	
	
	$("input#Q_WORK_APPTIME_BEGIN").on("mouseover",function(e){	
		$(this).calendar({
			format : 'yyyy-MM-dd',		
			onSetDate : function (){				
			}
		});
	});  
	$("input#Q_WORK_APPTIME_END").on("mouseover",function(e){	
		$(this).calendar({
			format : 'yyyy-MM-dd',		
			onSetDate : function (){				
			}
		});
	});  
};

init();

function cancel(){
	View.hub();
}


//查询分页回调方法
function responseFunction(response){
	 callback(response);
	 //清空选择行数组
	 aSelected=[];
}
//处理工单 
function operate_detail(){	
	var seletedtr = $(this).parents('tr');
	var selectData = oTable.fnGetData( seletedtr[0] );
	selectData.operate = $(this).text();
	console.info(selectData);
	var appWork_message = '../../oa/appWork_deal/deal_message.html';
    _View.tranLinkOpen(appWork_message, selectData,'',function(){
    	workapp_search();
    	$("#queryHistoryResult tbody").empty();
    });
}
//查看工单
function operate_look(){	
	var seletedtr = $(this).parents('tr');
	var selectData = oTable.fnGetData( seletedtr[0] );
	selectData.operate = $(this).text();
	console.info(selectData);
	var appWork_look = '../../oa/appWork_deal/lookworks_message.html';
    _View.tranLinkOpen(appWork_look, selectData);
}



function retrieveData( sSource, aoData, fnCallback ) {	     

	 console.debug("*******************retrieveData*****************");
		      var formArray=$('#myworksconditionsearch').serializeArray();//查询条件
		      var paramArray=aoData.concat(formArray);//合并查询条件和分页表格所需要的参数
		      var jsonData=Util.formToJson(paramArray);
		      console.debug("*******************WorkOrderService*****************");
		      Util.addParameter(jsonData,"SERVICE","WorkOrderService");
		      Util.addParameter(jsonData,"Q_BusinessType","execute");
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
function workapp_search() {
	if(!checkTimeType()){
		return false;
	};
    if (oTable == null) { //仅第一次检索时初始化Datatable
        $("#queryResult").show();
        oTable = $('#queryResult').dataTable({
            "oLanguage": {"sUrl": "theme/page_cn.txt"},
            "aoColumns": [
                {"mData": "WORK_ID", "sDefaultContent": ""},
                {"mData": "WORK_TYPE_NAME", "sDefaultContent": ""},
                {"mData": "WORK_URGENT_NAME", "sDefaultContent": ""},
                {"mData": "WORK_STATUS_DESC", "sDefaultContent": ""},
                {"mData": "DEVICE_NO", "sDefaultContent": ""},
                {"mData": "DEVICE_NAME", "sDefaultContent": ""},
                {"mData": "DEVICE_MODEL_NAME", "sDefaultContent": ""},
                {"mData": "DEVICE_TYPE_NAME", "sDefaultContent": ""},
                {"mData": "CUS_ORG_NAME", "sDefaultContent": ""},
                {"mData": "WORK_APPTIME", "sDefaultContent": ""},
                {"mData": "", "sDefaultContent": ''}
            ],
            "aoColumnDefs": [
                {
                    "mRender": function (data, type, row) {
                        switch (row.WORK_STATUS) {                       
							case "6":
							case "7":
							case "9":							
								return	"<a class='_deal' id=''>处理</a>";
							default:
								return  "<a class='_look' id=''>查看</a>";
							};
                        ;
                    }, "aTargets": [10]
                }],
            "bProcessing": true,					//加载数据时显示正在加载信息
            "bServerSide": true,					//指定从服务器端获取数据
            "bFilter": false,						//不使用过滤功能
            "bLengthChange": false,					//用户不可改变每页显示数量
            "iDisplayLength": 5,					//每页显示8条数据
            "sAjaxSource": "normal.do?method=doAction",  //获取数据的url
            "fnServerData": retrieveData,			//获取数据的处理函数
            "sPaginationType": "full_numbers"	    //翻页界面类型

        });

    } else {
    	oTable.fnClearTable( 0 );
		oTable.fnDraw();
    }
}

//js校验时间格式
function checkTimeType() {
		var dateBegin = $("#Q_WORK_APPTIME_BEGIN").val();
		var dateEnd = $("#Q_WORK_APPTIME_END").val();
        var reg = /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))(\s(([01]\d{1})|(2[0123])):([0-5]\d):([0-5]\d))?$/;

        if(dateBegin!=""){
        	 if (!reg.test(dateBegin)) {
        		 Alert.error("请输入正确的开始时间（格式: 2008-08-08 20:20:03 或者  2008-08-08）");
                 return false;
            }
        }
        if(dateEnd!=""){
            if (!reg.test(dateEnd)) {
                Alert.error("请输入正确的结束时间（格式: 2008-08-08 20:20:03 或者  2008-08-08）");
                return false;
            }
        }
       
        if(dateBegin!=""&&dateEnd!=""){
        	if(dateBegin>dateEnd){
        		Alert.error("开始时间不能大于结束时间");
                return false;
        	}
        }
         return true;
}

})();

