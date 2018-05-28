/**
 * 该文件中定义系统中用到的一些常量。
 */
(function(){

$.ajax( {
            "type": "GET", 
            "contentType": "application/json; charset=utf-8",
            "url": "../userinfo.do", 
            "dataType": "json",
            async: false, 
            "cache": false,
            "success": function(resp) {
                console.info(resp);
                saveConfig(resp);
            },
            "error": function(msg){
                console.error(msg);
                alert(msg);
            }
});

function saveConfig(userInfo){
   /**
     * 初始化全局对象。
     */
    window.Config =  {};
    Config.basePath = userInfo.basePath;
    Config.currentUser = userInfo.userid;
    Config.userName = userInfo.username;
    Config.org = userInfo.orgid;
    Config.orgName = userInfo.orgname;
    // 是否为机构管理员
    Config.orgAdmin = userInfo.orgadmin === '1';
    // 是否是双柜员模式
    Config.twoTeller = userInfo.twoTeller === 'true';
    // 是否启用额度控制
    Config.quotaControl = userInfo.quotaControl === 'true';
    // sessionId
    Config.sessionId = userInfo.sessionId;
    // 锁屏状态
    Config.lockStatus = userInfo.lockStatus;
    // 设备号
    Config.deviceId = userInfo.deviceId;
    Config.basePath = userInfo.basePath;
    
    console.info('global模块初始化成功...');
}

})();