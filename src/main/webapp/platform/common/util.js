/**
 * 定义常用的工具方法。
 * 该工具里的方法不依赖任何除jquery外的包。
 */
var Util = window.Util || (function(document) {
   var that = {};

   /**
    * 获取cookie信息
    */
   that.getCookie = function(cookieId){
    var arr = document.cookie.match(new RegExp("(^| )"+cookieId+"=([^;]*)(;|$)"));
    var ret;
    if(arr != null){
      ret = unescape(arr[2]);
      if((typeof ret).toLowerCase() === 'string' && (
        ret.indexOf('{') === 0 || ret.indexOf('[') === 0)){
        ret = JSON.parse(ret);
      }
    }else 
      ret = null;

    return ret;
   }

   /**
    * 设置cookie信息
    */
   that.setCookie = function(cookieId, cookieContent){
    var content = '';
    if(typeof cookieContent !== 'string'){
      try{
        content = JSON.stringify(cookieContent);
      }catch(e){}
    }

    document.cookie = cookieId + "="+ escape(content);
   }

   /**
    * 从url中获取指定的参数
    * 如果没有此参数则返回 undefined
    */
   that.getUrlParam = function(paramName){
    if(document.location.search.length > 0){
      var arr = document.location.search.substring(1).split('&');
      for(var i=0; i<arr.length; i++){
        var items = arr[i].split('=');
        if(items.length >= 1){
          if(items[0] === paramName){
            return items.length >=2 ? items[1] : "";
          }
        }
      }
    }
   }
   
   /**
    * 对formarray 序列化成json对象
    */
   that.formToJson=function(formarray){ 
          var serializeObj={};  
          var array=formarray;  
         $(array).each(function(){ 
          if(serializeObj[this.name]){
              serializeObj[this.name]= serializeObj[this.name]+","+this.value;
          }else{
              serializeObj[this.name]=this.value; 
          }
         });  
         return serializeObj;  
       
      }; 
      
      /**
       * 增加参数
       * @param jsonData json对象
       * @param key 
       * @param value
       */
      that.addParameter=function(jsonData,key,value){
        jsonData[key]=value || '';
      };

      /**
       * 获取指定参数的值 
       */
      that.getParameter = function(jsonData,key){
          return jsonData[key];
      }
      
      /**
       * 回填界面数据
       * @param jsonData json 数据
       * @param formName  form表单名称
       */
      that.fillData=function(jsonData,formName){
        $('#'+formName+' input').val('');
         console.debug("$('#'+formName+' .select')=" + $('#'+formName+' .select').length);
        $('#'+formName+' .select').selectValue('');
          $.each(jsonData,function(key,value){
          var inputName="#"+formName+" #"+key;
          var inputObj = $(inputName);
          if(inputObj.hasClass('select')){
            inputObj.selectValue(value+'');
          }
          else if(inputObj.attr('type') === 'checkbox'){
            //value = value || '';
            console.debug("*********************");
            if(value === 'kong'){
              inputObj.attr("checked",false);  
            }else{
              inputObj.attr("checked",  value !== '');  
            }
          }else{
            inputObj.attr("value",value);
          }
          });
      };
   
   
      that.clearForm=function(formName){
           var form="#"+formName;
          $(':input',form).val('');   
      } ;
      
      //重置表单，清除输入验证错误提示信息
      that.resetForm=function(formName){
          var form="#"+formName;
          $('.modal-footer button:contains("关闭")').click(function(){
                var validate=$(form).validate();
                validate.resetForm();
               });
      };
      that.getSelectData=function(jsonData,selectData,selectName,key,value,filter){
             if(selectData!=null){
                 return;
             }
            $.ajax( {
                "type": "POST", 
                "contentType": "application/json; charset=utf-8",
                "url": Config.basePath + "/normal.do?method=doAction", 
                "dataType": "json",
                "data": JSON.stringify(jsonData), //以json格式传递
                "cache": false,
                "success": function(resp) {
                    fillSelectData(resp,selectName,key,value,filter); //服务器端返回的对象的returnObject部分是要求的格式
                }
            });
          
      };
   
      function fillSelectData(response,selectName,key,value,filter){
          var options = response.DATA;
        // 过滤options
        if($.isFunction(filter)){
          options = filter(options);
        }

          console.log(jsonUtil.toString(options));
          var selectname="span[name='" + selectName + "']";
          $(selectname).loadOption(options,key,value);
      }
/**
 * 获取当前时间戳
 */
that.currentMillise = function(){
  var x = new Date();
  return ''+x.getFullYear() + (x.getMonth() + 1) + x.getDate() + ' ' + x.getHours() + ':' + x.getMinutes() + ':' + x.getSeconds()  + ':' +  x.getMilliseconds();  
};

/**
 * 获取当前时间
 * 参数1：日期时间格式
 * 参数2：日期分隔符
 */
that.getCurrentTime = function(format,sign){
    var date = new Date(),
    y = date.getFullYear()+'',
    m = date.getMonth()+1 < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)+'',
    d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()+'',
    h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()+'',
    mi = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()+'',
    s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()+'',
    ms = date.getMilliseconds() < 10 ? '0' + date.getMilliseconds() : date.getMilliseconds();
    if(!sign){
    	sign = '';
    }
    if(format === "ymd"){
        return y + ''+sign+'' + m + ''+sign+'' + d;
    }else if(format === "ymdhmi"){
        return y + ''+sign+'' + m + ''+sign+'' + d + ' ' + h + ':' + mi;
    }else if(format === "ymdhmis"){
        return y + ''+sign+'' + m + ''+sign+'' + d + ' ' + h + ':' + mi + ':' + s ;
    }else if(format === "ymdhmisms"){
        return y + ''+sign+'' + m + ''+sign+'' + d + ' ' + h + ':' + mi + ':' + s + ':' + ms ;
    }else{
        return y + m + d + h + mi + s + ms;
    }
}


/**
 * 转换为int型数据
 */
that.parseInt = function(){
  var val = parseInt(arguments[0]);
  if(isNaN(val) && arguments.length >=2){
    var defval = arguments[1];
    val = defval;
  }
  
  return val;
}

/**
 *  金额相乘。
 */
that.amtMultiply = function(a, b){
   var m = parseFloat(a);
   m = isNaN(m) ? 0 : m;
   var n = parseFloat(b);
   n = isNaN(n) ? 0 : n;
   var z = that.floatMul(m, n);
   return that.formatAmt(z);
};

/**
 * 计算两个金额相加
 */
that.amtAdd = function (a, b) {
   var m = parseFloat(a);
   m = isNaN(m) ? 0 : m;
   var n = parseFloat(b);
   n = isNaN(n) ? 0 : n;
   var z = that.floatMul(m, 100) + that.floatMul(n, 100);
   return that.formatAmt(z / 100);
};

/**
 * 金额减法计算。
 */
that.amtMinus = function(a, b){
   var m = parseFloat(a);
   m = isNaN(m) ? 0 : m;
   var n = parseFloat(b);
   n = isNaN(n) ? 0 : n;
   var z = that.floatMul(m, 100) - that.floatMul(n, 100);
   return that.formatAmt(z / 100);
}

/**
 * 精确计算两个浮点型数据乘法。
 */
that.floatMul = function(arg1,arg2) { 
 var m=0,s1=arg1.toString(),s2=arg2.toString(); 
 try{m+=s1.split(".")[1].length}catch(e){} 
 try{m+=s2.split(".")[1].length}catch(e){} 
 return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m) 
};

