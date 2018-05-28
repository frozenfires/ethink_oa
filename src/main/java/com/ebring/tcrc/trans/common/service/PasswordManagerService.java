package com.ebring.tcrc.trans.common.service;

import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;

/**
 * 用户管理-修改密码，重置密码
 * @author Liujian
 *
 */
public class PasswordManagerService implements IService {

	private static final Logger logger = Logger.getLogger(PasswordManagerService.class);
	
	private ITcrcBaseManageDao tcrcBaseManageDao;

	@Override
	public Result execute(Map<String, Object> parameterMap) {
		String PASSWORD = (String) parameterMap.get("PASSWORD");
		String NEWPASSWORD = (String) parameterMap.get("NEWPASSWORD");
		String REPASSWORD = (String) parameterMap.get("REPASSWORD");
		String TYPE = (String) parameterMap.get("TYPE");
		String USER_ID_P = (String) parameterMap.get("USER_ID_P");
		System.out.println("-------------------------------"+REPASSWORD);
		Result result = new Result();
		
		if ("0".equals(TYPE)) { // 修改密码
			String PWD = tcrcBaseManageDao.selectUserPwdByID(parameterMap);
			logger.info("PWD : " + PWD);
			if (!PWD.equals(PASSWORD)) {
				result.setSuccess(false);
				result.setMessage("对不起，您输入的原密码不正确，请重新输入原密码！");
			}else {
				if (!REPASSWORD.equals(NEWPASSWORD)) {
					result.setSuccess(false);
					result.setMessage("对不起，您两次输入的新密码不一致，请重新输入新密码！");
				} 
				else if (PWD.equals(NEWPASSWORD)||PWD.equals(REPASSWORD)){
					result.setSuccess(false);
					result.setMessage("对不起，新密码必须与旧密码不同，请重新输入新密码！");
					
				} 

				else {
					tcrcBaseManageDao.changePwdByID(parameterMap);
					result.setSuccess(true);
				}
			}
		} else { // 重置密码
			parameterMap.put("REPASSWORD", "e10adc3949ba59abbe56e057f20f883e");
			List<Map> map = tcrcBaseManageDao.selectUserDetail(parameterMap);
			if (map != null && map.size() > 0) {
				tcrcBaseManageDao.changePwdByID(parameterMap);
				result.setSuccess(true);
			} else {
				result.setMessage("对不起查询不到柜员【" + USER_ID_P + "】，请重新输入柜员号！");
				result.setSuccess(false);
			}
		}
		return result;
	}

	public ITcrcBaseManageDao getTcrcBaseManageDao() {
		return tcrcBaseManageDao;
	}

	public void setTcrcBaseManageDao(ITcrcBaseManageDao tcrcBaseManageDao) {
		this.tcrcBaseManageDao = tcrcBaseManageDao;
	}

}
