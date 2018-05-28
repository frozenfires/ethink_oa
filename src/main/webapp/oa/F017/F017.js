//@ sourceURL=F017.js

(function(){
	
	$("input#START_TIME").on("mouseover",function(e){	
		   $("input#START_TIME").calendar({
				format : 'yyyy-MM-dd HH:mm',
				onSetDate : function (){					
				 } 
		  });
	});
	$("input#END_TIME").on("mouseover",function(e){	
		   $("input#END_TIME").calendar({
				format : 'yyyy-MM-dd HH:mm',
				onSetDate : function (){					
				 } 
		  });
	});
	
/**
 * 初始化方法
 */
var thisId;
var i=0;
$('#add_save').click(function(){
	add_save();
   });
function init(){
	$('#cancel').click(cancel);
	$('#a01,#a02').change(function(){
		thisId = $(this).attr('id');
		Alert.processing('文件正在上传，请稍候...');
		setTimeout(function(){
			ajaxFileUpload();
		},3000);
	});	
};
init();

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
    return uuid;
}
/**
 * 取消元素绑定事件
 */
function removeEvent(){
	$("#a01,#a02").unbind('change');
	$("#cancel").unbind('click');
}

//增加按钮保存
function add_save(){	 
//	 var flag= $("#addDealForm").valid();
//	 if(!flag){
//		 return;
//	 }

	 var formArray=$('#addDealForm').serializeArray();//查询条件
	 var jsonData=Util.formToJson(formArray);
	 	 jsonData.ID=uuid();
	 	 jsonData.WORKAPP_ID="1234567890";
	     Util.addParameter(jsonData,"SERVICE","CommonExecuteService");
	     Util.addParameter(jsonData,"DAO","TCRC_BASE_MANAGE_DAO");
	     Util.addParameter(jsonData,"SQLID","intMessage_deal");
	     TranMng.submitServer(jsonData, function(response){
	     if(response.SUCCESS){		
	    	 for(var j=0;j<i;j++){
	    		 console.info(j+"---------:"+$("#loc"+j).val());
	    		 var ui=uuid();
	    		 
	    		 var accName=$("#loc"+j).val();
	    		 var bb=accName.lastIndexOf("/");
	    		 var ACCESSORY_LOC=accName.substr(0,bb);
	    		 var ACCESSORY_NAME=accName.substr(Number(bb)+1);
	    		 jsonDataFile={'ACCESSORY_ID':ui,'COMMON_ID':jsonData.ID,'ACCESSORY_NAME':ACCESSORY_NAME,'ACCESSORY_LOC':ACCESSORY_LOC}
	    		 Util.addParameter(jsonDataFile,"SERVICE","CommonExecuteService");
	    	     Util.addParameter(jsonDataFile,"DAO","TCRC_BASE_MANAGE_DAO");
	    	     Util.addParameter(jsonDataFile,"SQLID","insert_Accessory");
	    	     TranMng.submitServer(jsonDataFile,function(resu){
	    	     console.info(resu);	    	    	
	    	     });		    	
	    	 }	    	
	    	 Alert.error("处理成功！");
	     }else{
	    	Alert.error("处理失败！");
	     }
	     });

}

////增加完成响应
//function response_add(response){
//	if(response.SUCCESS){	
//		Alert.error("处理成功！");
//	}else{
//		Alert.error("处理失败！");
//	}
//}


function ajaxFileUpload() {
	//debugger;
	var file = thisId;
	var imagePath = "/image";
	var filePath = "/file";
    $.ajaxFileUpload(
        {//这个是什么
            url: Config.basePath + '/file.do?method=uploads', //用于文件上传的服务器端请求地址
            secureuri: false, //是否需要安全协议，一般设置为false
            fileElementId: file, //文件上传域的ID
            dataType: 'text/html', //返回值类型 一般设置为json
            data:{
            	fiSize:5,
            	filePath:filePath,
            	imgPath:imagePath
            },
            success: function (data, status)  //服务器成功响应处理函数
            {
            	uploadResult(data, file);
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
function Filedelete(fileName,trueLoc) {
	jsonData={};
	Util.addParameter(jsonData,"SERVICE","DeleteFileService");
    Util.addParameter(jsonData,"fileName",fileName);
    Util.addParameter(jsonData,"trueLoc",trueLoc);
    TranMng.submitServer(jsonData,function(resu){
    console.info(resu);	    	    	
    });		
}


/**
 * 文件上传结果处理
 */
function uploadResult(data, file){
	var dataStr = data.substring(1,data.length-1);
	var dataArray = dataStr.split(',');	
	console.info("=========:"+dataArray);
	var successArray = dataArray[1].split('=');
	var success = successArray[1];
	Alert.processingCancel();
	var myData=dataArray[2].split('=')[1];
	var bb=myData.lastIndexOf("/");
	var fileloc=myData.substr(0,bb);
	var fileName=myData.substr(Number(bb)+1);
	//var trueLoc="/file";
	var trueLoc="/image";
	if(success == "true"){
		Alert.info("文件上传成功！");	
		//超链接下载文件，只需传入文件名跟文件的相对路径
//		$("#d1").append("<div style=''><input name='loc"+ i +"' id='loc"+ i +"' value="+ myData+" ><a href=/etoa/download.do?reportName="+ fileName +"&path="+ trueLoc +">下载</a><a href=/etoa/delete.do?reportName="+ fileName +"&path="+ trueLoc +">删除</a> </div>");
		$("#d1").append("<div style=''><input name='loc"+ i +"' id='loc"+ i +"' value="+ myData+" ><a href=/etoa/download.do?reportName="+ fileName +"&path="+ trueLoc +">下载</a><span class='tabsd' id='"+ fileName +","+ trueLoc +"'>删除</span> </div>");
			

		$(".tabsd").click(function(){
			alert($(this).attr("id"));
			Filedelete(fileName,fileloc);
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

})();

