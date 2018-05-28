/**
 * 该文件中定义系统中用到的一些常量。
 */
(function(){
Config = window.Config || {basePath: ''};

// 当前皮肤。
Config.theme = "oa";//glbank768,default,psbc,nbdhbank,abchina,tlbank,zjkbank,sxnxs,cmbc
// 定义皮肤模版
Config.themeTemplete='blue';

// 系统事件处理
Config.event = {};

// 服务器时间,格式为：yyyy-MM-dd HH:mm:ss
Config.serverTime;

// 主页id 平台主页:adminMain,后屏主页：selfmngMain
Config.indexId = "oasystem";
// 主页列表
Config.indexList = [];
Config.indexList.push({NAME: "后屏首页", MODULE_ORDER: 1, ID: "selfmngMain", URL: "/selfmng/selfmngMain", STATUS: "1"});
Config.indexList.push({NAME: "后屏首页", MODULE_ORDER: 1, ID: "oasystem", URL: "/oa/oaMain", STATUS: "1"});

console.info("欢迎使用智慧网点现金管理系统");
console.info('config模块初始化成功...');
})();

