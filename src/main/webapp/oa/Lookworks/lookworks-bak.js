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


    var data = $("#mainContent").data("_userData");
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



    QuerworksInfo(data);



    $("#back").click(function () {
        var url = "../../oa/queryworks/queryworks.html";
        _View.tranLinkOpen(url, '');
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

        var data = reponse.DATA;

        if (0 != reponse.DATA.length) {
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

                if ("/image/"+$("#WORK_ID").val() == path) {
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


    function SetData(response) {
        var set_data = response.DATA[0];

        /**
        $(".show input").each(function () {
            var id = this.id;
            if (id != "" && id != undefined && id != null && data.hasOwnProperty(id)) {

                $(this).val(data[id]);
            }
        });
        */
        Util.fillData(set_data,"lookworks");
        QueryaccessoryInfo(data);
    }


    function ShowInfo(val_type) {
    
        if (val_type == WORK_ACCEPT || val_type == WORK_REPAIR || val_type == WORK_EXAMIN || val_type == WORK_MOVE || val_type == WORK_RECALL) {

            $(".DevInfo").show();
            $(".CustomerInfo").show();


        } else {

            $(".DevInfo").hide();
            $(".CustomerInfo").show();

        }

        if (val_type == WORK_INSTALL) {

            $(".InstallInfo").show();
        } else {
            $(".InstallInfo").hide();
        }

        if (val_type == WORK_ACCEPT) {

            $(".AcceptInfo").show();
        } else {
            $(".AcceptInfo").hide();
        }

        if (val_type == WORK_REPAIR) {

            $(".RepairInfo").show();
        } else {
            $(".RepairInfo").hide();
        }

        if (val_type == WORK_EXAMIN) {

            $(".PatrolInfo").show();
        } else {
            $(".PatrolInfo").hide();
        }

        if (val_type == WORK_MOVE) {

            $(".MoveDevInfo").show();
        } else {
            $(".MoveDevInfo").hide();
        }
    }

})();



