(function () {

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
	
    
    
    var filecount = 0;
    var imagecount = 0;


    /**
     * 加载下拉列表
     */
    TranMng.loadOptions('WORK_TYPE', 'selectworks_type');
    TranMng.loadOptions('WORK_URGENT', 'selectworks_urgent');
    TranMng.loadOptions('WORK_INSTALL_TYPE', 'selectDecice_type');
    TranMng.loadOptions('WORK_INSTALL_MODEL', 'selectDecice_model');
    TranMng.loadOptions('WORK_ACCEPT_TYPE', 'selectworks_accepttype');



    //QuerworksInfo(data);
    QueryaccessoryInfo(data.WORK_ID);
    ShowInfo(data.WORK_TYPE);
    
    $("#back").click(function () {
        //var url = "../../oa/appWork_deal/appWork_deal.html";
        _View.tranLinkReturn();
    });


    function QuerworksInfo(ID) {

        var jsonData = {}

        Util.addParameter(jsonData, "SERVICE", "CommonQueryService");
        Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
        Util.addParameter(jsonData, "SQLID", "QueryWorkappInfo");
        Util.addParameter(jsonData, "WORK_ID_P", ID);

        TranMng.submitServer(jsonData, response_QuerworksInfo);
    }

    function response_QuerworksInfo(response) {

        ShowInfo(response.DATA[0].WORK_TYPE);

        SetData(response);


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
                if(undefined == name || '' == name){
                    name = '未知';
                }
                if(undefined == time || '' == time){
                    time = '未知';
                }

                if(undefined == size || '' == size){
                    size = '未知';
                }

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
        var _name;
        if (name.length > 11) {
            _name = name.substring(0, 8) + "...";
        }else{
        	_name=name;
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


    function SetData(response) {
        var data = response.DATA[0];

        /**
        $(".show input").each(function () {
            var id = this.id;
            if (id != "" && id != undefined && id != null && data.hasOwnProperty(id)) {

                $(this).val(data[id]);
            }
        });
        */
        Util.fillData(data,"lookworks");

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


})();



