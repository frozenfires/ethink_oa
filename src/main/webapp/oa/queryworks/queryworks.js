//@ sourceURL=queryworks.js
(function () {

    var oTable = null;
    
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
	
	//工单类型
	const WORK_SURVEY = "1";
	const WORK_INSTALL = "2";
	const WORK_ACCEPT = "3";
	const WORK_TRAIN = "4";
	const WORK_REPAIR = "5";
	const WORK_EXAMIN = "6";
	const WORK_MOVE = "7";
	const WORK_RECALL = "8";
	
    /**
     * 加载下拉列表
     */
	
	
	
    TranMng.loadOptions('Q_WORK_TYPE', 'selectworks_type');
    TranMng.loadOptions('Q_WORK_STATUS', 'selectworks_status', '', '', function(){
    	$("#Q_WORK_STATUS").selectValue(WORK_ASSIGNMENT_REJECT);
		Search_WorksInfo();
	});
    TranMng.loadOptions('Q_DEVICE_TYPE', 'selectDecice_type');
    TranMng.loadOptions('Q_DEVICE_MODEL', 'selectDecice_model');

    $("#conditionSearch").click(function () {
        Search_WorksInfo();
    });

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

    /**
     * 回填datatable中的数据
     */
    function retrieveData(sSource, aoData, fnCallback) {
        var formArray = $('#myworksconditionsearch').serializeArray();//查询条件
        //var formArray = {};//查询条件
        var paramArray = aoData.concat(formArray);//合并查询条件和分页表格所需要的参数
        var jsonData = Util.formToJson(paramArray);
        
        Util.addParameter(jsonData, "SERVICE", "WorkOrderService");
        Util.addParameter(jsonData, "Q_BusinessType", "apply");
    
        TranMng.submitServer(jsonData, function (response) {
            console.info("查询返回数据开始");
            console.info(response);
            console.info("查询返回数据结束");
            fnCallback(response);
        });
    }


//查询
    function Search_WorksInfo() {
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
                                case WORK_ASSIGNMENT_REJECT:
                                    return "<a class='_modify' id='" + row.WORK_ID + "'>修改</a>";

                                    break;

                                default:
                                    return "<a class='_look' id='" + row.WORK_ID + "'>查看</a>";
                                    //return "<a class='_modify' id='" + row.WORK_ID + "'>修改</a>";
                                    break;
                            }
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
            oTable.fnClearTable(0);
            oTable.fnDraw();
        }
    }


    $("#build").click(function () {
        _View.tranLinkOpen("../../oa/appwork/appwork.html", '', '', function(){
  			$("#queryHistoryResult tbody").empty();
  			Search_WorksInfo();
  	   });
    });


    $('#temptable').on('click', '._modify', function () {

        var _this_id = $(this).attr("id");

        var url = "../../oa/Modifyworks/modifyworks.html";
        _View.tranLinkOpen(url, _this_id, '', function(){
  			  $("#queryHistoryResult tbody").empty();
  			  Search_WorksInfo();
  	   });
    });
    
//    $('#temptable').on('click', '._look', function () {
//
//        var _this_id = $(this).attr("id");
//        var url = "../../oa/Lookworks/lookworks.html";
//        _View.tranLinkOpen(url, _this_id);
//
//    });
    
	  $('#temptable').on('click', '._look', function () {
		  var seletedtr = $(this).parents("tr");
  		  var selectData = oTable.fnGetData( seletedtr[0] );
  		  _View.tranLinkOpen("../../oa/Lookworks/lookworks.html", selectData, '', function(){
  			  $("#queryHistoryResult tbody").empty();
  			  Search_WorksInfo();
  		  });
	  });

    //历史工单记录查询
    /****************************************************************/
    $('#temptable').on('click', 'tr', function () {
        var _workid = $(this).find("td").eq(0).text();
        //alert(_workid);
        var selectData = oTable.fnGetData(this);
        //alert(JSON.stringify(selectData));
        WorkHistory.searchHistory(selectData);
    });

    /****************************************************************/
    $("input#Q_WORK_APPTIME_BEGIN").on("mouseover", function (e) {
        $("input#Q_WORK_APPTIME_BEGIN").calendar({
            format: 'yyyy-MM-dd HH:mm',
            onSetDate: function () {
                var end_time = $("#Q_WORK_APPTIME_END").val().replace(/-/g, "/");
                var _endtime = new Date(end_time);
                var starttime = $("#Q_WORK_APPTIME_BEGIN").val().replace(/-/g, "/");
                var _starttime = new Date(starttime);
                var currettime = GetCurrentTime().replace(/-/g, "/");
                currettime = new Date(currettime);
                if (_endtime < _starttime) {
                    Alert.info("对不起，提出起始时间不能晚于结束时间！");
                    $("#Q_WORK_APPTIME_BEGIN").val("");
                }

                if (_starttime > currettime) {
                    Alert.info("对不起，提出起始时间不能晚于当前时间！");
                    $("#Q_WORK_APPTIME_BEGIN").val("");
                }


            }
        });
    });
    $("input#Q_WORK_APPTIME_END").on("mouseover", function (e) {
        $("input#Q_WORK_APPTIME_END").calendar({
            format: 'yyyy-MM-dd HH:mm',
            onSetDate: function () {
                var start_time = $("#Q_WORK_APPTIME_BEGIN").val().replace(/-/g, "/");
                var _starttime = new Date(start_time);
                var endtime = $("#Q_WORK_APPTIME_END").val().replace(/-/g, "/");
                var _endtime = new Date(endtime);
                var currettime = GetCurrentTime().replace(/-/g, "/");
                currettime = new Date(currettime);
                if (_starttime > _endtime) {
                    Alert.info("对不起，提出起始时间不能早于结束时间！");
                    $("#Q_WORK_APPTIME_END").val("");

                }

                if (_endtime > currettime) {
                    Alert.info("对不起，提出结束时间不能晚于当前时间！");
                    $("#Q_WORK_APPTIME_END").val("");
                }

            }
        });
    });


    function GetCurrentTime() {
        var date = new Date();
        var year = date.getFullYear();//得到当前年份
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

        var dateString = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + seconds;
        return dateString;

    }


})();