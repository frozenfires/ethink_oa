package com.ebring.tcrc.trans.c008;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseFunctionDao;
import com.ebring.tcrc.trans.common.service.CommonFinanceService;
import com.ebring.tcrc.trans.common.service.InsertTranLogService;
import com.ebring.tcrc.trans.common.service.UpdateTempTranInfoService;

/**
 * 描述: 暂存交易处理
 * 
 * @author wangjing.dc@qq.com
 */
public class C008Service implements IService {

	private static final Logger log = Logger.getLogger(C008Service.class);

	@Autowired
	private ITcrcBaseFunctionDao tcrcBaseFunctionDao;
	@Autowired
	private InsertTranLogService insertTranLogService;
	@Autowired
	private UpdateTempTranInfoService updateTempTranInfoService;
	@Autowired
	private CommonFinanceService commonFinanceService;

	@Override
	public Result execute(Map parameterMap) {

		Result result = new Result();
		try{
			updateTables(parameterMap);
			result.setSuccess(true);
		}catch(Exception e){
			log.debug(Util.getStackTrace(e));
		}

		return result;
	}

	private void updateTables(Map parameterMap) {
		
		if("true".equals(parameterMap.get("SETACCOUNT"))){
			commonFinanceService.execute(parameterMap);
		}else{
			insertTranLogService.execute(parameterMap);
		}
		
		Map<String, Object> tmpParam = new HashMap<String, Object>();
		tmpParam.putAll(Util.getHeadParams(parameterMap));
		Iterator it = parameterMap.keySet().iterator();
		while(it.hasNext()){
			String key = (String) it.next();
			if(key.startsWith("TMP_")){
				tmpParam.put(key.substring(4), parameterMap.get(key));
			}
		}
		log.debug("tmpParam>" + tmpParam);
		updateTempTranInfoService.execute(tmpParam);
		
		
	}

	public void setInsertTranLogService(InsertTranLogService insertTranLogService) {
		this.insertTranLogService = insertTranLogService;
	}

	public void setUpdateTempTranInfoService(
			UpdateTempTranInfoService updateTempTranInfoService) {
		this.updateTempTranInfoService = updateTempTranInfoService;
	}

	public void setCommonFinanceService(CommonFinanceService commonFinanceService) {
		this.commonFinanceService = commonFinanceService;
	}

	
}
