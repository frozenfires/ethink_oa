package com.ebring.tcrc.trans.common.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.apache.shiro.web.session.mgt.DefaultWebSessionManager;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;

public class SSOService implements IService{
	
	private static final Logger log = Logger.getLogger(SSOService.class);
	
	@Override
	public Result execute(Map<String, Object> parameterMap) {
		
		if (log.isDebugEnabled()) {
			log.debug("SSOService 接收到的参数：" + parameterMap);
		}
		
		Result result = new Result();
		Session session = null;
		try {
			String sk = (String) parameterMap.get("sessionId");
			
			DefaultWebSecurityManager mng = (DefaultWebSecurityManager) SecurityUtils.getSecurityManager();
			
			DefaultWebSessionManager dsm = (DefaultWebSessionManager) mng.getSessionManager();
			
			Collection<Session> sessions = dsm.getSessionDAO().getActiveSessions();
			
			Iterator<Session> it = sessions.iterator();
			while(it.hasNext()){
				Session sess = it.next();
				if(sk.equals(sess.getId().toString())){
					session = sess;
					break;
				}
			}
			//验证成功时，返回用户的相关信息
			if(session != null){
				result.setSuccess(true);
				String userInfo = session.getAttribute("UserInfo").toString();
				String[] array = userInfo.substring(1,userInfo.length()-1)
						.replaceAll("=", ",").replaceAll(" ", "").split(",");
				List<String> key = new ArrayList<String>();
				List<String> value = new ArrayList<String>();
				Map<String,String> map = new HashMap<String,String>();
				if(array.length%2 == 0){
					for (int i = 0; i < array.length; i++) {
						if(i%2==0){
							key.add(array[i]);
						}else{
							value.add(array[i]);
						}
					}
					for (int j = 0; j < key.size(); j++) {
						map.put(key.get(j), value.get(j));
					}
				}else{
					log.error("用户信息参数不足...");
				}
				
				result.setContent(map);	
				result.setMessage("success...");
				
			}
			
		} catch (Exception e) {
			// TODO: handle exception
			result.setSuccess(false);
			result.setContent(session.getAttribute("UserInfo"));
			result.setMessage("error...");
			e.printStackTrace();
		}
	
		return result;
	}

}
