//@ sourceURL=F0111qw.js
(function () {

    var flowid = "";
    var oTable = null;
    var historyoTable = null;
    var data = $("#linkContent").data("_userData");
 $('#searchworkdetailModal').show();

 $(document).ready(function  () {	
		var jsonData = {};
	
	Util.addParameter(jsonData, "SERVICE", "CommonQueryService");
	Util.addParameter(jsonData, "DAO", "TCRC_BASE_MANAGE_DAO");
		Util.addParameter(jsonData, "SQLID", "selectOneWorkDeail");
	//Util.addParameter(jsonData,"ORGG_ID",aSelected.toString());
		Util.addParameter(jsonData, "ID", data.ID);
		TranMng.submitServer(jsonData, response_edit);
	
	}
 );
	function response_edit(response) {
		//获取数据
		
		myworkfildata(response);
		
		
		
	}
	function  myworkfildata(response){
		var jsonData = response.DATA[0];
		if(jsonData.WORK_TYPE=="1"||jsonData.WORK_TYPE=="2"||jsonData.WORK_TYPE=="4"){

			$('#deviceshow').hide();}
		else  {
			
				$('#deviceshow').show();
				
				
				
			}
		if(jsonData.WORK_TYPE=="1"){

			$('#attachsow').hide();
			
		}
		if(jsonData.WORK_TYPE=="2"){

			$('.installshow').show();
			$('.checkupshow').hide();
			$('.trainshow').hide();
			$('.maintainshow').hide();
			$('.routeshow').hide();
			$('.moveshow').hide();
		}
		if(jsonData.WORK_TYPE=="3"){
			$('.installshow').hide();
			$('.checkupshow').show();
			$('.trainshow').hide();
			$('.maintainshow').hide();
			$('.routeshow').hide();
			$('.moveshow').hide();
		}
		if(jsonData.WORK_TYPE=="4"){
			$('.installshow').hide();
			$('.checkupshow').hide();
			$('.trainshow').show();
			$('.maintainshow').hide();
			$('.routeshow').hide();
			$('.moveshow').hide();
		}
		if(jsonData.WORK_TYPE=="5"){
			$('.installshow').hide();
			$('.checkupshow').hide();
			$('.trainshow').hide();
			$('.maintainshow').show();
			$('.routeshow').hide();
			$('.moveshow').hide();
		}
		if(jsonData.WORK_TYPE=="6"){
			$('.installshow').hide();
			$('.checkupshow').hide();
			$('.trainshow').hide();
			$('.maintainshow').hide();
			$('.routeshow').show();
			$('.moveshow').hide();
		}
		if(jsonData.WORK_TYPE=="7"){

			$('.installshow').hide();
			$('.checkupshow').hide();
			$('.trainshow').hide();
			$('.maintainshow').hide();
			$('.routeshow').hide();
			$('.moveshow').show();
		}
		Util.fillData(jsonData, "searchworkdetailModal");
		console.info(jsonData+"===============");
		QueryaccessoryInfo(jsonData.ID);
	}
 $("#backwork").click(function () {

	 _View.tranLinkReturn();
 });
  
   $('#queryResult').on('click', '.work_modify', function () {
    
        var _this_id = $(this).attr("id");
       
      

    });


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
   var filecount = 0;
   var imagecount = 0;
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

               if ("/image/"+$("#ID").val() == path) {
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
       console.info("-----appendstr------------------------");
         console.info(appendstr);
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
	
function responseFunction(response) {
	//console.info(response+":jsonData");
	
	callback(response);
	//清空选择行数组
	aSelected = [];
}


})();