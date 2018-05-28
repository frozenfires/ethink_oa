//@ sourceURL=dealwork.js
(function () {
	var options={    
		    rules:{		    	
		    	DEAL_STATUS:{required:true},
		    	START_TIME:{required:true},
		    	DEAL_DES:{required:true}	
		    },
		    messages:{		    	
		    	DEAL_STATUS: {required:"请选择处理状态!"},
		    	START_TIME: {required:"请选择开始时间!"},
		    	DEAL_DES: {required:"请输入处理描述!"} 		    	
		    }
		  };
	
	$("input#START_TIME").on("mouseover",function(e){	
		   $("input#START_TIME").calendar({
				format : 'yyyy-MM-dd HH:mm:ss',
				onSetDate : function (){
					if($("#END_TIME").val()!=""){
						if(this.inpE.value>=$("#END_TIME").val()){
							this.inpE.value = '';
							Alert.error("对不起,结束时间不能小于开始时间！");
						}
					}else{
							$("#START_TIME").nextAll(".error").remove();	
					}
					
				 } 
		  });
	});
	$("input#END_TIME").on("mouseover",function(e){	
		   $("input#END_TIME").calendar({
				format : 'yyyy-MM-dd HH:mm:ss',
				onSetDate : function (){
					if(this.inpE.value<=$("#START_TIME").val()){
						this.inpE.value = '';
						Alert.error("对不起,结束时间不能小于开始时间！");
					}
				 } 
		  });
	});
	
	
	var thisId;
	var i=0;
	$('#add_save').click(function(){
		add_save();
    });


 
    //隐藏部分内容
    $(".DevInfo").hide();
    $(".CustomerInfo").hide();
    $(".InstallInfo").hide();
    $(".RepairInfo").hide();
    $(".PatrolInfo").hide();
    $(".MoveDevInfo").hide();
    $(".AcceptInfo").hide();
    $(".TrainInfo").hide();
    $("#imageInfo").hide();
    $("#fileInfo").hide();
    $(".SETUP_MOVE").hide();
    $(".ACCEPT").hide();
    $(".REPAIR").hide();
    $(".TRAN").hide();
    
    var data = $("#linkContent").data("_userData");
    $("#WORKAPP_DEAL_ID").val(data.ID);   
    var filecount = 0;
    var imagecount = 0;   
	$(".onlyReadInfo input").attr("readonly","readonly");
	$(".onlyReadInfo input").each(function(){
		var id = this.id;		
		if(id!="" && id!= undefined && id!= null && data.hasOwnProperty(id)){
			$(this).val(data[id]);
		}
	});
	$(".onlyReadInfo textarea").attr("readonly","readonly");
	$(".onlyReadInfo textarea").each(function(){
		var id = this.id;		
		if(id!="" && id!= undefined && id!= null && data.hasOwnProperty(id)){
			$(this).val(data[id]);
		}
	});	
	TranMng.loadOptions('WORK_INSTALL_TYPE', 'selectDecice_type');
    TranMng.loadOptions('WORK_INSTALL_MODEL', 'selectDecice_model');
    TranMng.loadOptions('WORK_ACCEPT_TYPE', 'selectworks_accepttype');
    TranMng.loadOptions('DEVICE_TYPE', 'selectDecice_type');
    TranMng.loadOptions('DEVICE_MODEL', 'selectDecice_model');	
    TranMng.loadOptions('SETUP_TYPE', 'selectSetup_type');
    TranMng.loadOptions('FAUILT_TYPE', 'selectFaultType');
    TranMng.loadOptions('FAUILT_REASON', 'selectFaultReason');
    TranMng.loadOptions('CHECK_TYPE', 'selectACCEPT');  
    QueryaccessoryInfo(data.ID);	
    ShowInfo(data.WORK_TYPE);	
    //ShowInfo(2);
    $(window).keydown( function(event){
		if(event.keyCode ===116){
			//取消回车
			event.keyCode = 0;
			//防止ie浏览器中的时间冒泡(代码从下往上冒泡)
			event.cancelBubble = true; 
			return false; 
		}
	} );

    function init(argument){
    	selectEndTime();
    	optionsType();
    	$('#cancel').click(cancel);
    	Util.resetForm("addDealForm");
    	$('#addDealForm').validate(options);
    	
    	//如果点击取消，首先要把上传的那几个附件删除掉
    	$("#back").click(function(){
    		for(var j=0;j<i;j++){
       		 console.info(j+"----取消按钮删除附件-----:"+$("#loc"+j).val());    		 
       		 var accName=$("#loc"+j).val();
       		 if(accName!=undefined){
       			 var bb=accName.lastIndexOf("/");
    	    	 var ACCESSORY_LOC=accName.substr(0,bb);
    	    	 var ACCESSORY_NAME=accName.substr(Number(bb)+1);
    	    	 Filedelete(ACCESSORY_NAME,ACCESSORY_LOC,j);	
       		 }    		 
       	 }			
    		 _View.tranLinkReturn();
        });
    	
    	$('#a01,#a02').change(function(){
    		thisId = $(this).attr('id');
    		Alert.processing('文件正在上传，请稍候...');
    		setTimeout(function(){
    			ajaxFileUpload();
    		},3000);
    	});	
    	
    	$("#addDealForm").find(".select").each(function(){
    	    $(this).change(function(){
    	    	$(this).nextAll(".error").remove();   	    	
    	    });
    	});	  
    
    };
    
    init();
    
    function optionsType(){
    	if(data.WORK_TYPE=="2" || data.WORK_TYPE=="7"){
    		options.rules["DEVICE_ID"]={required:true};
    		options.messages["DEVICE_ID"]={required:"请输入设备编号"}; 
    		options.rules["DEVICE_NAME"]={required:true};
    		options.messages["DEVICE_NAME"]={required:"请输入设备名称"}; 
    		options.rules["DEVICE_IP"]={required:true};
    		options.messages["DEVICE_IP"]={required:"请输入设备IP"}; 
    		options.rules["HOST_NUM"]={required:true};
    		options.messages["HOST_NUM"]={required:"请输入主机序列号"};
    		options.rules["TCR_NUM"]={required:true};
    		options.messages["TCR_NUM"]={required:"请输入TCR序列号"};
    		options.rules["SUBNET_MASK"]={required:true};
    		options.messages["SUBNET_MASK"]={required:"子网掩码"};
    		options.rules["GATEWAY"]={required:true};
    		options.messages["GATEWAY"]={required:"请输入网关"};
    		options.rules["MAC"]={required:true};
    		options.messages["MAC"]={required:"请输入mac地址"};		
    	}else if(data.WORK_TYPE=="4"){   		
    		options.rules["TRANING_CONT"]={required:true};
    		options.messages["TRANING_CONT"]={required:"请输入培训内容"}; 
    	}
    	
    }
    
    
    function selectEndTime(){
    	$('#DEAL_STATUS').bind("change",function(){
    		if($("#DEAL_STATUS").val()==2){
    			$("#END_TIME").removeAttr("disabled");
    		}else{
    			$("#END_TIME").attr("disabled","disabled");
    			$("#END_TIME").val("");
    		}
    	});
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
        for(var i=0;i<4;i++){
        	uuid=uuid.replace("-","");
        }
        return uuid;
    }
    
    
    /**
     * 取消元素绑定事件
     */
    function removeEvent(){
    	$("#a01,#a02").unbind('change');
    	$("#cancel").unbind('click');
    }
    
    //js校验时间格式
    function checkTimeType() {
    		var dateBegin = $("#START_TIME").val();
    		var dateEnd = $("#END_TIME").val();
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
    
    
  //增加按钮保存
    function add_save(){
    	 	 var flag= $("#addDealForm").valid();
    	 	 if(!flag){
    	 		return;
    	 	 }
      	
    		 //检测select是否有值
    		 var flag = false;
    		 $("#addDealForm #errMsg").html("");
    		 $("#addDealForm .select").each(function(){
    		 var meg = {"DEAL_STATUS":"请选择处理状态！"    				
    	    			};
    		 if(data.WORK_TYPE=="5"){
    			 meg["FAUILT_TYPE"]="请选择故障类别";
    			 meg["FAUILT_REASON"]="请选择故障原因";
    		 }
    		 if(data.WORK_TYPE=="2"||data.WORK_TYPE=="7"){
    			 meg["DEVICE_TYPE"]="请选择设备类型";
    			 meg["DEVICE_MODEL"]="请选择设备型号";
    			 meg["SETUP_TYPE"]="请选择安装类型";
    		 }
    		 if(data.WORK_TYPE=="3"){
    			 meg["CHECK_TYPE"]="请选择验收类型";
    			 meg["CHECK_RESULT"]="请选择验收结果";
    		 }
    		 var sValue = $(this).selectValue();
    		 if (meg[this.id] != undefined && (sValue == "" || sValue == null || sValue == undefined)){
    				 $('<label for="' + this.id + '" class="error" style="display: inline-block;">' + meg[this.id] + '</label>').appendTo($(this).parent());
    				 flag = true;
    		 }
    		 });
    		 
    		 if (flag){
    			 return false;
    		 }
    		
             if(!checkTimeType()){
             	 return false;
             }
    	 	 var formArray=$('#addDealForm').serializeArray();//查询条件
    	 	 var jsonData=Util.formToJson(formArray);
    	 	 console.info("++++++"+jsonData.DEAL_STATUS);
    	 	 console.info(jsonData);
    	 	 if(jsonData.END_TIME==""){	 		
    	 		jsonData.END_TIME=null;
    	 	 }
    	 	 jsonData.ID=uuid();
    	     Util.addParameter(jsonData,"SERVICE","CommonExecuteService");
    	     Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
    	     Util.addParameter(jsonData,"SQLID","intMessage_deal");
    	     TranMng.submitServer(jsonData, function(response){
    	     if(response.SUCCESS){		
    	    	 for(var j=0;j<i;j++){
    	    		 console.info(j+"---------:"+$("#loc"+j).val());
    	    		 var ui=uuid();	    		 
    	    		 var accName=$("#loc"+j).val();
    	    		 if(accName!=undefined){
    	    			 var bb=accName.lastIndexOf("/");
    		    		 var ACCESSORY_LOC=accName.substr(0,bb);
    		    		 var ACCESSORY_NAME=accName.substr(Number(bb)+1);
    		    		 var ACCESSORY_SIZE=$("#fileSize"+j).val();
    		    		 jsonDataFile={'ACCESSORY_ID':ui,'COMMON_ID':jsonData.ID,'ACCESSORY_NAME':ACCESSORY_NAME,'ACCESSORY_SIZE':ACCESSORY_SIZE,'ACCESSORY_LOC':ACCESSORY_LOC}
    		    		 Util.addParameter(jsonDataFile,"SERVICE","CommonExecuteService");
    		    	     Util.addParameter(jsonDataFile,"DAO","TCRC_BASE_MANAGE_DAO");
    		    	     Util.addParameter(jsonDataFile,"SQLID","insert_Accessory");
    		    	     TranMng.submitServer(jsonDataFile,function(resu){
    		    	     console.info(resu);	    	    	
    		    	     });		    	
    	    		 }    		 
    	    	 }	
    	    	 jsonData.ADDRESS_ID_P=data.CUS_AREA_ID;
    	    	 operate(jsonData.DEAL_STATUS,jsonData.ADDRESS_ID_P,jsonData.ID,jsonData.DEAL_DES);  	    	
    	     }else{
    	    	Alert.error("处理失败！");
    	    	
    	     }
    	     });

    }
    
 
  //处理工单（处理成功/处理中）
    function operate(status,ADDRESS_ID_P,dealMessage_ID,desc){
    	console.info("***********operate()***********");
    	var jsonData={};
    	Util.addParameter(jsonData,"SERVICE","WorkDealService");
    	Util.addParameter(jsonData,"WORKAPP_ID",data.WORK_ID);
    	Util.addParameter(jsonData,"TASKID",data.WORK_FLOW_ID);
    	Util.addParameter(jsonData,"OPERATION", status);
    	Util.addParameter(jsonData,"dealMessage_ID", dealMessage_ID);   	
    	Util.addParameter(jsonData,"ADDRESS_ID_P", ADDRESS_ID_P);
    	Util.addParameter(jsonData,"deal_desc", desc);
    	Util.addParameter(jsonData,"PROPOSER",data.PROPOSER_ID);	
    	TranMng.submitServer(jsonData, function(res){
    		if(res.SUCCESS){    			
        		Alert.info("处理成功！"); 	    	
    		}else{
    			Alert.info("处理失败！");
    		}
    		_View.tranLinkReturn();
    });   	
    }

    
    function ajaxFileUpload() {
    	//debugger;
    	var file = thisId;
    	var filePath;
    	(file == "a01") ? filePath="/image/"+data.WORK_ID : filePath="/file/"+data.WORK_ID;
        $.ajaxFileUpload(
            {//这个是什么
                url: Config.basePath + '/file.do?method=uploads', //用于文件上传的服务器端请求地址
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: file, //文件上传域的ID
                dataType: 'text/html', //返回值类型 一般设置为json
                data:{
                	fiSize:300,
                	filePath:filePath
                },
                success: function (data, status)  //服务器成功响应处理函数
                {
                	uploadResult(data);
                },
                error: function (data, status, e)//服务器响应失败处理函数
                {
                	console.info("error:");
                    console.info(data);
                    console.info(status);
                    console.info(e);
                }
            }
        )
    }

    //文件删除
    function Filedelete(fileName,fileloc,k) {
    	jsonData={};
    	Util.addParameter(jsonData,"SERVICE","DeleteFileService");
        Util.addParameter(jsonData,"fileName",fileName);
        Util.addParameter(jsonData,"fileloc",fileloc);
        TranMng.submitServer(jsonData,function(resu){
        console.info("删除成功信息:"+resu);	  
        $("#"+k).remove();
        console.info("---------------");
        
        });		
    }
    
    
    /**
     * 文件上传结果处理
     */
    function uploadResult(dataRes){
    	var dataStr = dataRes.substring(1,dataRes.length-1);
    	var dataArray = dataStr.split(',');	   	
    	console.info("=========:"+dataArray);
    	var successArray = dataArray[2].split('=');
    	var success = successArray[1];
    	Alert.processingCancel();
    	var myData=dataArray[0].split('=')[0];
    	var bb=myData.lastIndexOf("/");
    	var fileloc=myData.substr(0,bb);
    	var fileName=myData.substr(Number(bb)+1);
    	var myFileSize=dataArray[0].split('=')[1];
    	//下载文档所需路径，暂未用到
    	var trueLoc="/file";
    	if(success == "true"){
    		Alert.info("文件上传成功！");	
    		var datapath = "";
    		if (fileloc == "/image/"+data.WORK_ID) {
                datapath = Loadimg(fileloc, fileName, i, myData);
            } else {
                datapath = Loadfile(fileloc, fileName, i, myData,myFileSize);
            }
            var k = i;
            $("#" + datapath).click(function () {
                Filedelete(fileName, fileloc, k);
            });

             i++;
    	}else{
    		console.info("文件上传失败！");
    		var messageArray = dataArray[0].split('=');
    		message = messageArray[1];
    		Alert.info(message);
    	}
    	removeEvent();
    	init();
    }

    /**
     * 工具栏点击取消触发函数
     */
    function cancel(){
    	$("#a1,#a2").attr('src','');
    	View.hub();
    }

    function Loadimg(path, name, _id, data) {

        var abs_path = "/etoa/download.do?reportName=" + name + "&path=" + path;
        //此处做了修改：imgdiv改成imgdivlook_
        var _imgdiv_id = "imgdivlook_" + _id;
        var _imgdelete_id = "delete_" + _id;
        var _name = name;
        if (name.length > 11) {
            _name = name.substring(0, 8) + "...";
        }
        var appendstr = '<div id= "' + _id + '" class="image_div" style=" position:relative;width: 130px;height: 130px;margin-left:20px;">\n' +
            '                        <div id="' + _imgdiv_id + '" class="imageid" style="position:absolute;width:100px;height:100px;left: 0px;top:0px;margin: 0 0;border: 1px solid #666;">\n' +
            '                            <img id="img_abspath" style="width: auto;height: auto;max-width: 100%;max-height: 100%;" src="' + abs_path + '">\n' +
            '                        </div>\n' +
            '                        <div style="position:absolute;width:30px;height:100px;left: 102px;margin: 0 0;">\n' +
            '\n' +
            '                            <img id="' + _imgdelete_id + '"style="margin-top: 10px;" src="../oa/appwork/upfile/delete.png"/>\n' +
            '                            <input style="display:none" id=loc' + i + ' name=loc' + i + ' value=' + data + '>\n' +
            '\n' +
            '                        </div>\n' +
            '                        <div style="text-align:center;position:absolute;width:100px;height:30px;top:102px;margin:0 0;">\n' +
            _name +
            '                        </div>\n' +
            '                    </div>';


        $("#_showimg_add").prepend(appendstr);

        //查看
        $("#" + _imgdiv_id).on('click', function () {
            var src = $(this).find("img").attr("src");

            Alert.popWindow($("#imgshowInfo"));
            $("#bigimgshow").attr("src", abs_path);

        });

        return _imgdelete_id;
    }
    $("#closeimgshow").on('click', function () {
        Alert.closeWindow($("#imgshowInfo"))
    });
    
    
    function Loadfile(path, name, _id, data,fileSize) {
        var _filedelete_id = "delete_" + _id;
        var filename_id = "filename_" + _id;
        var uploaddate = GetCurrentDate();
        var filesize = fileSize;

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
        if(name.length >11){
            name = name.substring(0,8)+"...";
        }

        var appendfile = '<div id="' + _id + '" class="" style=" position:relative;width: 300px;height: 130px;margin-left:20px;">\n' +
            '                        <div class="" style="position:absolute;width:100px;height:100px;left: 0px;top:0px;margin: 0 0; border: 1px solid #666;">\n' +
            '                            <img style="width: 100px;height: 100px;" src=" ' + showimgpath + '">\n' +
            '                        </div>\n' +
            '                        <div style="position:absolute;width:200px;height:130px;left: 100px;top: -10px;margin: 0 0;">\n' +
            '                            <div >\n' +
            '                                文件名称:<span id="' + filename_id + '">' + name + '</span>\n' +
            '                            </div>\n' +
            '                            <div>\n' +
            '                                上传时间:<span id="">' + uploaddate + '</span>\n' +
            '                            </div>\n' +
            '                            <div>\n' +
            '                                文件大小:<span id="">' + filesize + '</span>\n' +
            '                            </div>\n' +
            '                            <div>\n' +
            '                                <a id="' + _filedelete_id + '" style="color: #e9322d">删除</a>\n' +
            '                            </div>\n' +
            '                            <input style="display:none" id=loc' + i + ' name=loc' + i + ' value=' + data + '>\n' +
            '                            <input style="display:none" id=fileSize' + i + ' name=fileSize' + i + ' value=' + filesize + '>\n' +
            '                        </div>\n' +
            '                    </div>';

        $("#_showfile_add").prepend(appendfile);

        return _filedelete_id;
    }
    
    
    function QueryaccessoryInfo(ID) {

        var jsonData = {}

        Util.addParameter(jsonData, "SERVICE", "CommonQueryService");
        Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
        Util.addParameter(jsonData, "SQLID", "QueryAccessoryInfo");
        Util.addParameter(jsonData, "COMM_ID_P", ID);


        TranMng.submitServer(jsonData, response_AccessoryInfo);
    }

    var count = 0;
    var _i = 0;
    var downid = "";

    function response_AccessoryInfo(reponse) {

        var datares = reponse.DATA;

        if (0 != reponse.DATA.length) {
            for (var i in datares) {

                var path = datares[i].ACCESSORY_LOC;
                var name = datares[i].ACCESSORY_NAME;
                var abspath_p = datares[i].abspath;
                var time = datares[i].UPLOAD_TIME;
                var size = datares[i].ACCESSORY_SIZE;
                if ("/image/"+data.WORK_ID == path) {
                    imagecount++;
                    downid = appendimg(path, name, count, abspath_p);
                } else {
                    filecount++;
                    downid = appendfile(path, name, count, abspath_p, time,size);
                }
                count++;

            }

        }


    }



    function appendimg(path, name, _id, abspath_p) {
        if (imagecount == 1) {
            $("#imageInfo").show();
        }

        var abs_path = "/etoa/download.do?reportName=" + name + "&path=" + path;
        var _imgdiv_id = "imgdiv_" + _id;
        var _imgdelete_id = "dowbload_" + _id;
        //此处做了修改：_id改成_id="look_"+_id;
        _id="look_"+_id;
        if (name.length > 11) {
            name = name.substring(0, 8) + "...";
        }
        var appendstr = '<div id= "' + _id + '" class="image_div" style=" position:relative;width: 130px;height: 130px;margin-left:20px;">\n' +
            '                        <div id="' + _imgdiv_id + '"class="imageid" style="position:absolute;width:100px;height:100px;left: 0px;top:0px;margin: 0 0;border: 1px solid #666;">\n' +
            '                            <img id="img_abspath" style="width: auto;height: auto;max-width: 100%;max-height: 100%;" src="' + abs_path + '">\n' +
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

    $("#closeimgshow").on('click', function () {
        Alert.closeWindow($("#imgshowInfo"))
    });

    function appendfile(path, name, _id, abspath_p, time,size) {

        if (filecount == 1) {
            $("#fileInfo").show();
        }


        var _filedelete_id = "dowbload_" + _id;
        var filename_id = "filename_" + _id;
        var uploaddate = time;
        var filesize = size;
        var _filedown_id = "dowload_" + _id;
        //此处做了修改：_id="look_"+_id;
        _id="look_"+_id;
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

    function ShowInfo(val_type) {
        if (val_type == 3 || val_type == 5 || val_type == 6 || val_type == 7 || val_type == 8) {

            $(".DevInfo").show();
            $(".CustomerInfo").show();


        } else {

            $(".DevInfo").hide();
            $(".CustomerInfo").show();
            if (val_type == 4) {
            	$(".TRAN").show();
            	$(".TrainInfo").show();
            } else {
            	$(".TRAN").hide();
            	$(".TrainInfo").hide();
            }
	
        }

        if (val_type == 2) {
            $(".InstallInfo").show();          
        } else {
            $(".InstallInfo").hide();         
        }

        if (val_type == 3) {

            $(".AcceptInfo").show();
            $(".ACCEPT").show();
        } else {
            $(".AcceptInfo").hide();
            $(".ACCEPT").hide();
        }
        
       
        if (val_type == 5) {

            $(".RepairInfo").show();
            $(".REPAIR").show();
        } else {
            $(".RepairInfo").hide();
            $(".REPAIR").hide();
        }

        if (val_type == 6) {

            $(".PatrolInfo").show();
        } else {
            $(".PatrolInfo").hide();
        }

        if (val_type == 7) {
            $(".MoveDevInfo").show();         
        } else {
            $(".MoveDevInfo").hide();          
        }
        
        if (val_type == 2 || val_type == 7) {
            $(".SETUP_MOVE").show();          
        } else {
            $(".SETUP_MOVE").hide();         
        }
    }

    /**
     * 获取当前系统时间
     * @constructor
     */
    function GetCurrentDate() {
        var date = new Date();
        var year = date.getFullYear();//得到当前年份
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var dateString = year + month + day;
        return dateString;

    }
    
})();



