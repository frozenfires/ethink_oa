package com.ebring.tcrc.trans.common.service;

import java.util.Map;

import org.apache.log4j.Logger;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseFunctionDao;


/**
 * 插入流水日志服务
 * @author zhigq
 *
 */
public class InsertTranLogService implements IService {

	private static final Logger log = Logger.getLogger(InsertTranLogService.class);
	
	private InsertCashNoService insertCashNoService;
	private ITcrcBaseFunctionDao tcrcBaseFunctionDao;
	
	@Override
	public Result execute(Map parameterMap) {
		
		Result result=new Result();
		try{
			tcrcBaseFunctionDao.insertTransLog(parameterMap);
			insertCashNoService.execute(parameterMap);
			result.setSuccess(true);
		}catch(Exception e){
			log.error(Util.getStackTrace(e));
			result.setSuccess(false);
			result.setMessage("插入流水日志失败.");	
		}
		
		return result;
	}
	
	public ITcrcBaseFunctionDao getTcrcBaseFunctionDao() {
		return tcrcBaseFunctionDao;
	}
	public void setTcrcBaseFunctionDao(ITcrcBaseFunctionDao tcrcBaseFunctionDao) {
		this.tcrcBaseFunctionDao = tcrcBaseFunctionDao;
	}
	public InsertCashNoService getInsertCashNoService() {
		return insertCashNoService;
	}
	public void setInsertCashNoService(InsertCashNoService insertCashNoService) {
		this.insertCashNoService = insertCashNoService;
	}
	
}
