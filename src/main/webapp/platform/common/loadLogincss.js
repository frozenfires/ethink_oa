(function(){

function loadCss(){

	document.write('<link rel="stylesheet" type="text/css" href="'+Config.basePath+'/platform/theme/bootstrap.css">');
	// document.write('<script type="text/javascript" src="js/jquery-1.8.2.js"></script>');
	document.write('<!--[if lte IE 6]>');
	document.write('<link rel="stylesheet" type="text/css" href="'+Config.basePath+'/platform/theme/bootstrap-ie6.css">');
	document.write('<script type="text/javascript" src="'+Config.basePath+'/platform/lib/bootstrap-ie.js"></script>');
	document.write('<![endif]-->');
	document.write('<!--[if lte IE 7]>');
	document.write('<link rel="stylesheet" type="text/css" href="'+Config.basePath+'/platform/theme/ie.css">');
	document.write('<![endif]-->');

	document.write('<link rel="stylesheet" type="text/css" href="'+Config.basePath+'/platform/theme/'+Config.theme+'/bootstrap-responsive.css">');
	document.write('<!--[if lte IE 6]>');
	document.write('<link rel="stylesheet" type="text/css" href="'+Config.basePath+'/platform/theme/'+Config.theme+'/ebring-ie.css">');
	document.write('<![endif]-->');
	document.write('<link rel="stylesheet" type="text/css" href="'+Config.basePath+'/platform/theme/'+Config.theme+'/login.css">');
	document.write('<link rel="shortcut icon" href="'+Config.basePath+'/platform/theme/images/favicon.ico">');
}
loadCss();

})();