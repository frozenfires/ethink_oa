//@ sourceURL=F013.js
/* 密码修改 */
(function(){
	
	var options={    
		    rules:{
		    	USER_ID_P:{required:true},
		    	
		    },
		    messages:{
		    	USER_ID_P: {required:"请输入柜员号!"},
		    	
		    }
		  };
	
function init(){
	
	$("#pwdForm").validate(options);
	
	$("#cancel").on("click", function() {
		View.hub();
	});
	$("#build_cancel").click(function(){
		View.hub();
	})
	
	$("#submit").on("click", function (){
		if ($("#pwdForm").valid()) {
			var jsonData = {};
			Util.addParameter(jsonData, "USER_ID_P", $("#USER_ID_P").val());
			Util.addParameter(jsonData, "TYPE", "1"); // 0.修改密码 1.重置密码			
			Util.addParameter(jsonData, "SERVICE", "PasswordManagerService");
			Alert.processing("交易提交中，请稍候...");
			TranMng.submitServer(jsonData, function(result){
				Alert.processingCancel();
				if (result.SUCCESS) {
					Alert.success("重置密码成功，请通知柜员使用新密码！", function(){
						View.hub();
					});
				} else {
					Alert.error(result.MESSAGE);
				}
			});
		}
	});
	
};
init();

})();