/**
 * 格式化金额。
 */
that.formatAmt = function(amt){
   var famt = parseFloat(amt);
   if(isNaN(famt) || famt == 0){
      return "0.00";
   }
   else{
      famt = that.floatMul(famt, 100);
      famt = Math.round(parseFloat(famt)) + "";
      var amtstr = famt + "";
      var m = amtstr.substring(0, amtstr.length -2);
      var n = amtstr.substring(amtstr.length - 2, amtstr.length);
      m = m == "" ? "0" : m;
      return m + "." + n;
   }
};

/**
 * 格式化金额(去掉传入参数中的逗号)
 */
that.formatAmt2 = function(amt){
	if(amt == '?'){
		return '?';
	}
	var famt = parseFloat((amt).toString().replace(/,/g,''));
	if(isNaN(famt) || famt == 0){
		return "0.00";
	}
	else{
		famt = that.floatMul(famt, 100);
		famt = Math.round(parseFloat(famt)) + "";
		var amtstr = famt + "";
		var m = amtstr.substring(0, amtstr.length -2);
		var n = amtstr.substring(amtstr.length - 2, amtstr.length);
		m = m == "" ? "0" : m;
		return m + "." + n;
	}
};

/**
 * 格式化整数。
 */
that.formatInt = function(intstr){
   intstr = intstr=="" ? 0 : intstr;
   var patrn = /^-?\d+$/;// 整数
   if(! patrn.test(intstr)){
      Alert.error("非法数字["+intstr+"] 请录入整数" );
      intstr = 0;
   }
   if(intstr.length > Config.intLength){// 6
      Alert.error("数字长度不能超过"+Config.intLength+"位");
      intstr = 0;
   }   
   
   var famt = parseFloat(intstr);
   if(isNaN(famt)){
      return "0";
   }
   else{
      famt = famt < 0 ? 0 : famt;
      return Math.round(famt) + "";
   }
};

