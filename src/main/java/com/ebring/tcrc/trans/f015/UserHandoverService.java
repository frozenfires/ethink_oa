package com.ebring.tcrc.trans.f015;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;

/**
 * 用户交接交易数据处理服务
 * insert
 * @author zhangxing
 */

public class UserHandoverService implements IService {

private static final Logger log = Logger.getLogger(UserHandoverService.class);

private ITcrcBaseManageDao tcrcBaseManageDao;

	@Override
	public Result execute(Map<String, Object> parameterMap) {
		
		if(log.isDebugEnabled()){
			log.debug("UserHandoverService 执行.. 参数："+parameterMap);
		}
		
		return userHandover(parameterMap);
	}
	
	public Result userHandover(Map<String, Object> parameterMap){
		
		Result result = new Result();

		// 获取页面数据
		String userId = (String) parameterMap.get("userId");
		String userPwd = (String) parameterMap.get("PASSWORD");
		String currentDate = (String) parameterMap.get("LOGTIME");
		
		try {
			// 验证接收柜员身份
			if(!"".equals(userId) && userId != null){
				Map<String, String> userMap = new HashMap<String, String>();
				userMap.put("USER_ID_P", userId);
				// 获取用户信息
				List<Map> userInfo = tcrcBaseManageDao.selectUserDetail(userMap);
				if(userInfo.size() > 0){
					Map aMap = userInfo.get(0);
					String pwdRet = (String) aMap.get("PASSWORD");
					String userStatus = (String) aMap.get("FREEZE_USER");
					if(!"".equals(userStatus) && userStatus != null && userStatus.equals("正常")){
						if(userPwd.equals(pwdRet)){
							parameterMap.put("UUID", Util.getUUID());
							parameterMap.put("currentDate", currentDate.substring(0,10));
							try {
								int ret = tcrcBaseManageDao.insertUserHandoverLog(parameterMap);
								result.setSuccess(true);
							} catch (Exception e) {
								result.setSuccess(false);
								result.setMessage("数据保存失败！");
								e.printStackTrace();
							}
						}else{
							result.setSuccess(false);
							result.setMessage("密码输入不正确，请核对后重新输入！");
						}
					}else{
						result.setSuccess(false);
						result.setMessage("该交接柜员已被冻结，请核对后重新输入！");
					}
				}else{
					result.setSuccess(false);
					result.setMessage("该交接柜员不存在，请核对后重新输入！");
				}
			}else{
				result.setSuccess(false);
				result.setMessage("接收柜员id获取失败，无法验证！");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	public void setTcrcBaseManageDao(ITcrcBaseManageDao tcrcBaseManageDao) {
		this.tcrcBaseManageDao = tcrcBaseManageDao;
	}
	
}
