//@ sourceURL=workHistory.js
var WorkHistory = window.WorkHistory || (function () {
    var that = {};
    
	//工单类型
	const WORK_SURVEY = "1";
	const WORK_INSTALL = "2";
	const WORK_ACCEPT = "3";
	const WORK_TRAIN = "4";
	const WORK_REPAIR = "5";
	const WORK_EXAMIN = "6";
	const WORK_MOVE = "7";
	const WORK_RECALL = "8";
	
    //所有用户数据
    var allUserInfo = null;
    var filecount = 0;
    var imagecount = 0;
    var count = 0;
    var _i = 0;
    var downid = null;
    var dataArray = null;
  
    (function() {
        console.info("***********searchAllUserInfo()***********");
        var jsonData = {};
        Util.addParameter(jsonData, "SERVICE", "CommonQueryService");
        Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
        Util.addParameter(jsonData, "SQLID", "selectAllUserInfo");
        TranMng.submitServer(jsonData, function (response) {
            console.info(response);
            if (!response.SUCCESS) {
                return false;
            }

            var userDataObj = {};
            for (var index in response.DATA) {
                var rowData = response.DATA[index];
                userDataObj[rowData.USER_ID] = rowData;
            }

            allUserInfo = userDataObj;
        });
    })();

    function workDealInfo(index){
        console.info("***********workDealInfo()***********");
        
        var workSelected = dataArray[index];
		console.info(workSelected);
		
		if (!workSelected){
			console.error("workSelected--->无值");
			return false;
		}
		
		if (!workSelected.comment_data){
			console.error("workSelected.comment_data--->无值");
			return false;
		}
		
		var jsonData = {};
        Util.addParameter(jsonData, "SERVICE", "CommonQueryService");
        Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
        Util.addParameter(jsonData, "SQLID", "selectWorkHistoryDetails");
        Util.addParameter(jsonData, "WORKDEALID", workSelected.comment_data.data);
        TranMng.submitServer(jsonData, function (response) {
            console.info(response);
            if (!response.SUCCESS) {
                return false;
            }
            
            var data = response.DATA[0];
            if (!data){
            	 return false;
            }
            
            _View.tranLinkOpen("../../oa/common/workHistory.html", '', function(){
            	 console.info("******跳转到workHistory.html******");
            	 $("div#workHistoryDetails").find("input,textarea").each(function(){
    	       		 var id = this.id;
    	       		 if(id!="" && id!= undefined && id!= null && data.hasOwnProperty(id)){
    	       			 if (id =="DEAL_STATUS"){
    	       				 switch(data.DEAL_STATUS){
    	       				 	case "1":
    	       				 		$(this).val("未完成");
    	       				 	break;
    	       				 	case "2":
    	       				 		$(this).val("已完成");
     	       				 	break;
    	       				 }
	       				 }else if (id == "CHECK_RESULT"){
	       					switch(data.CHECK_RESULT){
		       				 	case "1":
		       				 		$(this).val("通过");
		       				 	break;
		       				 	case "2":
		       				 		$(this).val("未通过");
	 	       				 	break;
	       					}
	       				 }else if (id == "END_TIME"){
    	       				$(this).val(data.END_TIME);
    	       				$("div#workHistoryDetails input#REGISTER_TIME").val(data.END_TIME);
    	       			 }else{
    	       				$(this).val(data[id]);
    	       			 }
    	       		 }
           	     });
                
                switch(data.WORK_TYPE){
                	case WORK_INSTALL:
                		$("div#workHistoryDetails div.install").show();
                	break;
                	case WORK_ACCEPT:
                		$("div#workHistoryDetails div.check").show();
                	break;
                	case WORK_TRAIN:
                		$("div#workHistoryDetails div.train").show();
                	break;
                	case WORK_REPAIR:
                		$("div#workHistoryDetails div.repair").show();
                	break;
                	case WORK_MOVE:
                		$("div#workHistoryDetails div.move").show();
                	break;
                }
                
                $("div#workHistoryDetails").on("click", "button#RET", function(){
                	_View.tranLinkReturn();
                });
                
                workAccessory(data.WORKDEAL_ID, data.WORK_ID)
            });
        });
    }
   
    function workAccessory(WORKDEAL_ID, WORK_ID) {
    	console.info("****************workAccessory************");
        var jsonData = {}

        Util.addParameter(jsonData, "SERVICE", "CommonQueryService");
        Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
        Util.addParameter(jsonData, "SQLID", "QueryAccessoryInfo");
        Util.addParameter(jsonData, "COMM_ID_P", WORKDEAL_ID);

        TranMng.submitServer(jsonData, function(response){
        	console.info(response);
            if (!response.SUCCESS) {
                return false;
            }
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
    
    that.searchHistory = function (selectData) {
        console.info("***********searchHistory()***********");
        $("#queryHistoryResult tbody").empty();
        var jsonData = {};
        Util.addParameter(jsonData, "SERVICE", "HistoryCommentService");
        Util.addParameter(jsonData, "TASKID", selectData.WORK_FLOW_ID);
        TranMng.submitServer(jsonData, function (response) {
            console.info(response);
            if (!response.SUCCESS) {
                return false;
            }
                        
            var analysisObj = {
                "CREATE":{"operType":"新建工单", "workStatus":"待审批", "explain":"提交新工单，待审批"},
            	"MODIFY":{"operType":"修改工单", "workStatus":"待审批", "explain":"驳回申请已修改，待审批"},
            	"ASSIGNMENT_REJECT":{"operType":"工单审批", "workStatus":"已驳回", "explain":"驳回"},
            	"ASSIGNMENT_VETO":{"operType":"工单审批", "workStatus":"已否决", "explain":"否决"},
            	"ASSIGNMENT_SUSPEND":{"operType":"工单审批", "workStatus":"已挂起", "explain":"挂起"},
            	"ASSIGNMENT_DISPATCH":{"operType":"工单审批", "workStatus":"待处理", "explain":"派单"},
            	"ASSIGNMENT_DISPATCH_AGIN":{"operType":"工单审批", "workStatus":"待处理", "explain":"重新派单"},
            	"DEAL_NOT_FINSH":{"operType":"工单处理", "workStatus":"处理中", "explain":"正在处理中"},
            	"DEAL_FINSH":{"operType":"工单处理", "workStatus":"完成待审验", "explain":"已完成待审验"},
            	"VERIFY_PASS":{"operType":"工单审验", "workStatus":"已结束", "explain":"通过"},
            	"VERIFY_NOT_PASS":{"operType":"工单审验", "workStatus":"处理中", "explain":"不通过"}
            };
            
            dataArray = response.DATA;
            for (var index = 0; index < dataArray.length; index++){
                var trObj = "";
                if (index % 2 == 0) {
                    trObj = $("<tr class='odd'></tr>");
                } else {
                    trObj = $("<tr class='even'></tr>");
                }
                
                var userId = dataArray[index].userId || "";
                if (!userId){
                	continue;
                }
                
                var comment_data = dataArray[index].comment_data;
                if (!comment_data || !comment_data.status){
                	continue;
                }
                
                var operTime = dataArray[index].time || "";
                var operName = "";
                if (allUserInfo[userId]) {
                	operName = allUserInfo[userId].USER_NAME;
                }
                
                var commentData = comment_data.data;
                var commentStatus = comment_data.status;
                
                var receivePerson = "";
                if ($.inArray(commentStatus, ["ASSIGNMENT_DISPATCH","ASSIGNMENT_DISPATCH_AGIN"]) != -1){
                	var task_work_executor = dataArray[index].task_work_executor || "";
                    if (allUserInfo[task_work_executor]) {
                        receivePerson = allUserInfo[task_work_executor].USER_NAME;
                    }
            	}
                	
                var operType = "";
                var workStatus = "";
                var explain = "";
                
                try{
                	operType = analysisObj[commentStatus].operType||"";
                	workStatus = analysisObj[commentStatus].workStatus||"";
                	if ($.inArray(commentStatus, ["CREATE","MODIFY","DEAL_NOT_FINSH","DEAL_FINSH"]) != -1){
        				explain = analysisObj[commentStatus].explain || "";
                	}else{
                		explain = dataArray[index].comment || analysisObj[commentStatus].explain;
                	}
                }catch(e){
                	console.error(e);
                }
             
                trObj.append($("<td>" + operTime + "</td>"));
                trObj.append($("<td>" + operName + "</td>"));
                trObj.append($("<td>" + operType + "</td>"));
                trObj.append($("<td>" + workStatus + "</td>"));
                trObj.append($("<td>" + explain + "</td>"));
                trObj.append($("<td>" + receivePerson + "</td>"));
              
                if (commentData && ($.inArray(commentStatus, ["DEAL_NOT_FINSH", "DEAL_FINSH"]) != -1)){
                	$("<td></td>").append($("<a>详细情况</a>").attr("id", index)).on("click", "a", function(){
                		workDealInfo(this.id);  
                	}).appendTo(trObj);
                  }else {
                    trObj.append($("<td></td>"));
                   }

                trObj.appendTo($("#queryHistoryResult tbody"));
            }
        });
    }

    console.info('WorkHistory模块初始化成功...');
    return that;
})(document, window.jQuery);
window.WorkHistory = WorkHistory;





	