that.formatFloat = function(intstr){
       intstr = intstr=="" ? 0 : intstr;
       var patrn = /^[0-9]+([.]{1}[0-9]{1,2})?$/;// 整数
       if(! patrn.test(intstr)){
          Alert.error("非法数字["+intstr+"] 最多保留两位小数" );
          intstr = 0;
       }
       if(intstr.length > 10){// 6
          Alert.error("数字长度不能超过10位");
          intstr = 0;
       }   
      var famt = parseFloat(intstr);
          return famt + "";

    };

/**
 * 当前时间描述。
 */
that.current = function() {
  var dateObj = new Date();
  var date = "" + dateObj.getFullYear() + to2Str(dateObj.getMonth() + 1) + to2Str(dateObj.getDate());
  var time = "" + to2Str(dateObj.getHours()) + to2Str(dateObj.getMinutes()) + to2Str(dateObj.getSeconds());
  return {date:date, time:time};
};


/**
 * 将形如 yyyy-MM-dd hh:mm:ss 的日期，格式化为 yyyyMMddhhmmss 的形式
 */
that.parseDate = function(datestr){
   var result = [];
   try{
      var datearray = datestr.split(" ");
      var yyyymm = datearray[0].split("-");
      var hhmm = datearray[1].split(":");
      result.push(yyyymm[0]);
      result.push(to2Str(yyyymm[1]));
      result.push(to2Str(yyyymm[2]));
      result.push(to2Str(hhmm[0]));
      result.push(to2Str(hhmm[1]));
      if(hhmm.length >= 3){
        result.push(to2Str(hhmm[2]));
      }else{
        result.push("00");
      }
   }catch(e){
      console.error(e, "转换日期格式出错:["+datestr+"]");
   }   

   return result.join("");
};

/**
 * 将形如 yyyyMMddhhmmss 的日期，格式化为yyyy-MM-dd hh:mm:ss 的形式
 */
that.date2String = function(datestr){
   var yyyymm = [],hhmm = [];
   try{
      yyyymm.push(datestr.substring(0, 4));
      yyyymm.push(datestr.substring(4,6));
      yyyymm.push(datestr.substring(6,8));
      hhmm.push(datestr.substring(8,10));
      hhmm.push(datestr.substring(10,12));
      // hhmm.push(to2StrparseInt(datestr.substring(12,14))));
   }catch(e){
      console.error(e, "格式化日期出错:["+datestr+"]");
   } 
   
   return yyyymm.join("-") + " " + hhmm.join(":");
}

var dou = ",";
that.formatDou = function (str) {
      var nStr = str + '';
       if(typeof nStr == "string"  && nStr != "" && nStr.indexOf(dou) < 0
          && nStr.indexOf('<') < 0){
          if(nStr.indexOf('.') < 0 && !isNaN(parseFloat(nStr))){
            nStr = that.formatAmt(nStr);
          }

          var x = nStr.split('.');  
          x1 = x[0];  
          x2 = x.length > 1 ? '.' + x[1] : '';  
          var rgx = /(\d+)(\d{3})/;  
          while (rgx.test(x1)) {  
           x1 = x1.replace(rgx, '$1' + dou + '$2');  
          }  
          nStr = x1 + x2;
       }
       return nStr;
};

that.unformatDou = function (str) {
      // debug("unformatDou.... str=" + str);
      var ret = str;
     
      if(typeof ret == "string" && ret != "" && ret.indexOf(dou) > -1
          && ret.indexOf('<') < 0){
         ret = ret.split(dou).join("");
      }

      // debug("unformatDou... ret=" + ret);
      return ret;
};

// ticket 代表要出钞的张数 ， maxticket 是最大出钞张数
// 返回值有： 0  ---- 可以出钞
//            1  ---- 有出钞不足风险
//            2  ---- 出钞不足
var bShow = true;
that.checkReserve = function(ticket , maxticket ,obj)
{
    var checkResult = 0;
    var count = 0;
    count = maxticket * 100 /(Config.RecycleRate + 100);
    count = Math.ceil(count);


    if (maxticket < ticket) {
        checkResult = 2;
    }
    else if (count <= ticket )
    {
         checkResult = 1;
    }
    else
    {
      checkResult = 0;
    }

    // 边界处理， 如果最大张数为0 ， 或者 输入的金额为负数，则按正常处理
      if ((maxticket == 0) && (ticket <= 0))
      {
         checkResult = 0;
      }
      
    if (checkResult == 2){
      Alert.error("该面额张数不足，请重新配钞！");
      obj.value = 0;
      obj.style.borderColor=""
      obj.style.borderWidth= "";       

    }else if (checkResult == 1 )
    {
      if (Config.DealType == 2)
      {
        Alert.error("该面额有可能张数不足，请重新配钞！");
        obj.value = 0;
      }else if(Config.DealType == 1)
      {
        // 变颜色 +　气泡提示　
        //border-color: yellow;
        //border-width: 3px; 
        
        obj.style.borderColor="yellow"
        obj.style.borderWidth= "3px";

        if (bShow){
            $(obj).attr("data-container", "true");
            $(obj).attr("data-html", "true");
            $(obj).attr("data-toggle", "popover");
            $(obj).attr("data-placement", "top");
            $(obj).attr("data-content", createPopInfo(obj));
            $(obj).popover("show");     

            $(obj).data('popover').tip().on('click', '#noshow', function(evt){
                bShow = false;
                $(obj).popover("hide");
                $(obj).popover("destroy");
            })
        }

      }

    }else {
      //$(this).removeClass("ticketRiskNotice");
      obj.style.borderColor=""
      obj.style.borderWidth= "";     
    }
    return checkResult ;
}


