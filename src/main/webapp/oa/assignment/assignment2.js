//@ sourceURL=assignment2.js
(function(){
	//定义表格
	var oTable = null;
	//查询回调方法
	var callback;
	//是否根据更新日期排序
	var isOrderTime=false;
	//分派操作模态窗口
	var selectDelWorkerModal = $('#selectDelWorkerModal');
	//其他操作模态窗口
	var commModal = $('#commModal');
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
	//操作类型
	var operation=null;
	
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
	
function init (argument) {
	 console.info("******assignment2.js******");
	 workData = $("#linkContent").data("_userData");
	 console.info(workData);
	 switch (workData.WORK_STATUS){
	    case WORK_NEW_BUILD:
		case WORK_WAIT_ASSIGNMENT:
			$("#WORK_LASTDEAL_NAME").parent("div").hide();
			$("#REBUT,#SUSPEND,#VETO,#DISPATCH").show();
		break;
		case WORK_WAIT_DEAL:
		case WORK_IN_DEAL:
			$("#DISPATCH").show();
		break;
		case WORK_ASSIGNMENT_SUSPEND:
			$("#WORK_LASTDEAL_NAME").parent("div").hide();
			$("#REBUT,#VETO,#DISPATCH").show();
		break;	
	 }
	 selectDelWorkerInfo();
	 workAccessory(workData.WORK_ID, workData.WORK_ID);
	 $(".show input,.show textarea").attr("readonly","readonly");
	 $(".show input,.show textarea").each(function(){
		 var id = this.id;
		 if(id!="" && id!= undefined && id!= null && workData.hasOwnProperty(id)){
			 $(this).val(workData[id]);
		 }
	 });	
	 switch (workData.WORK_TYPE){
	    case WORK_SURVEY: 
	    break;
	    case WORK_INSTALL:
	    	$("#businessInfo").show();
	    	$("#INSTALL_DEVICE_MODEL_NAME,#INSTALL_DEVICE_TYPE_NAME").parent("div").show();
		break;
	    case WORK_ACCEPT:
	    	$("#deviceInfo,#businessInfo").show();
	    	$("#WORK_ACCEPT_TIME,#WORK_ACCEPT_TYPE").parent("div").show();
		break;
	    case WORK_TRAIN:
	    	$("#businessInfo,#WORK_TRAIN_TIME").show();
	    	$("#WORK_TRAIN_INFO").parent("div").show();
		break;
		case WORK_REPAIR:
			$("#deviceInfo,#businessInfo").show();
			$("#WORK_REPAIR_TIME,#FAULT_TYPE_DESC,#WORK_REPAIR_DESCRIBE").parent("div").show();
	    break;
		case WORK_EXAMIN:
			$("#deviceInfo,#businessInfo").show();
			$("#WORK_PARTOL_TYPE").parent("div").show();
	    break;
		case WORK_MOVE:
			$("#deviceInfo").show();
		break;
		case WORK_RECALL:
			$("#deviceInfo").show();
		break;
	 }
     $('#REBUT,#SUSPEND,#VETO').click(function(){
    	 operation = this.id;
    	 var prompt = {"REBUT":"驳回","SUSPEND":"挂起","VETO":"否决"};
    	 $("#commModal #prompt").text("您确定对当前工单做【" + prompt[operation] + "】操作？");
    	 Alert.popWindow(commModal);
     });
     $("#commModal #window_confirm").click(function(){
    	 Alert.closeWindow(commModal);
    	 operate(operation);
     });
     $("#commModal #window_concel").click(function(){
    	 Alert.closeWindow(commModal);
     });
     
     $('#DISPATCH').click(function(){
    	 Alert.popWindow(selectDelWorkerModal);
     });
     $("#selectDelWorkerModal #window_confirm").click(function(){
    	 Alert.closeWindow(selectDelWorkerModal);
    	 operate("DISPATCH");
     });
     $("#selectDelWorkerModal #window_concel").click(function(){
    	 Alert.closeWindow(selectDelWorkerModal);
     });
     $("#RET").click(function(){
    	 _View.tranLinkReturn();
     });
     $(".alert_closewindow").click(function () {
         Alert.closeWindow($(this).parents(".modal"));
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
  Util.addParameter(jsonData,"AREA", workData.CUS_AREA_ID);
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
				  			{ "mData": "ADDRESS_NAME","sDefaultContent": "" },
				  			{ "mData": "DEALWORKNUM","sDefaultContent": "" },
				  			{ "mData": "MOBILEPHONE","sDefaultContent": "" },
				  			{ "sDefaultContent": "" }
				  		],
	  		"aoColumnDefs":[
				{"mRender" : function(data, type, row) {
					switch (row.FREEZE_USER) {
					case 'Y':
						return "冻结";
					default:
						return "正常";
					};
				}, "aTargets": [5]}],
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
	var remark = null;
	
	if (operation == "DISPATCH"){
    	var seletedtr = $('#selectDelWorkerResult tr.row_selected');
    	var selectData = oTable.fnGetData(seletedtr[0]);
    	selectWorker = selectData.USER_ID;
    	remark = $("#selectDelWorkerModal textarea").val();
	}else{
		remark = $("#commModal textarea").val();
	}
	
	Util.addParameter(jsonData,"SERVICE","WorkAssignmentService");
	Util.addParameter(jsonData,"WORK_ID",workData.ID);
    Util.addParameter(jsonData,"TASKID",workData.WORK_FLOW_ID);
    Util.addParameter(jsonData,"OPERATION",operation);
    Util.addParameter(jsonData,"PROPOSER",workData.PROPOSER_ID);
    Util.addParameter(jsonData,"WORKSTATUS",workData.WORK_STATUS);
    Util.addParameter(jsonData,"WORKER",selectWorker);
    Util.addParameter(jsonData,"REMARK",remark);
 
    TranMng.submitServer(jsonData,function(response){
    	if(response.SUCCESS){
    		Alert.error("审批成功！");
    	}else{
    		Alert.error("审批失败！");
    	}
    	_View.tranLinkReturn();
    });
    console.info(jsonData);
}

//*************************附件相关*****************************
var filecount = 0;
var imagecount = 0;
var count = 0;
var _i = 0;
var downid = null;
var dataArray = null;

function workAccessory(WORKDEAL_ID, WORK_ID) {

    var jsonData = {}

    Util.addParameter(jsonData, "SERVICE", "CommonQueryService");
    Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
    Util.addParameter(jsonData, "SQLID", "QueryAccessoryInfo");
    Util.addParameter(jsonData, "COMM_ID_P", WORKDEAL_ID);

    TranMng.submitServer(jsonData, function(response){
    	
        var data = response.DATA;
       
        if (0 != response.DATA.length) {
        	$(".enclosure").show();
            for (var i in data) {

                var path = data[i].ACCESSORY_LOC;
                var name = data[i].ACCESSORY_NAME;
                var abspath_p = data[i].abspath;
                var time = data[i].UPLOAD_TIME;
                var size = data[i].ACCESSORY_SIZE;
                if(undefined == name || '' == name){
                    name = '未知';
                }
                if(undefined == time || '' == time){
                    time = '未知';
                }

                if(undefined == size || '' == size){
                    size = '未知';
                }
                
                if (("/image/" + WORK_ID) == path) {
                    imagecount++;
                    downid = appendimg(path, name, count, abspath_p);
                } else {
                    filecount++;
                    downid = appendfile(path, name, count, abspath_p, time,size);
                }
                count++;

            }

        }
    	
    });
}

function appendimg(path, name, _id, abspath_p) {
    if (imagecount == 1) {
        $("#imageInfo").show();
    }

    var abs_path = "/etoa/download.do?reportName=" + name + "&path=" + path;
    var _imgdiv_id = "imgdiv_" + _id;
    var _imgdelete_id = "dowbload_" + _id;
    if (name.length > 11) {
        name = name.substring(0, 8) + "...";
    }
    var appendstr = '<div id= "' + _id + '" class="image_div" style=" position:relative;width: 130px;height: 130px;margin-left:20px;">\n' +
        '                        <div id="' + _imgdiv_id + '"class="imageid" style="position:absolute;width:100px;height:100px;left: 0px;top:0px;margin: 0 0;border: 1px solid #666;cursor:pointer;">\n' +
        '                            <img id="img_abspath" style="width: 100%;height: 100%;" src="' + abs_path + '">\n' +
        '                        </div>\n' +
        '                        <div class="downdivid" style="position:absolute;width:30px;height:100px;left: 102px;margin: 0 0;">\n' +
        '\n' +
        '                            <input style="display:none" id=loc' + _i + ' name=loc' + _i + ' value=' + abspath_p + '>\n' +
        '\n' +
        '                        </div>\n' +
        '                        <div style="text-align:center;position:absolute;width:100px;height:30px;top:102px;margin:0 0;">\n' +
        name +
        '                        </div>\n' +
        '                    </div>';


    $("#_showimg").prepend(appendstr);


    //查看
    $("#" + _imgdiv_id).on('click', function () {
        var src = $(this).find("img").attr("src");

        Alert.popWindow($("#imgshowInfo"));
        $("#bigimgshow").attr("src", src);

    });
}


function appendfile(path, name, _id, abspath_p, time,size) {

    if (filecount == 1) {
        $("#fileInfo").show();
    }

    var _filedelete_id = "dowbload_" + _id;
    var filename_id = "filename_" + _id;
    var uploaddate = time;
    var filesize = size;
    var _filedown_id = "dowload_" + _id;
    var filetype = name.split(".")[1];
    var showimgpath = "";
    switch (filetype) {

        case "docx":
        case "doc":
        case "wps":
            showimgpath = "../oa/appwork/upfile/word.jpg";
            break;
        case "log":
        case "txt":
            showimgpath = "../oa/appwork/upfile/txt.jpg";
            break;
        case "et":
        case "xls":
        case "xlsx":
            showimgpath = "../oa/appwork/upfile/exc.jpg";
            break;
        case "ppt":
        case "pptx":
            showimgpath = "../oa/appwork/upfile/ppt.jpg";
            break;
        case "zip":
        case "rar":
            showimgpath = "../oa/appwork/upfile/rar.jpg";
            break;
        default:
            showimgpath = ""

    }
    var _name = name;
    if (name.length > 11) {
        _name = name.substring(0, 8) + "...";
    }

    var appendfile = '<div id="' + _id + '" class="" style=" position:relative;width: 300px;height: 130px;margin-left:20px;">\n' +
        '                        <div class="" style="position:absolute;width:100px;height:100px;left: 0px;top:0px;margin: 0 0; border: 1px solid #666;">\n' +
        '                            <img style="width: 100px;height: 100px;" src=" ' + showimgpath + '">\n' +
        '                        </div>\n' +
        '                        <div style="position:absolute;width:200px;height:130px;left: 100px;top: -10px;margin: 0 0;">\n' +
        '                            <div >\n' +
        '                                文件名称:<span id="' + filename_id + '">' + _name + '</span>\n' +
        '                            </div>\n' +
        '                            <div>\n' +
        '                                上传时间:<span id="">' + uploaddate + '</span>\n' +
        '                            </div>\n' +
        '                            <div>\n' +
        '                                文件大小:<span id="">' + filesize + '</span>\n' +
        '                            </div>\n' +
        '                            <div>\n' +
        '                                <a id= "'+_filedown_id+'" href="/etoa/download.do?reportName='+name+'&path='+ path+'" style="color: #e9322d">下载</a>' +
        '                            </div>\n' +
        '                            <input style="display:none" id=loc' + _i + ' name=loc' + _i + ' value=' + abspath_p + '>\n' +
        '                        </div>\n' +
        '                    </div>';

    $("#_showfile").prepend(appendfile);
}

})();