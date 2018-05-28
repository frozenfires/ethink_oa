package com.ebring.tcrc.userLock;

import java.util.HashMap;
import java.util.Map;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.UserInfo;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;

public class ValidateUserService implements IService{

	private ITcrcBaseManageDao tcrcBaseManageDao;

	@Override
	public Result execute(Map<String, Object> parameterMap) {
		// TODO Auto-generated method stub
		Result result = new Result();
		try {
			String lockStatus = parameterMap.get("lockStatus").toString();
			String userName = parameterMap.get("lockUserName").toString();
			String passWord = parameterMap.get("password").toString();
			
			Map map = new HashMap();
			map.put("USER_ID_P",userName);
			String pword = tcrcBaseManageDao.selectUserPwdByID(map);
			if(pword != null && !pword.equals("") && passWord != null && !passWord.equals("")){
				if(passWord.equals(pword)){
					Subject currentUser = SecurityUtils.getSubject();
					UserInfo user =	(UserInfo) currentUser.getSession().getAttribute("UserInfo");
					user.setLockStatus(lockStatus);
					result.setSuccess(true);
					result.setMessage("success");
				}
			}else{
				result.setSuccess(false);
				result.setMessage("error");
			}
		} catch (Exception e) {
			// TODO: handle exception
			result.setSuccess(false);
			result.setMessage("error");
			e.printStackTrace();
		}
		return result;
	}
	
	public void setTcrcBaseManageDao(ITcrcBaseManageDao tcrcBaseManageDao) {
		this.tcrcBaseManageDao = tcrcBaseManageDao;
	}
}
