var Common = window.Common || (function(document, $){

var that = {};
var tranEvent,
	parentConfig;

/**
 * 系统初始化
 * systemId： 系统id
 */
that.init = function(systemId) {
	extendParentObject();
	tranEvent = parentConfig.event[systemId];
	tranEvent.trigger = viewTrigger;
	initControls();
	regCommonEvent();

	if(tranEvent.current.status !== 'opened'){
		viewTrigger(tranEvent.current);
	}
}

//----------------------私有方法分割线----------------------------------------------------------

/**
 * 继承父窗口对象
 */
function extendParentObject (argument) {
	parentConfig = parent.Config;
	_.extend(window.Config, parentConfig);
	window.View = window.parentView = getParentView();
	console.debug(parentConfig);
	// console.debug('extendParentObject.Config=' + jsonUtil.toString(parentConfig));
	// console.debug('windowConfig=' + jsonUtil.toString(Config));
}

/**
 * 视图切换触发器
 */
function viewTrigger (currentObj) {
	currentObj.status = 'openning';
	_View.open(currentObj.viewid, function(){
		currentObj.status = 'opened';
	});
}

/**
 * 定制视图控制器
 */
function getParentView (argument) {
	var systemMng = parent.Systemmng;
	return {
		hub: function(){
			systemMng.hub();
		},
		open: function(viewid){
			systemMng.open(viewid);
		},
        tranLinkOpen: function(viewId, data){
			_View.tranLinkOpen(viewId, data);
		}
	};
}

function initControls (argument) {
	console.debug("初始化控件...");
	try{
		initAccordion();
	}catch(e){}
	try{
		initSelect();
	}catch(e){alert("初始化下拉列表控件出错");}
	try{
		initDateinput();
	}catch(e){alert("初始化日历控件出错");}	

}
that.initControls = initControls;


/**
 * 初始化日历控件
 */
function initDateinput (argument) {
	var items = $('input.date');
	if(items.length > 0){
		items.calendar({  format:'yyyy-MM-dd HH:mm' });
	}	
}

/**
 * 初始化伸缩面板控件
 */
function initAccordion (argument) {

	var trigger = $('.collapse .accordion-toggle:not(.locked)');
	trigger.die("click");
	trigger.live('click', function(){
		var content = $(this).next();
		if(content.length > 0){
			content.toggle('normal', 'linear');
		}
	});

	var triggerLocked = $('.collapse .accordion-toggle.locked');
	triggerLocked.next().show();
	// }catch(e){}
}

/**
 * 给下拉列表绑定事件
 */
function selectEvent(){
	$('.select a').live('click', function(){
		var value = this.value || $(this).attr('value'),
			text = this.innerText;
		var sa = $(this).closest('.select');
		sa.find('.item').text(text);
		sa.attr('value', value)
			.attr('text', text)
			.change();
	});
}

/**
 * 初始化下拉列表控件。
 */
function initSelect (argument) {
	$('.select').each(function(){
		var selectObj = $(this);
		selectObj.find('.options a').each(function(){
			var value = this.value || $(this).attr('value'),
				text = this.innerText,
				isDefault = $(this).attr('default');
			if(isDefault === '' || isDefault === true || isDefault === 'true'){
				isDefault = $(this).attr('default');
				selectObj.selectValue(value);
				return false;
			}
		});
	});
}

/**
 * 初始化数据网格
 */
function tableEvent (argument) {
  	$('table.selectable tbody tr').live('click', function(){
  		var parentTbody = $(this).parent('tbody');
  		var seleted = parentTbody.find('.row_selected');
  		//如果当前选中行已经有class类名称为：row_selected
		if ( $(this).hasClass('row_selected') ) {
			// 若当前行已被选中， 则反选当前行即可(去除当前选中行的class类名row_selected)
	        $(this).removeClass('row_selected');
	    }
	    else {
	        // 取消所有选中行，并选中当前行()
	        parentTbody.find('tr.row_selected').removeClass('row_selected');
	        //给当前选中行增加类名称为：row_selected的class属性
	        $(this).addClass('row_selected');
	    }
	});
}

/**
 * 注册公共事件。
 */
function regCommonEvent (argument) {
	$(".footer .icontext").live('click', function(){
		console.debug('.代理出发 对应的a标签方法');
		$(this).prev('a').click();
	});

	$(".header #logout").live('click', function(){
		if(View.current() !== 'hub'){
			window.alert('请先退出当前交易，再进行操作');
		}
		else if(window.confirm('您确定要退出系统吗？')){
			Common.logout();
		}
	} );
	
	$(".header #changePwd").live('click', function (){
		View.tranLinkOpen('F012');
	});
	tranopenEvent();
	selectEvent();
	tableEvent();
}

/**
 * 全局注册交易打开按钮
 */
function tranopenEvent (argument) {
	$('a.tranopen').live('click', function(){
		parentView.open(this.id);
	});
}

document.onkeydown = function() {
	 // 如果按下的是退格键
	  if(event.keyCode == 8) {
	     // 如果是在textarea内不执行任何操作
	    if(event.srcElement.tagName.toLowerCase() != "input"  && event.srcElement.tagName.toLowerCase() != "textarea" && event.srcElement.tagName.toLowerCase() != "password")
	        event.returnValue = false; 
	    // 如果是readOnly或者disable不执行任何操作
	  	if(event.srcElement.readOnly == true || event.srcElement.disabled == true) 
	            event.returnValue = false;                             
	  }
};


console.info('Common模块初始化成功...');
return that;
}(document, window.jQuery));
window.Common = Common;