function createPopInfo(obj)
{
    var bodyhtml = ['<div>输入框颜色变黄表示该面额可能会出钞不足。<br />' + 
                    '<button id="noshow" style="float: right;" class="btn btn-mini" type="button" align="right" >不再提示</button>'+
                    '</div>'];

    return bodyhtml.join("\n");
};


/**
 * 刷新元素内的文本数据。
 */
that.refreshText = function(selecter){
  $(selecter).each(function(){
    var thisObj = $(this);
    thisObj.text(thisObj.text());
  });
}

/**
 * 刷新元素的值。
 */
that.refreshVal = function(selector){
  $(selecter).each(function(){
    var thisObj = $(this);
    thisObj.val(thisObj.val());
  });
}

that.arrayAdd = function(arr1, arr2)
{
    var ret = [], obj2 = {};
    
    // 构造obj2 
    for(var i=0; $.isArray(arr2) && i<arr2.length; i++){
      var item = arr2[i];
      obj2[item.type] = item;
    }

    // 构造obj1 并且为ret填最终结果 ret 为 arr1 和arr2 一起
    for(var i=0; $.isArray(arr1) && i<arr1.length; i++){
      var item = arr1[i];
      if(obj2[item.type]){
        item.count = Util.parseInt(item.count, 0) + Util.parseInt(obj2[item.type].count, 0);
        delete obj2[item.type];
      }
      ret.push(item);
    }

    for ( type in obj2)
    {
        ret.push(obj2[type]);
    }
    return ret;
}

/**
 * 对关键数据进行加密
 */
that.encryptParameters = function(jsonData) {
  var encryptData = ['password', 'newpassword', 'repassword'];

  for(var i=0; i<encryptData.length; i++){
    var dataName = encryptData[i];
    if(jsonData[dataName]){
      jsonData[dataName] = $.md5(jsonData[dataName]);
      console.info('对敏感数据进行加密['+dataName+']');
    }
    else if(jsonData[dataName.toUpperCase()]){
      jsonData[dataName.toUpperCase()] = $.md5(jsonData[dataName.toUpperCase()]);
      console.info('对敏感数据进行加密['+dataName.toUpperCase()+']');
    }
  }
}


/**
 * 将一位字符转为2为字符，前面不够的补0.
 */
function to2Str(str){
   var result = "" + str;
   for(var i=0; i< 2 - result.length; i++){
      result = "0" + result;
   }

   return result;
};

/* 质朴长存法 */
that.pad = function(num, n) {
     var len = num.toString().length;
     while(len < n) {
         num = "0" + num;
         len++;
     }
     return num;
};

/* 质朴长存法 */
/*
direct : left 往左边补上padchar
direct : right 往右边补上padchar
*/
that.padExt = function(str, len, padchar,direct) {
  if(typeof str == 'undefined')
    return str;
  
    var currentlen = str.toString().length;
    while(currentlen < len) {
       if ("right" == direct){
           str = str + padchar;
       }else if ("left" == direct) {
           str = padchar + str;
       }
       currentlen++;
    }
    return str;
}


return that;
// Util定义结束。   
}(document));
window.Util = Util;         


/**
 * json对象工具类
 */
var jsonUtil = window.jsonUtil || (function(document) {
   var that = {};

that.parse = function(str){
  if(typeof str === "string" && 
      (str.indexOf('[') > -1 || str.indexOf('{') > -1)){
    try{
         return window.JSON.parse(str);
    }catch(e){
         try{
            return eval(str);
         }catch(e1){
            console.error(e1, "解析json字符串["+str+"]出错");
         }
    }
  }else{
    return str;
  }
};

that.toString = function(obj){
  if(typeof obj === "string"){
    return obj;
  }else{
    try{
        return window.JSON.stringify(obj);
      }catch(e){
         console.error(e, "序列化json对象出错");
         return e;
      }
  }      
};

   return that;
// Util定义结束。   
}(document));
window.jsonUtil = jsonUtil;