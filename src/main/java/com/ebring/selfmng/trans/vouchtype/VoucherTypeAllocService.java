/**
 * Ethink 2015 copyright
 * 
 */
package com.ebring.selfmng.trans.vouchtype;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseFunctionDao;

/**
 *
 * 描述: 凭证类型分配服务
 * @author wangjing.dc@qq.com
 */
public class VoucherTypeAllocService  implements IService{
	
	private static final Logger log = LoggerFactory.getLogger(VoucherTypeAllocService.class);

	private ITcrcBaseFunctionDao tcrcBaseFunctionDao;
	
	@Override
	public Result execute(Map<String, Object> param) {
		Result result = new Result();
		try{
			this.allocVoucher(param, result);
			result.setSuccess(true);
		}catch(Exception e){
			result.setSuccess(false);
			result.setMessage(e.getCause().getMessage());
			log.error(null, e);
		}
		
		return result;
	}

	
	@SuppressWarnings("unchecked")
	private void allocVoucher(Map<String, Object> param, Result result) {
		String orgId = (String) param.get("ORGID_P");
		List<String> newList = (List) param.get("SELECTEDTYPE");
		
		List<String> insertList = new ArrayList<String>();
		List<String> deleteList = new ArrayList<String>();
		
		// 删除原分配的凭证类型
		tcrcBaseFunctionDao.deletetVoucherAlloc(param);
		
		Map<String, String> insertParam = new HashMap<String, String>();
		insertParam.put("ORGID_P", orgId);
		for(int i=0; i<newList.size(); i++){
			insertParam.put("VOUCHERCODE", newList.get(i));
			tcrcBaseFunctionDao.insertVoucherAlloc(insertParam);
		}
		
	}

	/**
	 * @param tcrcBaseFunctionDao the tcrcBaseFunctionDao to set
	 */
	public void setTcrcBaseFunctionDao(ITcrcBaseFunctionDao tcrcBaseFunctionDao) {
		this.tcrcBaseFunctionDao = tcrcBaseFunctionDao;
	}
	
	

}
