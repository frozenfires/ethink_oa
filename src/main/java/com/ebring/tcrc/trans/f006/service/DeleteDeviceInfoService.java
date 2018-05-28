package com.ebring.tcrc.trans.f006.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;

public class DeleteDeviceInfoService implements IService {

	private static final Logger log = Logger.getLogger(InsertDeviceInfoService.class);
	
	private ITcrcBaseManageDao tcrcBaseManageDao;
	
	@Override
	public Result execute(Map parameterMap) {
		return deleteDevice(parameterMap);
	}

	

	@Transactional(propagation=Propagation.REQUIRED,rollbackFor=RuntimeException.class, isolation=Isolation.READ_COMMITTED, readOnly=false)   
	public Result deleteDevice(Map parameterMap){
		
		Result result=new Result();
		try{
			if (parameterMap.get("BATCHDATA") != null) {
				List<Map> rowData = (List<Map>) parameterMap.get("BATCHDATA");
				for (int i = 0; i < rowData.size(); i++) {
					Map rowMap = rowData.get(i);
					tcrcBaseManageDao.deleteDeviceinfo(rowMap);
					Map cashAccountMap=new HashMap();
					cashAccountMap.put("ACCOUNT_ID", rowMap.get("DEVICE_ID"));
					tcrcBaseManageDao.deleteAccount(cashAccountMap);
					cashAccountMap.put("ACCOUNT_ID", rowMap.get("DEVICE_ID") + "_2");
					tcrcBaseManageDao.deleteAccount(cashAccountMap);
				}
			}
			result.setSuccess(true);
		}catch(Exception e){
			result.setSuccess(false);
			result.setMessage("删除设备失败.");
			log.error(Util.getStackTrace(e));
			throw new RuntimeException(); 
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
