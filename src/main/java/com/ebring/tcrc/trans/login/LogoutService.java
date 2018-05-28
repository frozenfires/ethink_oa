/**
 * Ebring 2003 copyright
 * 
 */
package com.ebring.tcrc.trans.login;

import java.util.Map;

import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;

/**
 *
 * 描述: 退出登录服务
 * @author wangjing.dc@qq.com
 */
public class LogoutService  implements IService{
	@SuppressWarnings("unused")
	private static final Logger log = Logger.getLogger(LogoutService.class);

	@SuppressWarnings("rawtypes")
	@Override
	public Result execute(Map params) {
		Result result=new Result();
		
		Subject currentUser = SecurityUtils.getSubject();
		currentUser.logout();
		LoginService.sessionMng.remove(currentUser.getSession().getId().toString());
		
		result.setSuccess(true);
		return result;
	}



}
