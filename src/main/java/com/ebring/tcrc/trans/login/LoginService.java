package com.ebring.tcrc.trans.login;

import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;

@Controller
public class LoginService implements IService{
	public static final Map<String, Session> sessionMng = new HashMap<String, Session>();
	
	private static final Logger log = Logger.getLogger(LoginService.class);

	public LoginService() {
		System.out.println("LoginService init......");
	}

	@Override
	public Result execute(Map params) {
		Result result=new Result();
		
		String user_id = (String) params.get("username");
		String password = (String) params.get("password");
		String clientId = (String) params.get("USER_IP");
		//使用apache shiro控件，使用SecurityUtils.getSubject()得到当前正在执行的主题
		Subject currentUser = SecurityUtils.getSubject();
		//得到当前的会话信息，设置超时时间，时间为28800000
		SecurityUtils.getSubject().getSession().setTimeout(28800000); 
		boolean isLogin=false;
		String view="/main.html";
		
		String errmsg = "";
		try {

			UsernamePasswordToken token = new UsernamePasswordToken(user_id,
					password);
             token.setHost(clientId);
			currentUser.login(token);
			isLogin=true;
			
			sessionMng.put(currentUser.getSession().getId().toString(), currentUser.getSession());
		} catch (LockedAccountException uaee) {
			errmsg= "此用户账户被冻结.";
			log.error("此用户账户被冻结.", uaee);

		} catch (UnknownAccountException uae) {
			errmsg= "无此用户名.";
			log.error("无此用户名.", uae);

		} catch (IncorrectCredentialsException ice) {
			errmsg= "用户名密码错误.";
			log.error("用户名密码错误.", ice);
		
		} catch (AuthenticationException ae) {
			errmsg= "登录错误.";
			log.error("登录错误.", ae);
		} catch(Throwable e) {
			log.error(null , e);
		}
		
		
		if(!isLogin){
			view="/login.html";
		}
		
		result.setSuccess(errmsg.equals("") ? true : false);
		result.setMessage(errmsg);
		
		return result;
	}

}
