//@ sourceURL=adminMain.js
(function(){
	
/**
 * 初始化
 */
function init (){
	loginInfo();
	buildMaxVisited();
}
/**
 * 获取当前的时间段
 */
function getGreetings(){
	var now = new Date(),hour = now.getHours(); 
	if(hour < 6){return "凌晨好";}
	else if (hour < 9){return "早上好";}
	else if (hour < 12){return "上午好";}
	else if (hour < 14){return "中午好";}
	else if (hour < 17){return "下午好";}
	else if (hour < 19){return "傍晚好";}
	else if (hour < 22){return "晚上好";}
	else {return "夜里好";} 
}

/**
 *	获取当前日期时间 
 */
function getDate(){
	var date, dateTime = "";
	var x = new Array("星期日", "星期一", "星期二","星期三","星期四", "星期五","星期六");
	date = new Date();
	dateTime += date.getFullYear()+"年"+(date.getMonth() + 1)+"月"+date.getDate()+"日  ";
	dateTime += x[date.getDay()];
	return dateTime;
}

/**
 * 问候语
 * 
 */
function greetings(){
	$('.greetings').text(getGreetings());
	return true;
}

/**
 * 每隔十秒检查一下问候语和日期
 */
function checkInfo(){
	greetings();
	$('.time').text(getDate());
	return true;
}

/**
 * 显示页面登录信息
 */
function loginInfo(){
	greetings();
	setInterval(checkInfo, 60000);
	$('.userId').text(Config.userName);
	$('.time').text(getDate());
	$('.orgName1').text(Config.orgName);
	return true;
	
}

function buildMaxVisited (argument) {
	var visited = Util.getCookie(Config.currentUser + '_visitedTrans');
	console.debug('buildLastVisited:%o', visited);
	if(visited){
		var tranarr = [];
		for(tranid in visited){
			if(!tranid || tranid === 'undefined'){
				// no-op

			}
			else if(tranid !== 'adminMain')
				tranarr.push({'id': tranid, 'sort':visited[tranid]});
		}
		var sorted = tranarr.sort(function(a, b){
			return b.sort -a.sort;
		});

		var visitedHtml = [];
		for(var i=0; i<tranarr.length && i<8; i++){
			var item = tranarr[i];
			if(Config.tranProp[item.id])
				visitedHtml.push("<a id='"+item.id+"' href=\"javascript:void(0);\" class='tranopen menucolor"+i+"'>"+Config.tranProp[item.id].NAME+"</a>");
		}

		$('.tranClass #tranItem').html(visitedHtml.join('\n'));
	}
}

init();
	
	
}())