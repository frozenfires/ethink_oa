//@ sourceURL=F0111qw.js
(function () {

    var flowid = "";
    var oTable = null;
    var historyoTable = null;
    var searchworkModal = $('#searchworkModal');
    var transferData = $("#mainContent").data("_userData");
    if(transferData == 'RET'){//页面返回
    	 Search_WorksInfo();
    }   

    function checkTimeType(){
    	var setup_time = $("#appStart_time").val();
    	var reg = /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))(\s(([01]\d{1})|(2[0123])):([0-5]\d):([0-5]\d))?$/;

    	if(setup_time!=""){
    		 if (!reg.test(setup_time)) {
    			 Alert.error("请输入正确的申请时间（格式: 2008-08-08）");
    	         return false;
    	    }
    		
    	}
    	return true;
    }		
    function init (argument) {
    	
    TranMng.loadOptions('EXP_TIME', 'selectExp_time');}
    TranMng.loadOptions('WORK_DEPARTMENT', 'selectAddress');
    TranMng.loadOptions('WORK_STATUS', 'selectworks_status');
    TranMng.loadOptions('WORK_TYPE', 'selectworks_type');
   
  //  $("#WORK_TYPE").append("<option value=''>11111</option>"); 

    TranMng.loadOptions('WORK_INSTALL_DEVTYPE', 'selectDecice_type');
    TranMng.loadOptions('DEVICE_MODEL', 'selectDecice_model');
    $("input#appStart_time").on("mouseover",function(e){	
		$("input#appStart_time").calendar({
			format : 'yyyy-MM-dd HH:mm',
			onSetDate : function (){
				//$("#addDevForm").valid();
				var parent_ID=$(e.target).parent().parent().parent().attr('id');
				//compare_Time("OUTOF_TIME","START_TIME","启用时间","过保时间",parent_ID);	
			}
		});
	
	});
 
    $("input#append_time").on("mouseover",function(e){	
		$("input#append_time").calendar({
			format : 'yyyy-MM-dd HH:mm',
			onSetDate : function (){
				//$("#addDevForm").valid();
				var parent_ID=$(e.target).parent().parent().parent().attr('id');
				//compare_Time("OUTOF_TIME","START_TIME","启用时间","过保时间",parent_ID);	
			}
		
	
			
		
		});
		
		
	});
    $("#Search").click(function () {
    	
        Search_WorksInfo();
    });
    $("#HIghSearch").click(function () {

    	highsearch();
    });
    $("#highSearch_save").click(function () {

    	highSearch_WorksInfo();
    });
    $(".queryhide").hide();

    $("#pull_down").click(function(){
        var style = $(".queryhide").css("display");

        if('none'== style){
            $("#pull_down").css("background-image",'url("../oa/appwork/upfile/pullup.PNG")');
            $(".queryhide").show();
        }else{
            $(".queryhide").hide();
            $("#pull_down").css("background-image",'url("../oa/appwork/upfile/pulldown.PNG")');
        }
    });
    /**
     * 回填datatable中的数据
     */
    function retrieveData(sSource, aoData, fnCallback) {
    	var formArray = $('#orgQueryForm').serializeArray(); //查询条件
		var paramArray = aoData.concat(formArray); //合并查询条件和分页表格所需要的参数
		var jsonData = Util.formToJson(paramArray);
		console.info("---------------");
		console.info(jsonData);
		Util.addParameter(jsonData, "SERVICE", "CommonQueryService");
		Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
		Util.addParameter(jsonData, "SQLID", "selectAllWork");
		Util.addParameter(jsonData, "IS_PAGE", true);
		callback = fnCallback;
		TranMng.submitServer(jsonData, responseFunction);

    }

 
