package com.ebring.tcrc.trans.f006.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;
import com.ebring.tcrc.trans.communication.GetDeviceInfoService;

@Service("InsertDeviceInfoService")
public class InsertDeviceInfoService implements IService {

	private static final Logger log = Logger.getLogger(InsertDeviceInfoService.class);
	
	private ITcrcBaseManageDao tcrcBaseManageDao;
	private GetDeviceInfoService getDeviceInfoService;
	@Override
	public Result execute(Map parameterMap) {
		return insertDevice(parameterMap);
	}
	
	
	@Transactional(propagation=Propagation.REQUIRED,rollbackFor=RuntimeException.class, isolation=Isolation.READ_COMMITTED, readOnly=false)   
	public Result insertDevice(Map parameterMap){
		
		Result result=new Result();
		try{
			List idList = tcrcBaseManageDao.selectDeviceinfoDetail(parameterMap);
			if(idList.size() > 0){
				result.setSuccess(false);
				result.setMessage("该设备号已存在");
				return result;
			}
			List ipList = tcrcBaseManageDao.selectDeviceinfoDetailByDeviceIp(parameterMap);
			String device_ip = (String) parameterMap.get("DEVICE_IP");
			if(ipList.size() > 0){
				result.setSuccess(false);
				result.setMessage("该设备IP[" + device_ip + "]已绑定终端");
				return result;
			}
			String TERMINAL_IP = (String) parameterMap.get("TERMINAL_IP");
			if (StringUtils.isNotEmpty(TERMINAL_IP)) {
				List t1List = tcrcBaseManageDao.selectDeviceinfoByTerminal(parameterMap);
				if (t1List.size() > 0) {
					result.setSuccess(false);
					result.setMessage("该终端IP[" + TERMINAL_IP + "]已绑定设备");
					return result;
				}
			}
			String TERMINAL_IP2 = (String) parameterMap.get("TERMINAL_IP2");
			if (StringUtils.isNotEmpty(TERMINAL_IP2)) {
				List t2List = tcrcBaseManageDao.selectDeviceinfoByTerminal2(parameterMap);
				if (t2List.size() > 0) {
					result.setSuccess(false);
					result.setMessage("该终端IP[" + TERMINAL_IP2 + "]已绑定设备");
					return result;
				}
			}
			tcrcBaseManageDao.insertDeviceinfo(parameterMap);
			getDeviceInfoService.reloadInfo();
			Map cashAccountMap = new HashMap();
			cashAccountMap.put("ACCOUNT_ID", parameterMap.get("DEVICE_ID_P"));
			cashAccountMap.put("DEVICE_ID", parameterMap.get("DEVICE_ID_P"));
			cashAccountMap.put("TERMINAL_IP", parameterMap.get("TERMINAL_IP"));
			cashAccountMap.put("DEVICE_BALANCE", "0");
			cashAccountMap.put("BOX_BALANCE", "0");
			tcrcBaseManageDao.insertAccount(cashAccountMap);
			cashAccountMap.put("ACCOUNT_ID", parameterMap.get("DEVICE_ID_P") + "_2");
			cashAccountMap.put("TERMINAL_IP", parameterMap.get("TERMINAL_IP2"));
			tcrcBaseManageDao.insertAccount(cashAccountMap);
			result.setSuccess(true);
		}
		catch(Exception e){
			result.setSuccess(false);
			result.setMessage("未知错误");
			log.error(Util.getStackTrace(e));
			//throw new RuntimeException(); 
		}
		
		return result;
	}
	

	public ITcrcBaseManageDao getTcrcBaseManageDao() {
		return tcrcBaseManageDao;
	}

	public void setTcrcBaseManageDao(ITcrcBaseManageDao tcrcBaseManageDao) {
		this.tcrcBaseManageDao = tcrcBaseManageDao;
	}


	public GetDeviceInfoService getGetDeviceInfoService() {
		return getDeviceInfoService;
	}


	public void setGetDeviceInfoService(GetDeviceInfoService getDeviceInfoService) {
		this.getDeviceInfoService = getDeviceInfoService;
	}

	
	
	
	
	

}
