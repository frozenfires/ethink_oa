//@ sourceURL=modifyworks.js
(function () {

    $(".DevInfo").hide();
    $(".CustomerInfo").hide();
    $(".InstallInfo").hide();
    $(".RepairInfo").hide();
    $(".PatrolInfo").hide();
    $(".MoveDevInfo").hide();
    $(".AcceptInfo").hide();
    $("#CUSQuery").hide();
    $(".TrainInfo").hide();

    var filedatajosn = new Array();
    /**
     * 加载下拉列表
     */
    TranMng.loadOptions('WORK_TYPE', 'selectworks_type');
    TranMng.loadOptions('WORK_URGENT', 'selectworks_urgent');
    TranMng.loadOptions('WORK_INSTALL_TYPE', 'selectDecice_type');
    TranMng.loadOptions('WORK_INSTALL_MODEL', 'selectDecice_model');
    TranMng.loadOptions('WORK_ACCEPT_TYPE', 'selectworks_accepttype');

    var data = $("#linkContent").data("_userData");


    var id = data
    var oTable = null;
    var checkflag = true;

    var allcount = 0;//总计数器
    Modify(id);
    QueryaccessoryInfo(id);

    $("#submit").click(function () {
        CheckValue();
        if (!checkflag) {
            return;
        }

        var formArray = $('#modifyworksForm').serializeArray();
        var jsonData = Util.formToJson(formArray);
        console.info("--修改数据测试：" + JSON.stringify(jsonData));


        if ("" == jsonData.WORK_REPAIR_TIME) {

            jsonData.WORK_REPAIR_TIME = null;

        }

        if ("" == jsonData.WORK_ACCEPT_TIME) {

            jsonData.WORK_ACCEPT_TIME = null;
        }

        if ("" == jsonData.WORK_TRAIN_TIME) {

            jsonData.WORK_TRAIN_TIME = null;
        }

        Util.addParameter(jsonData, "SERVICE", "ModifyWorksService");
        Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
        Util.addParameter(jsonData, "SQLID", "updateworks");
        Util.addParameter(jsonData, "WORK_ID_P", id);


        Util.addParameter(jsonData, "WORK_LASTMODIFYTIME", GetCurrentTime());

        TranMng.submitServer(jsonData, response_submit);

    });

    function response_submit(response) {

        var confirm = response["SUCCESS"];
        if (confirm) {
            Delete_Accessory();

            save_accessory();
            Alert.info("修改成功！");

        } else {
            Alert.info("修改失败！");
        }

        _View.tranLinkReturn();
    }


    /**
     * 工单修改完成之后，处理附件问题
     *
     */
    function save_accessory() {

        /**
         * 附件信息处理
         */
        var oldcounts = allcount;
        var filecounts = Number($("#filecount").val());
        var allcounts = oldcounts + filecounts;


        for (var j = 0; j < allcounts; j++) {

            var accName = $("#loc" + j).val();

            if (undefined != accName) {

                var bb = accName.lastIndexOf("/");

                var ACCESSORY_LOC = accName.substr(0, bb);

                var ACCESSORY_NAME = accName.substr(Number(bb) + 1);
                var ACCESSORY_SIZE=$("#fileSize"+j).val();

                var _uuid = uuid();

                var jsonDataFile = {'ACCESSORY_ID': _uuid, 'COMMON_ID': id, 'ACCESSORY_SIZE': ACCESSORY_SIZE, 'ACCESSORY_NAME': ACCESSORY_NAME, 'ACCESSORY_LOC': ACCESSORY_LOC}

                Util.addParameter(jsonDataFile, "SERVICE", "CommonExecuteService");
                Util.addParameter(jsonDataFile, "DAO", "TCRC_BASE_MANAGE_DAO");
                Util.addParameter(jsonDataFile, "SQLID", "insert_Accessory");
                TranMng.submitServer(jsonDataFile, function (resu) {

                    console.info(resu);

                });
            }

        }

    }

    /**
     * 再更新之前，先删除关于这条工单的所有附件
     */

    function Delete_Accessory() {
        var jsonData = {}
        Util.addParameter(jsonData, "SERVICE", "CommonExecuteService");
        Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
        Util.addParameter(jsonData, "SQLID", "deleteAccessory");
        Util.addParameter(jsonData, "COMM_ID_P", id);
        TranMng.submitServer(jsonData, function () {

        });
    }


    /**
     * 获取当前系统时间
     * @param data
     * @constructor
     */

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


    function Modify(data) {

        var jsonData = {};
        Util.addParameter(jsonData, "SERVICE", "CommonQueryService");
        Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
        Util.addParameter(jsonData, "SQLID", "QueryWorkappInfo");
        Util.addParameter(jsonData, "WORK_ID_P", data);

        TranMng.submitServer(jsonData, response_Modify);

    }

    function response_Modify(response) {
        //获取数据
        var jsonData = response.DATA[0];


        ShowInfo(jsonData.WORK_TYPE);
        /**
         $(".show input").each(function () {
            var id = this.id;

            if (id != "" && id != undefined && id != null && jsonData.hasOwnProperty(id)) {

                $(this).val(jsonData[id]);
            }
        });
         */
        Util.fillData(jsonData, "modifyworksForm");

    }


    function ShowInfo(val_type) {
        if (val_type == 3 || val_type == 5 || val_type == 6 || val_type == 7 || val_type == 8) {

            $(".DevInfo").show();
            $(".CustomerInfo").show();
            $("#CUSQuery").hide();
            $("#ORG_ID_P").attr("readonly", "readonly");
            $("#ORG_NAME").attr("readonly", "readonly");

        } else {

            $(".DevInfo").hide();
            $(".CustomerInfo").show();
            $("#CUSQuery").show();
            $("#WORK_CUS_NO").removeAttr("readonly");
            $("#WORK_CUS_NAME").removeAttr("readonly");

        }

        if (val_type == 2) {

            $(".InstallInfo").show();
        } else {
            $(".InstallInfo").hide();
        }

        if (val_type == 3) {

            $(".AcceptInfo").show();
        } else {
            $(".AcceptInfo").hide();
        }

        if (val_type == 5) {

            $(".RepairInfo").show();
        } else {
            $(".RepairInfo").hide();
        }

        if (val_type == 6) {

            $(".PatrolInfo").show();
        } else {
            $(".PatrolInfo").hide();
        }

        if ($('#WORK_TYPE').val() == 7) {

            $(".MoveDevInfo").show();
        } else {
            $(".MoveDevInfo").hide();
        }
        if ($('#WORK_TYPE').val() == 4) {

            $(".TrainInfo").show();
        } else {
            $(".TrainInfo").hide();
        }
    }


    var CustomInfoWindow = $('#CustomInfo');

    $("#CUSQuery").click(function () {


        Alert.popWindow(CustomInfoWindow)
        Search_CustomInfo();
    });

    //关闭弹框
    $("#window_close").click(function () {

        Alert.closeWindow(CustomInfoWindow);
    });

    var _ORG_ID_P = "";
    var _ORG_NAME = "";
    var _ORG_ADDRESS = "";
    var _LINKMAN = "";
    var _ORG_PHONE = "";


    //信息选择完成弹框
    $("#window_confirm").click(function () {

        var selectData = oTable.fnGetData($('#queryResult tr.row_selected')[0]);

        _ORG_ID_P = selectData.ORG_ID_P;
        _ORG_NAME = selectData.ORG_NAME;
        _ORG_ADDRESS = selectData.ORG_ADDRESS;
        _LINKMAN = selectData.LINKMAN;
        _ORG_PHONE = selectData.ORG_PHONE;


        Alert.closeWindow(CustomInfoWindow);
        setval();
    });

    function setval() {

        $("#ORG_ID_P").val(_ORG_ID_P);
        $("#ORG_NAME").val(_ORG_NAME);
        $("#ORG_ADDRESS").val(_ORG_ADDRESS);
        $("#LINKMAN").val(_LINKMAN);
        $("#ORG_PHONE").val(_ORG_PHONE);
    }

    /**
     * 回填datatable中的数据
     */
    function retrieveData(sSource, aoData, fnCallback) {


        var formArray = {};//查询条件
        var paramArray = aoData.concat(formArray);//合并查询条件和分页表格所需要的参数
        var jsonData = Util.formToJson(paramArray);

        var cusid = $("#ORG_ID_P").val();
        var cusname = $("#ORG_NAME").val();
        console.info("输入客户编号：[" + cusid + "]  输入客户名称：[" + cusname + "]");
        Util.addParameter(jsonData, "SERVICE", "CommonQueryService");
        Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
        Util.addParameter(jsonData, "SQLID", "QueryCusInfo");
        Util.addParameter(jsonData, "cusid", cusid);
        Util.addParameter(jsonData, "cusname", cusname);
        Util.addParameter(jsonData, "IS_PAGE", true);

        TranMng.submitServer(jsonData, function (response) {
            console.info("查询返回数据开始");
            console.info(response);
            console.info("查询返回数据结束");
            fnCallback(response);
        });
    }


//查询
    function Search_CustomInfo() {
        if (oTable == null) { //仅第一次检索时初始化Datatable
            $("#queryResult").show();
            oTable = $('#queryResult').dataTable({
                "oLanguage": {"sUrl": "theme/page_cn.txt"},
                "aoColumns": [

                    {"mData": "ORG_ID_P", "sDefaultContent": ""},
                    {"mData": "ORG_NAME", "sDefaultContent": ""},
                    {"mData": "ORG_ADDRESS", "sDefaultContent": ""},
                    {"mData": "LINKMAN", "sDefaultContent": ""},
                    {"mData": "ORG_PHONE", "sDefaultContent": ""}

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

    $("input#WORK_ACCEPT_TIME").on("mouseover", function (e) {
        $("input#WORK_ACCEPT_TIME").calendar({
            format: 'yyyy-MM-dd HH:mm',
            onSetDate: function () {

            }
        });
    });

    $("input#WORK_ACCEPT_TIME").on("mouseover", function (e) {
        $("input#WORK_ACCEPT_TIME").calendar({
            format: 'yyyy-MM-dd HH:mm',
            onSetDate: function () {
                var app_time = $("#WORK_APPTIME").val().replace(/-/g, "/");
                var _apptime = new Date(app_time);
                var accepttime = $("#WORK_ACCEPT_TIME").val().replace(/-/g, "/");
                var _accepttime = new Date(accepttime);
                if (_apptime > _accepttime) {
                    Alert.info("对不起，验收时间不能早于工单申请时间！");
                    $("#WORK_ACCEPT_TIME").val("");
                }

            }
        });
    });
    $("input#WORK_REPAIR_TIME").on("mouseover", function (e) {
        $("input#WORK_REPAIR_TIME").calendar({
            format: 'yyyy-MM-dd HH:mm',
            onSetDate: function () {
                var app_time = $("#WORK_APPTIME").val().replace(/-/g, "/");
                var _apptime = new Date(app_time);
                var repairtime = $("#WORK_REPAIR_TIME").val().replace(/-/g, "/");
                var _repairtime = new Date(repairtime);
                if (_apptime < _repairtime) {
                    Alert.info("对不起，发生故障时间不能晚于工单申请时间！");
                    $("#WORK_REPAIR_TIME").val("");
                }

            }
        });
    });

    $("input#WORK_TRAIN_TIME").on("mouseover", function (e) {
        $("input#WORK_TRAIN_TIME").calendar({
            format: 'yyyy-MM-dd HH:mm',
            onSetDate: function () {
                var app_time = $("#WORK_APPTIME").val().replace(/-/g, "/");
                var _apptime = new Date(app_time);
                var traintime = $("#WORK_TRAIN_TIME").val().replace(/-/g, "/");
                var _traintime = new Date(traintime);
                if (_apptime > _traintime) {
                    Alert.info("对不起，培训时间不能早于工单申请时间！");
                    $("#WORK_TRAIN_TIME").val("");
                }
            }
        });
    });


    $("#modify_cancel").click(function () {

        var newappend = $("#addfiledata").val();
        var arr = new Array();
        var appJson = $.parseJSON(newappend);

        arr.push(appJson);

        //在修改返回时需要将新增的附件删除

        for (var i in arr) {
        	if (arr[i]){
        		var name = arr[i].filename;
                var path = arr[i].filepath;
                if (name && path){
                	T_Filedelete(name, path);
                }
        	}
        }

//        var url = "../../oa/queryworks/queryworks.html";
        _View.tranLinkReturn();
    });


    /********************************************************************/
    var Movedev_CusInfoWindow = $('#Movedev_CusInfo');

    $("#Move_CUSQuery").click(function () {
        Alert.popWindow(Movedev_CusInfoWindow)
        Search_MoveDev_CusInfo();
    });

    //关闭弹框
    $("#Movedev_window_close").click(function () {

        Alert.closeWindow(Movedev_CusInfoWindow);
    });

    var Movedev_ORG_ID_P = "";
    var Movedev_ORG_NAME = "";
    var Movedev_ORG_ADDRESS = "";
    var Movedev_LINKMAN = "";
    var Movedev_ORG_PHONE = "";


    //信息选择完成弹框
    $("#Movedev_window_confirm").click(function () {

        var selectData = oTable.fnGetData($('#Movedev_queryResult tr.row_selected')[0]);

        Movedev_ORG_ID_P = selectData.ORG_ID_P;
        Movedev_ORG_NAME = selectData.ORG_NAME;
        Movedev_ORG_ADDRESS = selectData.ORG_ADDRESS;
        Movedev_LINKMAN = selectData.LINKMAN;
        Movedev_ORG_PHONE = selectData.ORG_PHONE;


        Alert.closeWindow(Movedev_CusInfoWindow);
        Movedev_setval();
    });

    function Movedev_setval() {

        $("#WORK_MOVEDEV_No").val(Movedev_ORG_ID_P);
        $("#WORK_MOVEDEV_NAME").val(Movedev_ORG_NAME);
        $("#WORK_MOVEDEV_ADDRESS").val(Movedev_ORG_ADDRESS);
        $("#WORK_MOVEDEV_CONTACTS").val(Movedev_LINKMAN);
        $("#WORK_MOVEDEV_PHONE").val(Movedev_ORG_PHONE);
    }

    /**
     * 回填datatable中的数据
     */
    function Movedev_retrieveData(sSource, aoData, fnCallback) {


        var formArray = {};//查询条件
        var paramArray = aoData.concat(formArray);//合并查询条件和分页表格所需要的参数
        var jsonData = Util.formToJson(paramArray);

        var cusid = $("#WORK_MOVEDEV_No").val();
        var cusname = $("#WORK_MOVEDEV_NAME").val();
        console.info("输入客户编号：[" + cusid + "]  输入客户名称：[" + cusname + "]");
        Util.addParameter(jsonData, "SERVICE", "CommonQueryService");
        Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
        Util.addParameter(jsonData, "SQLID", "QueryCusInfo");
        Util.addParameter(jsonData, "cusid", cusid);
        Util.addParameter(jsonData, "cusname", cusname);
        Util.addParameter(jsonData, "IS_PAGE", true);

        TranMng.submitServer(jsonData, function (response) {
            console.info("查询返回数据开始");
            console.info(response);
            console.info("查询返回数据结束");
            fnCallback(response);
        });
    }


//查询
    function Search_MoveDev_CusInfo() {
        if (oTable == null) { //仅第一次检索时初始化Datatable
            $("#Movedev_queryResult").show();
            oTable = $('#Movedev_queryResult').dataTable({
                "oLanguage": {"sUrl": "theme/page_cn.txt"},
                "aoColumns": [

                    {"mData": "ORG_ID_P", "sDefaultContent": ""},
                    {"mData": "ORG_NAME", "sDefaultContent": ""},
                    {"mData": "ORG_ADDRESS", "sDefaultContent": ""},
                    {"mData": "LINKMAN", "sDefaultContent": ""},
                    {"mData": "ORG_PHONE", "sDefaultContent": ""}

                ],


                "bProcessing": true,					//加载数据时显示正在加载信息
                "bServerSide": true,					//指定从服务器端获取数据
                "bFilter": false,						//不使用过滤功能
                "bLengthChange": false,					//用户不可改变每页显示数量
                "iDisplayLength": 10,					//每页显示8条数据
                "sAjaxSource": "normal.do?method=doAction",  //获取数据的url
                "fnServerData": Movedev_retrieveData,			//获取数据的处理函数
                "sPaginationType": "full_numbers"	    //翻页界面类型

            });

        } else {
            oTable.fnClearTable(0);
            oTable.fnDraw();
        }
    }

    /***************************************************************/

    var dev_no = "";
    $('#DevQuery').click(function () {

        dev_no = $("#DEVICE_ID_P").val();

        if (dev_no == "" || dev_no == null) {
            Alert.error("请输入设备编号！");
            return;
        }
        Search_DEVInfo(dev_no);
    });

    function Search_DEVInfo(id) {

        var jsonData = {};
        Util.addParameter(jsonData, "SERVICE", "CommonQueryService");
        Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
        Util.addParameter(jsonData, "SQLID", "QueryDevInfo");
        Util.addParameter(jsonData, "DEV_ID_P", id);

        TranMng.submitServer(jsonData, response_QuerydevInfo);
    }

    function response_QuerydevInfo(response) {
        console.info("-------设备信息查询：" + JSON.stringify(response));

        $("#DEVICE_NAME").val(response["DATA"][0]["DEVICE_NAME"]);
        $("#DEVICE_MODEL").val(response["DATA"][0]["DEVICE_MODEL"]);
        $("#DEVICE_TYPE").val(response["DATA"][0]["DEVICE_TYPE"]);
        $("#ORG_ID_P").val(response["DATA"][0]["ORG_ID_P"]);
        $("#ORG_NAME").val(response["DATA"][0]["ORG_NAME"]);
        $("#ORG_ADDRESS").val(response["DATA"][0]["ORG_ADDRESS"]);
        $("#LINKMAN").val(response["DATA"][0]["LINKMAN"]);
        $("#ORG_PHONE").val(response["DATA"][0]["ORG_PHONE"]);

        $("#ADDRESS_ID_P").val(response["DATA"][0]["AREA_ID"]);
    }


    $('#ORG_ID_P').bind('input propertychange', function () {
        $("#ORG_ADDRESS").val("");
        $("#LINKMAN").val("");
        $("#ORG_PHONE").val("");

    });

    $('#ORG_NAME').bind('input propertychange', function () {
        $("#ORG_ADDRESS").val("");
        $("#LINKMAN").val("");
        $("#ORG_PHONE").val("");
    });

    /****************************附件问题处理***********************************************************************************************/

    function QueryaccessoryInfo(ID) {

        var jsonData = {}

        Util.addParameter(jsonData, "SERVICE", "CommonQueryService");
        Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
        Util.addParameter(jsonData, "SQLID", "QueryAccessoryInfo");
        Util.addParameter(jsonData, "COMM_ID_P", ID);


        TranMng.submitServer(jsonData, response_AccessoryInfo);
    }


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


                    appendimg(path, name, allcount, abspath_p);
                } else {

                    appendfile(path, name, allcount, abspath_p, time, size);
                }
                allcount++;

                $("#Allcount").val(allcount);
            }

        }


    }

    function appendimg(path, name, _id, abspath_p) {

        var abs_path = "/etoa/download.do?reportName=" + name + "&path=" + path;

        var _imgdelete_id = "_imgdelet_" + _id;

        var _imgdiv_id = "imgdiv_" + _id;

        var _name = name;
        if (name.length > 11) {
            _name = name.substring(0, 8) + "...";
        }

        var appendstr = '<div id= "' + _id + '" class="image_div" style=" position:relative;width: 130px;height: 130px;margin-left:20px;">\n' +
            '                        <div id="' + _imgdiv_id + '" class="imageid" style="position:absolute;width:100px;height:100px;left: 0px;top:0px;margin: 0 0;border: 1px solid #666;cursor:pointer;">\n' +
            '                            <img id="img_abspath" style="width: 100%;height: 100%;" src="' + abs_path + '">\n' +
            '                        </div>\n' +
            '                        <div class="downdivid" style="position:absolute;width:30px;height:100px;left: 102px;margin: 0 0;">\n' +
            '\n' +
            '                            <img id="' + _imgdelete_id + '"style="margin-top: 10px;" src="../oa/appwork/upfile/delete.png"/>\n' +

            '                            <input style="display:none" id=loc' + allcount + ' name=loc' + allcount + ' value=' + abspath_p + '>\n' +
            '\n' +
            '                        </div>\n' +
            '                        <div style="text-align:center;position:absolute;width:100px;height:30px;top:102px;margin:0 0;">\n' +
            _name +
            '                        </div>\n' +
            '                    </div>';


        $("#_showimg").prepend(appendstr);


        //删除
        $("#" + _imgdelete_id).on('click', function () {

            var json_data = {'filename': name, 'filepath': path}
            filedatajosn.push(json_data)
            $("#appendfiledata").val(filedatajosn)
            F_Filedelete(name, path, _id);
        });

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


    function appendfile(path, name, _id, abspath_p, time, size) {


        var _filedown_id = "dowload_" + _id;
        var _filedelete_id = "delete_" + _id;
        var filename_id = "filename_" + _id;
        var uploaddate = time;
        var filesize = size;

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
            '                                <a id="' + _filedelete_id + '" style="color: #e9322d">删除</a>\n' +
            '                                <a id= "' + _filedown_id + '" href="/etoa/download.do?reportName=' + name + '&path=' + path + '" style="color: #e9322d">下载</a>' +
            '                            </div>\n' +
            '                            <input style="display:none" id=loc' + allcount + ' name=loc' + allcount + ' value=' + abspath_p + '>\n' +
            '                        </div>\n' +
            '                    </div>';

        $("#_showfile").prepend(appendfile);

        //删除
        $("#" + _filedelete_id).on('click', function () {
            var json_data = {'filename': name, 'filepath': path};
            filedatajosn.push(json_data);
            $("#appendfiledata").val(filedatajosn);
            F_Filedelete(name, path, _id);
        });
    }

    //真文件删除
    function T_Filedelete(fileName, trueLoc) {

        var jsonData = {};
        Util.addParameter(jsonData, "SERVICE", "DeleteFileService");
        Util.addParameter(jsonData, "fileName", fileName);
        Util.addParameter(jsonData, "fileloc", trueLoc);
        Util.addParameter(jsonData, "FLAG", "T_DELETE");
        TranMng.submitServer(jsonData, function (resu) {
            console.info("删除成功信息:" + resu);
            //$("#" + i).remove();
            console.info("---------------");

        });
    }

    //假文件删除
    function F_Filedelete(fileName, trueLoc, i) {

        var jsonData = {};
        Util.addParameter(jsonData, "SERVICE", "DeleteFileService");
        Util.addParameter(jsonData, "fileName", fileName);
        Util.addParameter(jsonData, "fileloc", trueLoc);
        Util.addParameter(jsonData, "FLAG", "F_DELETE");
        TranMng.submitServer(jsonData, function (resu) {
            console.info("删除成功信息:" + resu);
            $("#" + i).remove();
            console.info("---------------");

        });
    }


    /***************************************************************************************************************************/
    /*****************************************************检查数据信息**********************************************************************/

    function CheckValue() {
        var dev_no_val = $("#DEVICE_ID_P").val();
        var cus_no_val = $("#ORG_ID_P").val();
        var WORK_INSTALL_TYPE_val = $("#WORK_INSTALL_TYPE").val();
        var WORK_INSTALL_MODEL_val = $("#WORK_INSTALL_MODEL").val();
        var WORK_REPAIR_TIME_val = $("#WORK_REPAIR_TIME").val();
        var WORK_REPAIR_TYPE_val = $("#WORK_REPAIR_TYPE").val();
        var WORK_REPAIR_DESCRIBE_val = $("#WORK_REPAIR_DESCRIBE").val();
        var WORK_PARTOL_TYPE_val = $("#WORK_PARTOL_TYPE").val();
        var WORK_MOVEDEV_No_val = $("#WORK_MOVEDEV_No").val();
        var WORK_MOVEDEV_NAME_val = $("#WORK_MOVEDEV_NAME").val();
        var WORK_ACCEPT_TIME_val = $("#WORK_ACCEPT_TIME").val();
        var WORK_ACCEPT_TYPE_val = $("#WORK_ACCEPT_TYPE").val();
        var WORK_TRAIN_TIME_val = $("#WORK_TRAIN_TIME").val();
        var WORK_TRAIN_INFO_val = $("#WORK_TRAIN_INFO").val();
        var WORK_URGENT_val = $("#WORK_URGENT").val();
        var WORK_TYPE_val = $("#WORK_TYPE").val();
        

        if (WORK_URGENT_val == null || WORK_URGENT_val == "") {
            Alert.info("请选择工单紧急程度！");
            checkflag = false;
        }

        if (WORK_TYPE_val == 3 || WORK_TYPE_val == 5 || WORK_TYPE_val == 6 || WORK_TYPE_val == 7 || WORK_TYPE_val == 8) {

            if (null == dev_no_val || "" == dev_no_val) {
                Alert.info("请输入设备编号!");
                checkflag = false;
            }
        }

        if (WORK_TYPE_val == 1 || WORK_TYPE_val == 2 || WORK_TYPE_val == 4) {

            if (null == cus_no_val || "" == cus_no_val) {
                Alert.info("请输入并选择相应的客户信息！");
                checkflag = false;
            }

            if (WORK_TYPE_val == 2) {//安装
                if (null == WORK_INSTALL_TYPE_val || "" == WORK_INSTALL_TYPE_val) {
                    Alert.info("请选择安装的设备类型！");
                    checkflag = false;
                }
                if (null == WORK_INSTALL_MODEL_val || "" == WORK_INSTALL_MODEL_val) {
                    Alert.info("请选择安装的设备类型！");
                    checkflag = false;
                }

            }

            if (WORK_TYPE_val == 4) {//培训
                if (null == WORK_TRAIN_TIME_val || "" == WORK_TRAIN_TIME_val) {
                    Alert.info("请选择培训时间！");
                    checkflag = false;
                }
                if (null == WORK_TRAIN_INFO_val || "" == WORK_TRAIN_INFO_val) {
                    Alert.info("请输入培训内容！");
                    checkflag = false;
                }
            }


        }

        if (WORK_TYPE_val == 3) {

            if (null == WORK_ACCEPT_TIME_val || "" == WORK_ACCEPT_TIME_val) {
                Alert.info("请选择验收时间！");
                checkflag = false;
            }
            if (null == WORK_ACCEPT_TYPE_val || "" == WORK_ACCEPT_TYPE_val) {
                Alert.info("请选择验收类型！");
                checkflag = false;
            }
        }

        if (WORK_TYPE_val == 5) {


            if (null == WORK_REPAIR_TIME_val || "" == WORK_REPAIR_TIME_val) {
                Alert.info("请选择故障时间！");
                checkflag = false;
            }
            if (null == WORK_REPAIR_TYPE_val || "" == WORK_REPAIR_TYPE_val) {
                Alert.info("请输入故障类型！");
                checkflag = false;
            }
            if (null == WORK_REPAIR_DESCRIBE_val || "" == WORK_REPAIR_DESCRIBE_val) {
                Alert.info("请输入故障描述！");
                checkflag = false;
            }
        }

        if (WORK_TYPE_val == 6) {

            if (null == WORK_PARTOL_TYPE_val || "" == WORK_PARTOL_TYPE_val) {
                Alert.info("请输入巡检说明！");
                checkflag = false;
            }
        }
        if (WORK_TYPE_val == 7) {
            if (null == WORK_MOVEDEV_No_val || "" == WORK_MOVEDEV_No_val || null == WORK_MOVEDEV_NAME_val || "" == WORK_MOVEDEV_NAME_val) {
                Alert.info("请输入移机客户编号或客户名称！");
                checkflag = false;
            }
        }
    }


    //以下为工具类
    /*********************************************************************************************************/

    //uuid生成唯一的id
    function uuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23];

        var uuid = s.join("");

        return uuid;
    }
})();



