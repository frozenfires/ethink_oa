//@ sourceURL=appwork.js
(function () {
    //隐藏部分内容
    $(".DevInfo").hide();
    $(".CustomerInfo").hide();
    $(".InstallInfo").hide();
    $(".RepairInfo").hide();
    $(".PatrolInfo").hide();
    $(".MoveDevInfo").hide();
    $(".AcceptInfo").hide();
    $("#CUSQuery").hide();
    $(".TrainInfo").hide();

    /**
     * 加载下拉列表
     */
    TranMng.loadOptions('WORK_TYPE', 'selectworks_type');
    TranMng.loadOptions('WORK_URGENT', 'selectworks_urgent');
    TranMng.loadOptions('WORK_INSTALL_TYPE', 'selectDecice_type');
    TranMng.loadOptions('WORK_INSTALL_MODEL', 'selectDecice_model');
    TranMng.loadOptions('WORK_ACCEPT_TYPE', 'selectworks_accepttype');


    var oTable = null;


    var dev_no = "";
    var i = 0;
    var checkflag = true;
    var seq = TranMng.getSeqNo()

    var options = {
        rules: {
            WORK_TYPE: {required: true},
            WORK_URGENT: {required: true}

        },
        messages: {
            WORK_TYPE: {required: "请选择设备类型!"},
            WORK_URGENT: {required: "请选择紧急程度!"}
        }
    };


    $('#addworksForm').validate(options);


    function init() {

    	TranMng.loadOptions('WORK_REPAIR_TYPE', 'selectFaultType');
    	
        Util.resetForm("addworksForm");

        GetInitData();
        $('#WORK_TYPE').bind("change", function () {

            if ($('#WORK_TYPE').val() == 3 || $('#WORK_TYPE').val() == 5 || $('#WORK_TYPE').val() == 6 || $('#WORK_TYPE').val() == 7 || $('#WORK_TYPE').val() == 8) {

                $(".DevInfo").show();
                $(".CustomerInfo").show();
                $("#CUSQuery").hide();
                $("#WORK_CUS_NO").attr("readonly", "readonly");
                $("#WORK_CUS_NAME").attr("readonly", "readonly");


            } else {

                $(".DevInfo").hide();
                $(".CustomerInfo").show();
                $("#CUSQuery").show();
                $("#WORK_CUS_NO").removeAttr("readonly");
                $("#WORK_CUS_NAME").removeAttr("readonly");

            }


            if ($('#WORK_TYPE').val() == 2) {

                $(".InstallInfo").show();


            } else {
                $(".InstallInfo").hide();
            }

            if ($('#WORK_TYPE').val() == 3) {

                $(".AcceptInfo").show();
            } else {
                $(".AcceptInfo").hide();
            }

            if ($('#WORK_TYPE').val() == 5) {

                $(".RepairInfo").show();
            } else {
                $(".RepairInfo").hide();
            }

            if ($('#WORK_TYPE').val() == 6) {

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


        });

        $('#submit').click(function () {
            add_save();
        });


        //加载工单编号：规则4位年份+2位月份+2位日期+3位流水序号。

        $("#WORK_ID").val(seq);
        $("#WORK_STATUS").val("新建");

        $('#WORK_DEV_NO').click(function () {
            Alert.popWindow($("#SelectDevModal"));

        });

        $('#DevQuery').click(function () {

            dev_no = $("#WORK_DEV_NO").val();

            if (dev_no == "" || dev_no == null) {
                Alert.error("请输入设备编号！");
                return;
            }
            Search_DEVInfo(dev_no);
        });


    };

    init();


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

        $("#WORK_DEV_NAME").val(response["DATA"][0]["DEVICE_NAME"]);
        $("#WORK_DEV_MODEL").val(response["DATA"][0]["DEVICE_MODEL"]);
        $("#WORK_DEV_TYPE").val(response["DATA"][0]["DEVICE_TYPE"]);
        $("#WORK_CUS_NO").val(response["DATA"][0]["ORG_ID_P"]);
        $("#WORK_CUS_NAME").val(response["DATA"][0]["ORG_NAME"]);
        $("#WORK_CUS_ADDRESS").val(response["DATA"][0]["ORG_ADDRESS"]);
        $("#WORK_CUS_CONTACTS").val(response["DATA"][0]["LINKMAN"]);
        $("#WORK_CUS_PHONE").val(response["DATA"][0]["ORG_PHONE"]);

        $("#ADDRESS_ID_P").val(response["DATA"][0]["AREA_ID"]);
    }


    function GetInitData() {
        var jsonData = {};
        Util.addParameter(jsonData, "SERVICE", "CommonQueryService");
        Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
        Util.addParameter(jsonData, "SQLID", "QueryUserInfo");

        TranMng.submitServer(jsonData, response_queryUser);

    }

    function response_queryUser(res) {

        console.info(JSON.stringify(res));
        var name = res["DATA"][0]["USER_NAME"];
        var add_name = res["DATA"][0]["ADDRESS_NAME"];

        console.info("ADDRESS_NAME:" + add_name);

        $("#WORK_DEPARTMENT").val(add_name);
        $("#WORK_STAFF").val(name);
        $("#WORK_APPTIME").val(GetCurrentTime());

    }


    //增加按钮保存
    function add_save() {
        CheckValue();
        if (!checkflag) {
        	console.error("提交前数据校验未通过！");
            return;
        }

        var formArray = $('#addworksForm').serializeArray();
        var jsonData = Util.formToJson(formArray);


        if ("" == jsonData.WORK_REPAIR_TIME) {

            jsonData.WORK_REPAIR_TIME = null;
        }

        if ("" == jsonData.WORK_ACCEPT_TIME) {
            jsonData.WORK_ACCEPT_TIME = null;
        }

        if ("" == jsonData.WORK_TRAIN_TIME) {
            jsonData.WORK_TRAIN_TIME = null;
        }

        i = Number($("#filecount").val());

        jsonData.WORK_STATUS = '2';//待审批
        Util.addParameter(jsonData, "SERVICE", "AppWorkService");

        TranMng.submitServer(jsonData, response_add);

    }

    function response_add(response) {
        console.info("保存是否成功：" + JSON.stringify(response));
        var jsonDataFile = {};
        var confirm = response["SUCCESS"];

        if (confirm) {
            /**
             * 附件信息处理
             */

            for (var j = 0; j < i; j++) {

                var accName = $("#loc" + j).val();
                if (undefined != accName) {
                    var bb = accName.lastIndexOf("/");
                    var ACCESSORY_LOC = accName.substr(0, bb);
                    var ACCESSORY_NAME = accName.substr(Number(bb) + 1);
                    var ACCESSORY_SIZE=$("#fileSize"+j).val();
                    var _uuid = uuid();
                    jsonDataFile = {'ACCESSORY_ID': _uuid, 'COMMON_ID': seq,'ACCESSORY_SIZE':ACCESSORY_SIZE, 'ACCESSORY_NAME': ACCESSORY_NAME, 'ACCESSORY_LOC': ACCESSORY_LOC}

                    Util.addParameter(jsonDataFile, "SERVICE", "CommonExecuteService");
                    Util.addParameter(jsonDataFile, "DAO", "TCRC_BASE_MANAGE_DAO");
                    Util.addParameter(jsonDataFile, "SQLID", "insert_Accessory");
                    TranMng.submitServer(jsonDataFile, function (resu) {

                        console.info(resu);

                    });
                }

            }
            Alert.info("提交成功！");
        } else {
            Alert.info("提交失败！");
        }

        _View.tranLinkReturn();

    }

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


    $("#build_cancel").click(function () {
        var count = Number($("#filecount").val());
        for (var j = 0; j < count; j++) {
            console.info(j + "----取消按钮删除附件-----:" + $("#loc" + j).val());
            var accName = $("#loc" + j).val();
            if (accName != undefined) {
                var bb = accName.lastIndexOf("/");
                var ACCESSORY_LOC = accName.substr(0, bb);
                var ACCESSORY_NAME = accName.substr(Number(bb) + 1);
                Filedelete(ACCESSORY_NAME, ACCESSORY_LOC, j);
            }
        }

        _View.tranLinkReturn();
    });

    //文件删除
    function Filedelete(fileName, trueLoc, i) {

        jsonData = {};
        Util.addParameter(jsonData, "SERVICE", "DeleteFileService");
        Util.addParameter(jsonData, "fileName", fileName);
        Util.addParameter(jsonData, "fileloc", trueLoc);
        TranMng.submitServer(jsonData, function (resu) {
            console.info("删除成功信息:" + resu);
            $("#" + i).remove();
            console.info("---------------");

        });
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
    var _AREA_ID = "";

    //信息选择完成弹框
    $("#window_confirm").click(function () {
        var selectstr_cus = $('#queryCustomerResult tr.row_selected');
        if (selectstr_cus.length == 0) {
            Alert.error("请选择一个客户信息！");
            return;
        }

        var selectData = oTable.fnGetData(selectstr_cus[0]);

        _ORG_ID_P = selectData.ORG_ID_P;
        _ORG_NAME = selectData.ORG_NAME;
        _ORG_ADDRESS = selectData.ORG_ADDRESS;
        _LINKMAN = selectData.LINKMAN;
        _ORG_PHONE = selectData.ORG_PHONE;
        _AREA_ID = selectData.AREA_ID

        Alert.closeWindow(CustomInfoWindow);
        setval();
    });

    function setval() {

        $("#WORK_CUS_NO").val(_ORG_ID_P);
        $("#WORK_CUS_NAME").val(_ORG_NAME);
        $("#WORK_CUS_ADDRESS").val(_ORG_ADDRESS);
        $("#WORK_CUS_CONTACTS").val(_LINKMAN);
        $("#WORK_CUS_PHONE").val(_ORG_PHONE);
        $("#ADDRESS_ID_P").val(_AREA_ID);
    }

    /**
     * 回填datatable中的数据
     */
    function retrieveData(sSource, aoData, fnCallback) {


        var formArray = {};//查询条件
        var paramArray = aoData.concat(formArray);//合并查询条件和分页表格所需要的参数
        var jsonData = Util.formToJson(paramArray);

        var cusid = $("#WORK_CUS_NO").val();
        var cusname = $("#WORK_CUS_NAME").val();
        console.info("输入客户编号：[" + cusid + "]  输入客户名称：[" + cusname + "]");
        Util.addParameter(jsonData, "SERVICE", "CommonQueryService");
        Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
        Util.addParameter(jsonData, "SQLID", "QueryALLCusInfo");//查出所有客户信息,与输入相关信息置顶
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
            $("#queryCustomerResult").show();
            oTable = $('#queryCustomerResult').dataTable({
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


    /**
     * 获取当前系统时间
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

    /**选择移机客户模态窗口显示******************************************************************/

    var Movedev_CusInfoWindow = $('#Movedev_CusInfo');

    $("#Move_CUSQuery").click(function () {
        Alert.popWindow(Movedev_CusInfoWindow);

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
    // var Movedev_AREA_ID = "";

    //信息选择完成弹框
    $("#Movedev_window_confirm").click(function () {
        var selectstr_movedevcus = $('#Movedev_queryResult tr.row_selected');
        if (selectstr_movedevcus.length == 0) {
            Alert.error("请选择一个客户信息！");
            return;
        }
        var selectData = oTable.fnGetData(selectstr_movedevcus[0]);

        Movedev_ORG_ID_P = selectData.ORG_ID_P;
        Movedev_ORG_NAME = selectData.ORG_NAME;
        Movedev_ORG_ADDRESS = selectData.ORG_ADDRESS;
        Movedev_LINKMAN = selectData.LINKMAN;
        Movedev_ORG_PHONE = selectData.ORG_PHONE;
        //Movedev_AREA_ID = selectData.AREA_ID

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
        Util.addParameter(jsonData, "SQLID", "QueryALLCusInfo");
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

    /********************************************************************/


    function CheckValue() {
        var dev_no_val = $("#WORK_DEV_NO").val();
        var cus_no_val = $("#WORK_CUS_NO").val();
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
        var WORK_TYPE_val = $('#WORK_TYPE').val();
        var WORK_URGENT_val = $("#WORK_URGENT").val();

        checkflag = true;
        
        if (WORK_TYPE_val == null || WORK_TYPE_val == "") {
            Alert.info("请选择工单类型！");
            checkflag = false;

        }

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

})();