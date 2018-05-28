(function(){

function loadCss(){

	document.write('<link rel="shortcut icon" href="'+Config.basePath+'/platform/theme/images/favicon.ico">');
	document.write('<link rel="stylesheet" type="text/css" href="'+Config.basePath+'/platform/theme/bootstrap.css">');
	document.write('<link rel="stylesheet" type="text/css" href="'+Config.basePath+'/platform/theme/bootstrap-responsive.css">');
	document.write('<link rel="stylesheet" type="text/css" href="'+Config.basePath+'/platform/theme/datatable_page.css">');
	document.write('<link rel="stylesheet" type="text/css" href="'+Config.basePath+'/platform/theme/datatable_table.css">');
	document.write('<link rel="stylesheet" type="text/css" href="'+Config.basePath+'/platform/theme/ztree/zTreeStyle/zTreeStyle.css">');
	// document.write('<script type="text/javascript" src="js/jquery-1.8.2.js"></script>');
	document.write('<!--[if lte IE 6]>');
	document.write('<link rel="stylesheet" type="text/css" href="'+Config.basePath+'/platform/theme/bootstrap-ie6.css">');
	document.write('<script type="text/javascript" src="'+Config.basePath+'/platform/lib/bootstrap-ie.js"></script>');
	document.write('<![endif]-->');
	document.write('<!--[if lte IE 7]>');
	document.write('<link rel="stylesheet" type="text/css" href="'+Config.basePath+'/platform/theme/ie.css">');
	document.write('<![endif]-->');
	document.write('<link rel="stylesheet" type="text/css" href="'+Config.basePath+'/platform/theme/ebring.css">');
	document.write('<link rel="stylesheet" type="text/css" href="'+Config.basePath+'/platform/theme/frame.css">');

	// 加载皮肤模版
	document.write('<link rel="stylesheet" type="text/css" href="'+Config.basePath+'/platform/theme/templete/'+Config.themeTemplete+'/bootstrap-responsive.css">');
	document.write('<link rel="stylesheet" type="text/css" href="'+Config.basePath+'/platform/theme/templete/'+Config.themeTemplete+'/ebring.css">');
	document.write('<!--[if lte IE 6]>');
	document.write('<link rel="stylesheet" type="text/css" href="'+Config.basePath+'/platform/theme/ebring-ie.css">');
	document.write('<link rel="stylesheet" type="text/css" href="'+Config.basePath+'/platform/theme/templete/'+Config.themeTemplete+'/ebring-ie.css">');
	document.write('<![endif]-->');
	document.write('<!--[if lte IE 8]>');
	document.write('<link rel="stylesheet" type="text/css" href="'+Config.basePath+'/platform/theme/ebring-ie8.css">');
	document.write('<![endif]-->');

	// 加载风格皮肤
	document.write('<link rel="stylesheet" type="text/css" href="'+Config.basePath+'/platform/theme/'+Config.theme+'/theme.css">');
	
}
loadCss();

})();