package com.ebring.platform.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ebring.platform.common.context.SpringBeanProxy;
import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Global;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;


/**
 * 
 * 处理子系统端登录验证的Controller
 * 
 * 
 */
@Controller
@RequestMapping("/ssovalidate.do")
public class SSOController {
	
	private static final Logger log = Logger.getLogger(SSOController.class);
	
	@RequestMapping(params = "method=doAction", method = RequestMethod.POST)
	@ResponseBody
	public Object doAction(@RequestBody Map<String, Object> param, 
			HttpServletRequest request) throws Exception{
		if (log.isDebugEnabled()) {
			log.debug("SSOController 接收到的参数：" + param);
		}
		
		//添加公共信息
		//addCommonParameter();
//		param.put("clientSessionId",request.getRequestedSessionId());
//		param.put("LOGTIME", getCurrentTime());
//		param.put("USER_IP", Util.getClientIP(request));
		
		String serviceName = (String) param.get(Global.SERVICE);
		Result resultReturn = new Result();
		boolean success = true;
		StringBuffer message  = new StringBuffer("");
		Map contentMap = new HashMap();
		if (serviceName != null) {
			String[] services = serviceName.split(",");
			for (int i = 0; i < services.length; i++) {
				String singleServiceName = services[i];
				IService service = (IService) SpringBeanProxy.getBean(services[i]);
				Result result = service.execute(param);
				if (!result.isSuccess()) {
					success = false;
					if (!message.toString().equals("")) {
						message.append(",");
					}
				}
				message.append(result.getMessage());
				if (log.isDebugEnabled()) {
					log.debug("services[i] 返回的内容:" + result.getResult());
				}
				if (services.length == 1) {
					resultReturn.setContent(result.getContent());
				} else {
					contentMap.put(singleServiceName, result.getContent());
				}
			}
			resultReturn.setSuccess(success);
			resultReturn.setMessage(message.toString());
		}
		if (log.isDebugEnabled()) {
			log.debug("services[i] 返回的内容:" + resultReturn.getResult());
		}
		return resultReturn.getResult();
	}
	
	private String getCurrentTime() {
		java.text.DateFormat format = new java.text.SimpleDateFormat(
				"yyyy-MM-dd HH:mm:ss");
		String time = format.format(new Date());
		return time;
	}
}
