(function(){
	
function init(){
	$('#docancel').click(cancel);
	$('#export').click(_export);
}

init();

/**
 * 交易取消
 */
function cancel (argument) {
	View.hub();
}

/*
 * 导出日志文件
 */
function _export(){
	Alert.processing("正在导出，请稍候...");
	var jsonData = {};
	Util.addParameter(jsonData, "SERVICE", "exportSysLogService");
	TranMng.submitServer(jsonData, function(result){
		if (result.SUCCESS) {
			Alert.processingCancel();

			document.getElementById('downIframe').src = encodeURI(encodeURI("../../download.do?reportName=" + result.reportName));
		}
	});
}

}());