//查询
    function Search_WorksInfo() {
    	if(!checkTimeType()){
			return false;
		}
        if (oTable == null) { //仅第一次检索时初始化Datatable
            $("#queryResult").show();
            oTable = $('#queryResult').dataTable({
                "oLanguage": {"sUrl": "theme/page_cn.txt"},
                "aoColumnDefs" : [
                	{"aTargets" : [1],
						"mRender" : function(data, type, row) {
							switch (row.WORK_TYPE) {
                            case '1':
                                return "勘察";
                                break;
                            case '2':
                                return "安装";
                                break;
                            case '3':
                                return "验收";
                                break;
                            case '4':
                                return "培训";
                                break;
                            case '5':
                                return "维修";
                                break;
                            case '6':
                                return "巡检";
                                break;
                            case '7':
                                return "移机";
                                break;
                            case '8':
                                return "撤机";
                                break;
                               default:
                                return "一般"
                                break;
                        }
						}},
						{"aTargets" : [ 2],
							"mRender" : function(data, type, row) {
								switch (row.WORK_URGENT) {
	                            case '1':
	                                return "紧急";
	                                break;
	                            case '2':
	                                return "重大";
	                                break;
	                            case '3':
	                                return "一般";
	                                break;
	                               default:
	                                return "一般"
	                                break;
	                        }
							}},
							{"aTargets" : [3],
								"mRender" : function(data, type, row) {
									
									switch (row.WORK_STATUS) {
		                            case '1':
		                                return "新建";
		                                break;
		                            case '2':
		                                return "待审批";
		                                break;
		                            case '3':
		                                return "审批驳回";
		                                break;
		                            case '4':
		                                return "审批否决";
		                                break;
		                            case '5':
		                                return "审批挂起";
		                                break;
		                            case '6':
		                                return "审批派单待处理";
		                                break;
		                            case '7':
		                                return "处理中";
		                                break;
		                            case '8':
		                                return "处理完成待审验";
		                                break;
		                            case '9':
		                                return "审验驳回";
		                                break;
		                            case '10':
		                                return "审验完成";
		                                break;
		                               default:
		                                return "未知"
		                                break;
		                        }
								}},
					{"aTargets" : [ 9],
						"mRender" : function(data, type, row) {
						
						var  formattime=row.WORK_APPTIME;
						var d = new Date(formattime);
						formattime=d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()+"/"+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
					
						return formattime;
						
						}},
						
						{
							"aTargets" : [ 10],
							  "mRender": function (data, type, row) {
		                           
		                                    return "<a class='_msearch' "+"id='"+row.ID+"'>查看</a>";
							
							}
						} 
					],
                "aoColumns": [

                    { "mData": "ID","sDefaultContent": "" },
                    { "mData": "WORK_TYPE","sDefaultContent": "" },
                    { "mData": "WORK_URGENTNAME","sDefaultContent": "" },
                    { "mData": "WORK_STATUS","sDefaultContent": "" },
                    { "mData": "DEVICE_NO","sDefaultContent": "" },
                    { "mData": "DEVICE_NAME","sDefaultContent": "" },
                    { "mData": "DEVICE_MODEL_NAME","sDefaultContent": "" },
                    { "mData": "DEVICE_TYPE_NAME","sDefaultContent": "" },
                    { "mData": "ORG_NAME","sDefaultContent": "" },
                    { "mData": "WORK_APPTIME","sDefaultContent": "" },
                    { "mData": "Work_Detail","sDefaultContent": "" }

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

        } else {
            oTable.fnClearTable(0);
            oTable.fnDraw();
        }
    }
   
    

	$("#temptable").on("click","._msearch",function () {
		var seletedtr = $(this).parents('tr');
		var selectData = oTable.fnGetData( seletedtr[0] );
		selectData.operate = $(this).text();
		console.info(selectData);
		
		 var url = "../../oa/queryAllWork/queryAlldetailworks.html";
	        _View.tranLinkOpen(url, selectData);
	
	});
 
   


function responseFunction(response) {
	//console.info(response+":jsonData");
	callback(response);
	//清空选择行数组
	aSelected = [];
}



$("#queryResult").on("click", "tbody tr", function(){

	var selectData = oTable.fnGetData(this);
	WorkHistory.searchHistory(selectData, "../../oa/queryAllWork/queryAllworks.html");
});


})();