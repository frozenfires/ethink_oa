package com.ebring.tcrc.trans.common.service;

import java.util.Map;

import org.apache.log4j.Logger;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseFunctionDao;

/**
 * 写异常流水日志
 * @author zhigq
 *
 */
public class InsertTranExceptionService implements IService {
	
	private static final Logger log = Logger.getLogger(InsertTranExceptionService.class);
	
	private ITcrcBaseFunctionDao tcrcBaseFunctionDao;
	
	private String SCREEN="SCREEN";
	
	@Override
	public Result execute(Map parameterMap) {
		
		Result result=new Result();
		try{
			byte[] screen=null;
			Object screenObj=parameterMap.get(SCREEN);
			if(screenObj!=null){
				parameterMap.put(SCREEN, screenObj);
			}
			
		tcrcBaseFunctionDao.insertTranException(parameterMap);
		result.setSuccess(true);
		}catch(Exception e){
			log.error(Util.getStackTrace(e));
			result.setSuccess(false);
			result.setMessage("插入异常流水日志失败.");	
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
