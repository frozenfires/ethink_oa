package com.ebring.tcrc.trans.common.service;

import java.util.Map;

import org.apache.log4j.Logger;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseFunctionDao;

/**
 * 更新日志流水信息
 * @author zhigq
 *
 */
public class UpdateTranLogService implements IService{


	private static final Logger log = Logger.getLogger(InsertTranLogService.class);
	
	private ITcrcBaseFunctionDao tcrcBaseFunctionDao;
	@Override
	public Result execute(Map parameterMap) {
		
		Result result=new Result();
		try{
		tcrcBaseFunctionDao.updateTransLog(parameterMap);
		result.setSuccess(true);
		}catch(Exception e){
			log.error(Util.getStackTrace(e));
			result.setSuccess(false);
			result.setMessage("更新流水日志失败.");
			 
		}
		return result;
	}
	
	
	
	public ITcrcBaseFunctionDao getTcrcBaseFunctionDao() {
		return tcrcBaseFunctionDao;
	}
	public void setTcrcBaseFunctionDao(ITcrcBaseFunctionDao tcrcBaseFunctionDao) {
		this.tcrcBaseFunctionDao = tcrcBaseFunctionDao;
	}

	

}
