/**
 * Ebring 2003 copyright
 * 
 */
package com.ebring.platform.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.AccessException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ebring.tcrc.common.Global;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.UserInfo;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;

/**
 * 
 * 描述: 直接查找用户相关信息，无须校验。
 * 
 * @author wangjing.dc@qq.com
 */
@Controller
@RequestMapping("/authless.do")
public class AuthlessController extends AbstractController{

	private static final Logger log = Logger.getLogger(AuthlessController.class);
	
	@Autowired
	private ITcrcBaseManageDao tcrcBaseManageDao;

	
	@RequestMapping(params = "method=doAction", method = RequestMethod.GET)
	@ResponseBody
	public Object doGet(@RequestBody Map<String, Object> param,
			HttpServletRequest request) throws Exception {
		return doAction(param, request);
	}
	
	@RequestMapping(params = "method=doAction", method = RequestMethod.POST)
	@ResponseBody
	public Object doAction(@RequestBody Map<String, Object> param,
			HttpServletRequest request) throws Exception {
		
		if (log.isDebugEnabled()) {
			log.debug("AuthlessController 接收到的参数:" + param);
		}
		
		this.addCommonParameter(param, request);
		String serviceName = (String) param.get(Global.SERVICE);
		Result resultReturn = this.doServices(serviceName, param, request);

		return resultReturn.getResult();
	}

	@SuppressWarnings("unused")
	private String getRemoteAddress(HttpServletRequest request) {
		String ip = request.getHeader("x-forwarded-for");
		if (ip == null || ip.length() == 0 || ip.equalsIgnoreCase("unknown")) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || ip.equalsIgnoreCase("unknown")) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || ip.equalsIgnoreCase("unknown")) {
			ip = request.getRemoteAddr();
		}
		return ip;
	}

	/**
	 * 查找用户信息
	 * @param userid
	 * @param ip
	 * @return
	 * @throws AccessException
	 */
	private UserInfo getUserInfo(String userid, String ip) throws AccessException{
    	UserInfo userInfo=null;
    	
    	Map  parameterMap=new HashMap();
		parameterMap.put("USER_ID_P", userid);
		List<Map> list=tcrcBaseManageDao.selectUserDetail(parameterMap);
		if(list.size()>0){
			
			userInfo=new UserInfo();
			Map map=list.get(0);
			userInfo.setUserID(userid);
//			userInfo.setPassword((String)map.get("PASSWORD"));
			userInfo.setUserName((String)map.get("USER_NAME_P"));
			userInfo.setOrgID((String) map.get("org_id_p".toUpperCase()));
		}else{
			throw new AccessException("用户不存在");
		}
		Map  parameterMapAccount=new HashMap();
		parameterMapAccount.put("TERMINAL_IP", ip);
		List<Map> list_account=tcrcBaseManageDao.selectAccountFromIP(parameterMapAccount);
		if (list_account.size() > 0) {
			Map map = list_account.get(0);
			String account_id = (String) map.get("ACCOUNT_ID");
			String device_id = (String) map.get("DEVICE_ID");
			userInfo.setAccountID(account_id);
			userInfo.setDeviceID(device_id);
			parameterMapAccount.put("ACCOUNT_ID", account_id);
			parameterMapAccount.put("USER_ID", userid);

			// 账户解绑
			tcrcBaseManageDao.unbindAccountUser(parameterMapAccount);
			// 账户绑定
			tcrcBaseManageDao.updateUserAccount(parameterMapAccount);
			tcrcBaseManageDao.updateAccountUser(parameterMapAccount);
		}
		
		
		
    	return userInfo;
    }

	public void setTcrcBaseManageDao(ITcrcBaseManageDao tcrcBaseManageDao) {
		this.tcrcBaseManageDao = tcrcBaseManageDao;
	}

	@Override
	protected UserInfo findUserInfo(HttpServletRequest request,
			Map<String, Object> param) {
		UserInfo userInfo = new UserInfo();

		userInfo.setUserID("authlessController");
		userInfo.setUserName("authlessController");
		userInfo.setOrgID("1001");

		return userInfo;
	}

	@Override
	protected void checkServiceAuth(String serviceName) throws Exception {
		// no-op
		
	}
	
	
}
