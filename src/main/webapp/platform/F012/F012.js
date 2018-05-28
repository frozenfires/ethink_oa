/* 密码修改 */
(function(){
	var options={    
		    rules:{
		    	PASSWORD:{required:true,rangelength:[5,16]},
		    	NEWPASSWORD:{required:true,rangelength:[5,16]},
		    	REPASSWORD:{required:true,rangelength:[5,16],equalTo:"#NEWPASSWORD"}
		    },
		    messages:{
		    	PASSWORD: {required:"请输入原密码！",rangelength:"原密码长度为5到16个字符！"},
		    	NEWPASSWORD: {required:"请输入新密码!",rangelength:"新密码长度为5到16个字符！"},
		    	REPASSWORD: {required:"请输入确认密码!",rangelength:"确认密码长度为5到16个字符！", 
		    		equalTo: "两次输入的新密码不一致，请重新输入！"}
		    }
		  };
	
function init(){
	$("#pwdForm").validate(options);

	$("#cancel").on("click", function() {
		View.hub();
	});
	
	
	$("#submit").on("click", function (){
		if($("#pwdForm").valid()){
			var jsonData = {};
			Util.addParameter(jsonData, "USER_ID_P", Config.currentUser);
			Util.addParameter(jsonData, "TYPE", "0"); // 0.修改密码 1.重置密码
			Util.addParameter(jsonData, "PASSWORD", $("#PASSWORD").val());
			Util.addParameter(jsonData, "NEWPASSWORD", $("#NEWPASSWORD").val());
			Util.addParameter(jsonData, "REPASSWORD", $("#REPASSWORD").val());
			Util.addParameter(jsonData, "SERVICE", "PasswordManagerService");
			Alert.processing("交易提交中，请稍候...");
			TranMng.submitServer(jsonData, function(result){
				Alert.processingCancel();
				if (result.SUCCESS) {
					Alert.success("修改密码成功，稍后请重新登录！", function(){
						logout();
					});
				} else {
					Alert.error(result.MESSAGE);
				}
			});
		}
	});
};
init();

$("#build_cancel").click(function(){
	View.hub();
})


/**
 * 退出登录
 */
function logout(){
	var jsonData = {};
	Util.addParameter(jsonData, "SERVICE", "logoutService");
	TranMng.submitServer(jsonData, function(resp){
		console.info('F012.logout:::resp:');
		console.info(resp);
		console.info('F012.logout:::跳转到登录页面...');
		parent.window.location.href = Config.basePath + "/login.html";
	});
}

})();