//@ sourceURL=upload.js

(function () {


    /**
     * 初始化方法
     */
    var thisId;
    var i = 0;

    function init() {
        $('#cancel').click(cancel);
        $('#a01,#a02').change(function () {

            thisId = $(this).attr('id');

            Alert.processing('文件正在上传，请稍候...');
            setTimeout(function () {
                ajaxFileUpload();
            }, 3000);
        });
    };
    init();

    /**
     * 取消元素绑定事件
     */
    function removeEvent() {
        $("#a01,#a02").unbind('change');
        $("#cancel").unbind('click');
    }


    function ajaxFileUpload() {

        var file = thisId;
        var filePath;
        (file == "a01") ? filePath = "/image/"+$("#WORK_ID").val() : filePath = "/file/"+$("#WORK_ID").val();

        $.ajaxFileUpload(
            {//这个是什么
                url: Config.basePath + '/file.do?method=uploads', //用于文件上传的服务器端请求地址
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: file, //文件上传域的ID
                dataType: 'text/html', //返回值类型 一般设置为json
                data: {
                    fiSize: 5,
                    filePath: filePath
                },
                success: function (data)  //服务器成功响应处理函数
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


    /**
     * 文件上传结果处理
     */
    function uploadResult(dataRes) {
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
        var size = myFileSize;
        if (success == "true") {
            Alert.info("文件上传成功！");

            var datapath = "";
            if (fileloc == "/image/"+$("#WORK_ID").val()) {

                datapath = Loadimg(fileloc, fileName, i, myData);
            } else {
                datapath = Loadfile(fileloc, fileName, i, myData,size);
            }
            var k = i;

            $("#" + datapath).click(function () {

                Filedelete(fileName, fileloc, k);
            });

            i++;
            $("#filecount").val(i);
        } else {
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
    function cancel() {
        $("#a1,#a2").attr('src', '');
        View.hub();
    }


    function Loadimg(path, name, _id, data) {

        var abs_path = "/etoa/download.do?reportName=" + name + "&path=" + path;
        var _imgdiv_id = "imgdiv_" + _id;
        var _imgdelete_id = "delete_" + _id;
        var _name = name;
        if (name.length > 11) {
            _name = name.substring(0, 8) + "...";
        }
        var appendstr = '<div id= "' + _id + '" class="image_div" style=" position:relative;width: 130px;height: 130px;margin-left:20px;">\n' +
            '                        <div id="' + _imgdiv_id + '" class="imageid" style="position:absolute;width:100px;height:100px;left: 0px;top:0px;margin: 0 0;border: 1px solid #666;">\n' +
            '                            <img id="img_abspath" style="width: 100%;height: 100%;" src="' + abs_path + '">\n' +
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


        $("#_showimg").prepend(appendstr);

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

    function Loadfile(path, name, _id, data,size) {

        //var abs_path = "/etoa/download.do?reportName=" + name + "&path=" + path;

        var _filedelete_id = "delete_" + _id;
        var filename_id = "filename_" + _id;
        var uploaddate = GetCurrentDate();
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
            '                            </div>\n' +
            '                            <input style="display:none" id=loc' + i + ' name=loc' + i + ' value=' + data + '>\n' +
            '                            <input style="display:none" id=fileSize' + i + ' name=fileSize' + i + ' value=' + filesize + '>\n' +
            '                        </div>\n' +
            '                    </div>';

        $("#_showfile").prepend(appendfile);


        return _filedelete_id;
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
        // var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        // var min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        // var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

        var dateString = year + month + day;
        return dateString;

    }



    })();

