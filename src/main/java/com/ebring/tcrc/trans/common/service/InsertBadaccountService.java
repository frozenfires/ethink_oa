package com.ebring.tcrc.trans.common.service;

import org.apache.log4j.Logger;

import java.text.DecimalFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseFunctionDao;

/**
 * 插入长短款信息
 * @author Liujian
 *
 */
public class InsertBadaccountService implements IService {
	/**
	 * Logger for this class
	 */
	private static final Logger logger = Logger.getLogger(InsertBadaccountService.class);

	private ITcrcBaseFunctionDao tcrcBaseFunctionDao;
	
	@Override
	public Result execute(Map<String, Object> parameterMap) {
		Result result = new Result();
		try {
			Integer TYPE = Integer.parseInt((String) parameterMap.get("TYPE"));
			List<Map> list = tcrcBaseFunctionDao.selectAccountCashBalance(parameterMap);
			Double AMT = Double.parseDouble((String) parameterMap.get("AMT"));
			double device_banlance = 0; // 设备余额
			double box_banlance = 0; // 柜员尾箱余额
			if (list.size() > 0) {
				Map row = list.get(0);
				if(row != null){
					Object deviceb = row.get("DEVICE_BALANCE");
					device_banlance = Double.parseDouble((String)(deviceb == null ? "" : deviceb) );
					Object box = row.get("BOX_BALANCE");
					box_banlance = Double.parseDouble((String) (box == null ? "" : box));
				}
			}
			switch (TYPE) {
			case 1:
				box_banlance += AMT;
				break;
			case 2:
				box_banlance -= AMT;
				break;
			case 3:
				device_banlance += AMT;
				break;
			case 4:
				device_banlance -= AMT;
				break;
			default:
				break;
			}
			parameterMap.put("DEVICE_BALANCE", getDoubleString(device_banlance));
			parameterMap.put("BOX_BALANCE", getDoubleString(box_banlance));
			tcrcBaseFunctionDao.updateAccountCashBalance(parameterMap);
			tcrcBaseFunctionDao.insertBadaccount(parameterMap);
			
			result.setSuccess(true);
			
		} catch (Exception e) {
			logger.error(Util.getStackTrace(e));
			result.setSuccess(false);
			result.setMessage("插入现金长短款流水记录失败.");	
		}
		return result;
	}

	public ITcrcBaseFunctionDao getTcrcBaseFunctionDao() {
		return tcrcBaseFunctionDao;
	}

	public void setTcrcBaseFunctionDao(ITcrcBaseFunctionDao tcrcBaseFunctionDao) {
		this.tcrcBaseFunctionDao = tcrcBaseFunctionDao;
	}
	private String getDoubleString(double doubleStr) {
		DecimalFormat df = new DecimalFormat("########0.00");
		String dd = df.format(doubleStr);
		return dd;
	}
}
