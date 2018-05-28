package com.ebring.tcrc.userLock;

import java.util.Map;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.UserInfo;

public class SetLockService implements IService{

	@Override
	public Result execute(Map<String, Object> parameterMap) {
		// TODO Auto-generated method stub
		Result result = new Result();
		try {
			String lockStatus = parameterMap.get("lockStatus").toString();
			Subject currentUser = SecurityUtils.getSubject();
			UserInfo user =	(UserInfo) currentUser.getSession().getAttribute("UserInfo");
			user.setLockStatus(lockStatus);
			
			result.setSuccess(true);
		} catch (Exception e) {
			// TODO: handle exception
			result.setSuccess(false);
			e.printStackTrace();
		}
		return result;
	}

}
