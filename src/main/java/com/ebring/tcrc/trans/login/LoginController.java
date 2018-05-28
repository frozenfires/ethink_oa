package com.ebring.tcrc.trans.login;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.ebring.platform.common.context.SpringBeanProxy;


@Controller
@RequestMapping("login.do")
public class LoginController {

	private static final Logger log = Logger.getLogger(LoginController.class);

	public LoginController() {
		System.out.println("LoginController init......");
	}

	@RequestMapping("login")
	public ModelAndView handle(HttpServletRequest req, HttpServletResponse res)
			throws ServletException, IOException {

		String user_id = req.getParameter("username");
		String password = req.getParameter("password");
		String tokenValue = req.getParameter("userPassword");//令牌
		if(tokenValue!=null&&!"".equals(tokenValue)){
			user_id=req.getParameter("userName");
			
		}
		String clientId = getClientIP(req);
		Subject currentUser = SecurityUtils.getSubject();
		boolean isLogin=false;
		String view="main.html";

		 if(log.isDebugEnabled()){
			 log.debug("LoginController request:"+req.getParameterMap());
		 }
		
		try {
			
			boolean flag=true;
			
			if(tokenValue!=null&&!"".equals(tokenValue)){
				
				String response=getSSOResponse(user_id, tokenValue);
				String res_code=response.substring(12, 18);
				if(!"000000".equals(res_code)){
					flag=false;
				}else{
					password="e10adc3949ba59abbe56e057f20f883e";
				}
			}

	
			if(flag) {
			UsernamePasswordToken token = new UsernamePasswordToken(user_id,
					password);
			 token.setHost(clientId);
			 currentUser.login(token);
			 isLogin=true;
			}
			

		} catch (UnknownAccountException uae) {
			log.error("无此用户名.");

		} catch (IncorrectCredentialsException ice) {
			log.error("用户名密码错误.");

		} catch (AuthenticationException ae) {
			
			log.error("登录错误.");
		}
		if(!isLogin){
			view="login.html";
		}

		
		return new ModelAndView(view);
	}
	
	
	/**
	 * 获取客户端IP
	 * @param request
	 * @return
	 */
	 public static String getClientIP(HttpServletRequest request) {  
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
	 
	 
	 public String getSSOResponse(String userid,String token){
		 
		    SSOClient client=new SSOClient();
			StringBuffer head=client.getHeader();
			StringBuffer message=head.append(client.getBody(userid, token, "L"));
			int messageLength=message.length();
			StringBuffer messageLengthStr=FixedMessage.appendMessage(new StringBuffer(), String.valueOf(messageLength), "R", "N", 6);//报文长度
		    StringBuffer allMessage=messageLengthStr.append(message);
		    
		    SSOTCPServer tcpServer = (SSOTCPServer) SpringBeanProxy.getBean("SSOTCPServer");
	        String ip = tcpServer.getIp();
	        int port = tcpServer.getPort();
	        log.info("ip : " + ip);
	        log.info("port : " + port);
		    
			return client.sendMessage(allMessage.toString(), ip, port);
	 }

}
