/**
 * Ethink 2015 copyright
 * 
 */
package com.ebring.selfmng.trans.vouchtype;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseFunctionDao;

/**
 *
 * 描述: 凭证类型服务。
 * @author wangjing.dc@qq.com
 */
public class VouchTypeService  implements IService{
	
	private static final Logger log = LoggerFactory.getLogger(VouchTypeService.class);
	
	private ITcrcBaseFunctionDao tcrcBaseFunctionDao;

	@Override
	public Result execute(Map<String, Object> param) {
//		log.debug(param.toString());
		
		Result result = new Result();
		try{
			this.saveVoucher(result, param);
			result.setSuccess(true);
		}catch(Exception e){
			log.error(null, e);
			result.setSuccess(false);
			result.setMessage("保存凭证类型出错" + e.getCause().getMessage());
		}
		
		return result;
	}

	/**
	 * 保存凭证类型数据
	 * @param result
	 * @param param
	 */
	private void saveVoucher(Result result, Map<String, Object> param) {

		String serviceType = (String) param.get("serviceType");
		Map<String, Object> data = new HashMap<String, Object>();
		
		// 凭证代码
		data.put("VOUCHERCODE", (String) param.get("VOUCHERCODE"));
		// 凭证名称
		data.put("VOUCHERNAME", (String) param.get("VOUCHERNAME"));
		// 凭证图片
		data.put("VOUCHERPIC", (String) param.get("fileContent"));
		// 介质种类
		data.put("MEDIATYPE", (String) param.get("MEDIATYPE"));
		// 当前时间
		data.put("LOGTIME", (String) param.get("LOGTIME"));
		
		if(serviceType == null || serviceType.equals("insert")){// 插入新记录
			tcrcBaseFunctionDao.insertVoucher(data);
		}else{// 更新原记录
			tcrcBaseFunctionDao.updateVoucher(data);
		}
	}

	/**
	 * @param tcrcBaseFunctionDao the tcrcBaseFunctionDao to set
	 */
	public void setTcrcBaseFunctionDao(ITcrcBaseFunctionDao tcrcBaseFunctionDao) {
		this.tcrcBaseFunctionDao = tcrcBaseFunctionDao;
	}

	

}
