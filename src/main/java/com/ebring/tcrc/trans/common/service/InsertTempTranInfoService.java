package com.ebring.tcrc.trans.common.service;

import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseFunctionDao;


/**
 * 写交易暂存交易信息
 * @author zhigq
 *
 */
public class InsertTempTranInfoService implements IService {

	private static final Logger log = Logger.getLogger(InsertTempTranInfoService.class);
	
	private ITcrcBaseFunctionDao tcrcBaseFunctionDao;
	
	@Override
	public Result execute(Map parameterMap) {
		
		Result result=new Result();
		try{
			tcrcBaseFunctionDao.insertTempTranInfo(parameterMap);
			Map<String, String> map = new HashMap<String, String>();
			map.put("LOGTIME", (String) parameterMap.get("LOGTIME"));
			map.put("TRANLOG_ID", (String) parameterMap.get("TRANLINKID"));
			map.put("TCR_REAL_AMT", (String) parameterMap.get("ACTUALAMT"));
			map.put("TRAN_STATUS", "lack");
			tcrcBaseFunctionDao.updateTransLog(map);
			result.setSuccess(true);
		}catch(Exception e){
			log.error("插入交易暂存信息失败:"+Util.getStackTrace(e));
			result.setSuccess(false);
			result.setMessage("插入交易暂存信息失败.");	
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
