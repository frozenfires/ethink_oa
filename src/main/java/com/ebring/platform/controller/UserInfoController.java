/**
 * Ethink 2017 copyright
 * 
 */
package com.ebring.platform.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ebring.tcrc.common.UserInfo;

/**
 *
 * 描述: 查询当前登录用户信息
 * @author wangjing.dc@qq.com
 */
@Controller
public class UserInfoController {
	
	@RequestMapping("userinfo.do")
	@ResponseBody
	public Object findCurrentUser(HttpServletRequest request) {
		
		Subject currentUser = SecurityUtils.getSubject();
        String sessionId = currentUser.getSession().getId().toString();
        UserInfo userInfo = (UserInfo) currentUser.getSession().getAttribute("UserInfo");
        Map<String, String> result = new HashMap<>();
        
        if(userInfo!=null){
        	result.put("userid", userInfo.getUserID());
        	result.put("username", userInfo.getUserName());
        	result.put("orgid", userInfo.getOrgID());
        	result.put("orgname", userInfo.getOrgName());
        	result.put("orgadmin", userInfo.getOrgAdmin());
        	result.put("twoTeller", userInfo.getTwoTeller());
        	result.put("quotaControl ",  userInfo.getQuotaControl());
        	result.put("lockStatus ",  userInfo.getLockStatus());
        	result.put("deviceId ",  userInfo.getDeviceID());
        }

        result.put("basePath", request.getContextPath());
        result.put("sessionId", sessionId);
        
		return result;
	}

}
