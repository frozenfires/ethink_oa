package com.ebring.tcrc.trans.common.service;

import java.util.Map;

import org.apache.log4j.Logger;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseFunctionDao;

/**
 * 修改交易暂存信息
 * @author zhigq
 *
 */
public class UpdateTempTranInfoService implements IService {

	private static final Logger log = Logger.getLogger(UpdateTempTranInfoService.class);
	
	private ITcrcBaseFunctionDao tcrcBaseFunctionDao;
	@Override
	public Result execute(Map parameterMap) {
		
		Result result=new Result();
		try{
		tcrcBaseFunctionDao.updateTempTranInfo(parameterMap);
		result.setSuccess(true);
		}catch(Exception e){
			log.error("修改交易暂存信息失败："+Util.getStackTrace(e));
			result.setSuccess(false);
			result.setMessage("修改交易暂存信息失败.");	
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
