/**
 * Ebring 2003 copyright
 * 
 */
package com.ebring.platform.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.GlobalTcrc;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.UserInfo;
import com.ebring.tcrc.common.Util;

/**
 *
 * 描述: 
 * @author wangjing.dc@qq.com
 */
public abstract class AbstractController {
	public static class DefaultController extends AbstractController{
		@Override
		protected UserInfo findUserInfo(HttpServletRequest request,
				Map<String, Object> param) {
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


	private static final Logger log = Logger.getLogger(AbstractController.class);
	
	@Autowired
	private ApplicationContext context;
	
	/**
	 * 执行请求的服务
	 * @param param
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public Result doServices(String serviceName, Map<String, Object> param,
			HttpServletRequest request) throws Exception {
		
		Result resultReturn = new Result();
		
		try{
			if (serviceName == null || "".equals(serviceName)) {
				throw new Exception("没有可执行的服务...");
			}

			// 检查服务执行权限
			checkServiceAuth(serviceName);
		}catch(Exception e){
			resultReturn.setMessage(e.getMessage());
			resultReturn.setSuccess(false);
			return resultReturn;
		}

		boolean success = true;
		StringBuffer message = new StringBuffer("");
		Map<String, Object> contentMap = new HashMap<String, Object>();
		Map<Object, Object> serverTime;

		// 可执行多个服务
		String[] services = serviceName.split(",");
		for (int i = 0; i < services.length; i++) {
			String singleServiceName = services[i];
			IService service = (IService) context.getBean(services[i]);
			Result result = service.execute(param);
			if (result.getContent() != null
					&& result.getContent() instanceof Map) {
				serverTime = (Map<Object, Object>) result.getContent();
				serverTime.put("SERVERTIME", getCurrentTime());
			}
			if (!result.isSuccess()) {
				success = false;
				if (!message.toString().equals("")) {
					message.append(",");
				}
				message.append(result.getMessage());
			}
			if (log.isDebugEnabled()) {
				// log.debug("services[i] 返回的内容:" + result.getResult());
			}
			if (services.length == 1) {
				resultReturn.setContent(result.getContent());
			} else {
				contentMap.put(singleServiceName, result.getContent());
			}
		}

		resultReturn.setSuccess(success);
		resultReturn.setMessage(message.toString());

		return resultReturn;
	}

	/**
	 * 添加公共参数
	 * @param param
	 * @param request
	 */
	protected void addCommonParameter(Map<String, Object> param, HttpServletRequest request) {
		
		param.put(GlobalTcrc.PARAM_LOGTIME, getCurrentTime());
		param.put(GlobalTcrc.PARAM_USER_IP, Util.getClientIP(request));
		param.put(GlobalTcrc.PARAM_REALPATH, request.getSession().getServletContext().getRealPath(""));
		
		UserInfo userInfo = findUserInfo(request, param);
		// 暂放临时数据
		if (userInfo != null) {
			param.put(GlobalTcrc.PARAM_USER_ID, userInfo.getUserID());
			param.put(GlobalTcrc.PARAM_USER_NAME, userInfo.getUserName());
			param.put(GlobalTcrc.PARAM_ORG_ID, userInfo.getOrgID());
			param.put(GlobalTcrc.PARAM_ORG_NAME, userInfo.getOrgName());
			param.put(GlobalTcrc.PARAM_DEVICE_ID, userInfo.getDeviceID());
			param.put(GlobalTcrc.PARAM_ACCOUNT_ID, userInfo.getAccountID());
			param.put(GlobalTcrc.PARAM_ORG_ADMIN, userInfo.getOrgAdmin());
		}
		
	}
	
	/**
	 * 查找当前用户信息
	 * @param request
	 * @param param 
	 * @return
	 */
	protected abstract UserInfo findUserInfo(HttpServletRequest request, Map<String, Object> param);
	
	/**
	 * 检查是否有执行当前服务的权限。 如果无权限应该抛出异常Exception
	 * @param serviceName
	 * @throws Exception 无权限原因在Exception的msg中说明
	 */
	protected abstract void checkServiceAuth(String serviceName) throws Exception;

	
	/**
	 * 获取当前时间。
	 * @return
	 */
	protected String getCurrentTime() {
		java.text.DateFormat format = new java.text.SimpleDateFormat(
				"yyyy-MM-dd HH:mm:ss");
		String time = format.format(new Date());
		return time;
	}


}
