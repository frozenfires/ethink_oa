package com.ebring.tcrc.trans.pad;

import java.util.Collection;
import java.util.Map;

import org.apache.log4j.Logger;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;


/**
 * 服务端推送服务
 * 用于把服务器端的数据、信息推送给客户端
 * 基于dwr完成
 * @author zhigq
 *
 */
public class ServerPushService implements IService {
	private static final Logger log = Logger.getLogger(ServerPushService.class);

	@Override
	public Result execute(Map<String, Object> parameterMap) {

		String user_id=(String)parameterMap.get("USER_ID");
		String push_data=(String)parameterMap.get("PUSH_DATA");//推送的数据
		String call_function=(String)parameterMap.get("CALL_FUNCTION");//调用客户端的方法(函数)
		String pushTo=(String)parameterMap.get("PUSH_TO");//推送给谁)
		
		serverPush(user_id,call_function,push_data,pushTo);
		return new Result();
	}

	/**
	 * 服务器端推送
	 * @param userid　用户
	 * @param call_function　　调用客户端的方法（JS）
	 * @param push_data　推送的数据
	 */
	public void serverPush(String userid,String call_function, String push_data,String pushTo) {

	    final String userId = userid ;
	    final String callFunction = call_function;
	    final String pushData = push_data;
	    final String push_to=pushTo;

//	    Browser.withAllSessionsFiltered(new ScriptSessionFilter() {
//
//	           public boolean match(ScriptSession session) {
//	                         return true;
//	           }
//
//	    }, new Runnable(){
//
//	           private ScriptBuffer script = new ScriptBuffer();
//
//	           public void run() {
//
//	                  script.appendCall(callFunction, pushData);
//	                  Collection<ScriptSession> sessions = Browser.getTargetSessions();
//	                  String loginId="tellerid";
//	                  if("PAD".equals(push_to)){
//	                	  loginId="userid";
//	                  }
//	                  
//	                  log.info("sessions："+sessions);
//	                  boolean pushSuccessed = false;
//	                  for (ScriptSession scriptSession : sessions) {
//	                	  
//	                	  log.info("ServerPushService..userId:"+userId+",loginId:"+scriptSession.getAttribute(loginId));
//	                	  
//	                	 if(userId.equals(scriptSession.getAttribute(loginId))){
//	                		 log.info("向" + push_to + "推送消息:" + script);
//	                		 scriptSession.addScript(script);
//	                		 pushSuccessed = true;
////	                		 break;
//	                	 }
//	                  }
//	                  
//	                  if(!pushSuccessed){
//	                	  log.error("向" + push_to + "推送消息失败，原因："+userId+"的登录session失效,请关闭浏览器后重新登录");
//	                  }
//	           }
//	    });

	}

	
}
