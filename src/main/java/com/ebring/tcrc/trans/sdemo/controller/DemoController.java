package com.ebring.tcrc.trans.sdemo.controller;

import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ebring.tcrc.trans.sdemo.service.DemoService;


@Controller
@RequestMapping("/demo.do")  
public class DemoController {


private DemoService demoService;

public DemoController(){
	System.out.println("DemoController init..."); 
}

@RequestMapping(params = "method=add",method = RequestMethod.POST)   
@ResponseBody  
public   Map<String,Object> add(HttpServletRequest request, ModelMap modelMap) throws Exception{   
	System.out.println("this is DemoController add ..");
	Map map=request.getParameterMap();
	map=convertoMap(map);
	
	 this.demoService.insert();
	 String json="{ok:'ok',chinese:'你好吗'}";
	 
	 Map<String,Object> returnMap=new HashMap<String,Object>();
	 returnMap.put("aabc", "aabc");
	 returnMap.put("abc", "你好吗");
	 
    return returnMap;   
}   


@RequestMapping(params = "method=query",method = RequestMethod.POST)   
@ResponseBody  
public   String query(HttpServletRequest request, ModelMap modelMap) throws Exception{   
	System.out.println("this is DemoController query ..");
	Map map=request.getParameterMap();
	map=convertoMap(map);
	
	 this.demoService.insert();
	 String json="{\"total\":\"20\",\"page\":\"20\",\"records\":\"10\",\"rows\":[{\"id\":\"1\",\"cell\":[1,2,3,5,6,7]}," +
	 		"{\"id\":\"2\",\"cell\":[2,2,3,5,6,7]},"+
	 		"{\"id\":\"3\",\"cell\":[3,2,3,5,6,7]},"+
	 		"{\"id\":\"4\",\"cell\":[4,2,3,5,6,7]},"+
	 		"{\"id\":\"5\",\"cell\":[5,2,3,5,6,7]},"+
	 		"{\"id\":\"6\",\"cell\":[6,2,3,5,6,7]},"+
	 		"{\"id\":\"7\",\"cell\":[7,2,3,5,6,7]},"+
	 		"{\"id\":\"8\",\"cell\":[8,2,3,5,6,7]},"+
	 		"{\"id\":\"9\",\"cell\":[9,2,3,5,6,7]},"+
	 		"{\"id\":\"10\",\"cell\":[10,2,3,5,6,7]}"+
	         "]}"; 
	 Map<String,Object> returnMap=new HashMap<String,Object>();
	 returnMap.put("aabc", "aabc");
	 returnMap.put("abc", "你好吗");
	 
    return json;   
}   




@RequestMapping(params = "method=push",method = RequestMethod.POST)   
@ResponseBody  
public  String push(HttpServletRequest request, ModelMap modelMap) throws Exception{   
	System.out.println("this is DemoController push ..");
	Map map=request.getParameterMap();
	map=convertoMap(map);
	sendMessageAuto("dd",(String)map.get("age"));
	 
    return "{aa,'aa'}";   
}   


public void sendMessageAuto(String userid,String message) {

    final String userId = userid ;

    final String autoMessage = message;

//    Browser.withAllSessionsFiltered(new ScriptSessionFilter() {
//
//           public boolean match(ScriptSession session) {
//
//               
//                         return true;
//
//           }
//
//    }, new Runnable(){
//
//           private ScriptBuffer script = new ScriptBuffer();
//
//           public void run() {
//
//                  script.appendCall("showMessage", autoMessage);
//
//                  Collection<ScriptSession> sessions = Browser
//
//                  .getTargetSessions();
//
//                  for (ScriptSession scriptSession : sessions) {
//
//                         scriptSession.addScript(script);
//
//                  }
//
//           }
//
//          
//
//    });

}


/**
 * 对从页面提交的form中作转换
 * 
 * @param map
 * @return
 */
public Map convertoMap(Map map) {
	Map returnMap = new HashMap();
	Iterator it = map.entrySet().iterator();
	while (it.hasNext()) {
		Map.Entry entry = (Map.Entry) it.next();
		returnMap.put(entry.getKey(), checkNULL(((String[]) entry
				.getValue())[0]));
	}
	return returnMap;
}

/**
 * 取出null值
 * 
 * @param object
 * @return
 */
public String checkNULL(Object object) {
	if (object == null)
		return "";
	else
		return object.toString();
}

}
