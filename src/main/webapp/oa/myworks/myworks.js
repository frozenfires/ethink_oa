//@ sourceURL=myworks.js
(function () {

    var oTable = null;



    Search_REBUTInfo();


    /**
     * 回填datatable中的数据
     */
    function retrieveData(sSource, aoData, fnCallback) {
        var formArray = $('#queryForm').serializeArray();//查询条件
        var paramArray = aoData.concat(formArray);//合并查询条件和分页表格所需要的参数
        var jsonData = Util.formToJson(paramArray);
        Util.addParameter(jsonData, "SERVICE", "WorkOrderService");
        TranMng.submitServer(jsonData, function (response) {
            console.info("查询返回数据开始");
            console.info(response);
            console.info("查询返回数据结束");
            fnCallback(response);
        });
    }

    var seletedtr = $('#queryResult tr.row_selected');
    var selectData = oTable.fnGetData(seletedtr[0]);

//查询
    function Search_REBUTInfo() {
        if (oTable == null) { //仅第一次检索时初始化Datatable
            $("#queryResult").show();
            oTable = $('#queryResult').dataTable({
                "oLanguage": {"sUrl": "theme/page_cn.txt"},
                "aoColumns": [
                    {"mData": "workapp_WORK_ID", "sDefaultContent": ""},
                    {"mData": "workapp_WORK_TYPE", "sDefaultContent": ""},
                    {"mData": "workapp_WORK_URGENT", "sDefaultContent": ""},
                    {"mData": "workapp_WORK_STATUS", "sDefaultContent": ""},
                    {"mData": "workapp_DEVICE_NO", "sDefaultContent": ""},
                    {"mData": "workapp_DEVICE_NAME", "sDefaultContent": ""},
                    {"mData": "workapp_DEVICE_MODEL", "sDefaultContent": ""},
                    {"mData": "workapp_DEVICE_TYPE", "sDefaultContent": ""},
                    {"mData": "workapp_CUS_NAME", "sDefaultContent": ""},
                    {"mData": "workapp_WORK_APPTIME", "sDefaultContent": ""},
                    {"mData": "", "sDefaultContent": '<a>详细</a>'}
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


    $('#temptable').on('click','a',function(){
        var selectData = oTable.fnGetData( $('#queryResult tr.row_selected')[0] );


        var id = selectData[0].workapp_WORK_ID;


        /**
         * 打开交易联动
         * targetTranid 目标交易id
         * tranData 联动数据
         */
        var url = "../../oa/Modifyworks/modifyworks.html";
        _View.tranLinkOpen(url, id);

    });






})();

