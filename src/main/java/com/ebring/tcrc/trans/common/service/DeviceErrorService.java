/**
 * Ebring 2003 copyright
 * 
 */
package com.ebring.tcrc.trans.common.service;

import java.util.List;
import java.util.Map;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseFunctionDao;

/**
 *
 * 描述:设备故障发生时记录相关数据
 * @author wangjing.dc@qq.com
 */
public class DeviceErrorService implements IService{

	private ITcrcBaseFunctionDao tcrcBaseFunctionDao;
	private InsertTranExceptionService insertTranExceptionService;
	
	@Override
	public Result execute(Map param) {
		Result result = new Result();
		
		// 根据id查询日志表，如果没有则插入，否则进行修改
		List<Map> tranLogList = tcrcBaseFunctionDao.selectTranLogForID(param);
		if (tranLogList.size() == 0) {
			tcrcBaseFunctionDao.insertTransLog(param);
		} else {
			tcrcBaseFunctionDao.updateTransLog(param);
		}
		
		insertTranExceptionService.execute(param);
		
		result.setSuccess(true);
		
		return result;
	}

	public void setTcrcBaseFunctionDao(ITcrcBaseFunctionDao tcrcBaseFunctionDao) {
		this.tcrcBaseFunctionDao = tcrcBaseFunctionDao;
	}

	public void setInsertTranExceptionService(
			InsertTranExceptionService insertTranExceptionService) {
		this.insertTranExceptionService = insertTranExceptionService;
	}
	
	

}
