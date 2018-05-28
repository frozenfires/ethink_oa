package com.ebring.platform.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ebring.tcrc.common.Global;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.UserInfo;

/**
 * 普通交易所用的Controller
 * 
 * @author
 * 
 */
@Controller
@RequestMapping("/normal.do")
public class NormalController extends AbstractController{

	private static final Logger log = Logger.getLogger(NormalController.class);

	
	@RequestMapping(params = "method=doAction", method = RequestMethod.POST)
	@ResponseBody
	public Object doAction(@RequestBody Map<String, Object> param,
			HttpServletRequest request) throws Exception {
		
		try{
			return this.execServices(param, request);
		}catch(Exception e){
			log.error(null, e);
			throw new Exception("NormalController系统错误");
		}
		
	}
	
	/**
	 * 执行请求的服务
	 * @param param
	 * @param request
	 * @return
	 * @throws Exception
	 */
	private Object execServices(Map<String, Object> param,HttpServletRequest request) throws Exception {
		if (log.isDebugEnabled() && !"LogWriteService".equals(param.get("SERVICE"))) {
			log.debug("NormalController 接收到的参数:" + param);
		}
		
		this.addCommonParameter(param, request);
		String serviceName = (String) param.get(Global.SERVICE);
		Result resultReturn = this.doServices(serviceName, param, request);
		
		return resultReturn.getResult();
	}

	@Override
	protected UserInfo findUserInfo(HttpServletRequest request, Map<String, Object> param) {
		Subject currentUser = SecurityUtils.getSubject();

		UserInfo userInfo = (UserInfo) currentUser.getSession().getAttribute(
				"UserInfo");
		
		return userInfo;
	}

	@Override
	protected void checkServiceAuth(String serviceName) throws Exception {
		if (!"loginService".equals(serviceName)
				&& !SecurityUtils.getSubject().isAuthenticated()) {
			
			throw new Exception("登录超时");
		}
	}

}
