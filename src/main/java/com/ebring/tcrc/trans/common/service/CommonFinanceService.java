package com.ebring.tcrc.trans.common.service;

import java.text.DecimalFormat;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.ebring.platform.common.service.IService;
import com.ebring.platform.exception.FinanceException;
import com.ebring.tcrc.common.ConfigUtil;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseFunctionDao;

/**
 * 
 * @author 公共金融服务 完成更新帐户余额、写帐户登记簿、更新日志流水、写冠字号的操作
 * 
 */
public class CommonFinanceService implements IService {

	private ITcrcBaseFunctionDao tcrcBaseFunctionDao;
	private InsertCashNoService insertCashNoService;

	private static final Logger log = Logger
			.getLogger(CommonFinanceService.class);

	@SuppressWarnings("unchecked")
	@Override
	public Result execute(Map param) {

		if (log.isDebugEnabled()) {
			log.debug("CommonFinanceService 接收到的参数:" + param);
		}

		// 更新帐户余额
		Result result = new Result();
		if(!param.containsKey("ACCOUNT_ID")){
			result.setSuccess(false);
			result.setMessage("操作失败：未绑定设备!");
		}
		else{
		
		try {
			executeBalance(param);
			String quotaControl = ConfigUtil.getPropertyValue("quotaControl");
log.info("quotaControl : " + quotaControl);
			if ("true".equals(quotaControl)) {
				tcrcBaseFunctionDao.updateAccountCashBalance(param);
				if ("INIT".equals( param.get("CASH_FLAG"))) {
					List<Map> list = tcrcBaseFunctionDao.selectTerminalByDeviceId(param);
					if (list != null && list.size() == 1) {
						Map map = list.get(0);
						if (map != null) {
							param.put("USER_IP", map.get("TERMINAL_IP2"));
							tcrcBaseFunctionDao.updateAccountCashBalance(param);
						}
					}
				}
			}
			tcrcBaseFunctionDao.insertAccountBook(param);
			// 根据id查询日志表，如果没有则插入，否则进行修改
			List<Map> tranLogList = tcrcBaseFunctionDao.selectTranLogFromTranID(param);
			if (tranLogList.size() == 0) {
				tcrcBaseFunctionDao.insertTransLog(param);
			} else {
				tcrcBaseFunctionDao.updateTransLog(param);
			}

			insertCashNoService.execute(param);

			result.setSuccess(true);
		}
		catch(FinanceException fe){
			result.setSuccess(false);
			result.setMessage(fe.getMessage());
			log.error(Util.getStackTrace(fe));
		}
		catch (Exception e) {
			result.setSuccess(false);
			result.setMessage("操作失败!");
			log.error(Util.getStackTrace(e));
		}
		
		}
		
		return result;
	}

	public ITcrcBaseFunctionDao getTcrcBaseFunctionDao() {
		return tcrcBaseFunctionDao;
	}

	public void setTcrcBaseFunctionDao(ITcrcBaseFunctionDao tcrcBaseFunctionDao) {
		this.tcrcBaseFunctionDao = tcrcBaseFunctionDao;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	private void executeBalance(Map param) throws FinanceException {

		String cash_flag = (String) param.get("CASH_FLAG");

		double tcrAmt = 0;
		double boxAmt = 0;
		
		Object boxAMTObj= param.get("BOXAMT");
		Object tcrAMTObj= param.get("TCRAMT");
		if(boxAMTObj!=null&&!"".equals(boxAMTObj)){
			boxAmt=Double.parseDouble((String)boxAMTObj);
		}
		if(tcrAMTObj!=null&&!"".equals(tcrAMTObj)){
			tcrAmt=Double.parseDouble((String)tcrAMTObj);
		}
		
		List<Map> list = tcrcBaseFunctionDao.selectAccountCashBalance(param);

		double device_banlance = 0;
		double box_banlance = 0;
		double device_banlance_last = 0;
		double box_banlance_last = 0;

		if (list.size() > 0) {
			Map row = list.get(0);
			if(row != null){
				Object deviceb = row.get("DEVICE_BALANCE");
				device_banlance_last = device_banlance = Double.parseDouble( (String) (deviceb == null ? "" : deviceb) );
				Object box = row.get("BOX_BALANCE");
				box_banlance_last = box_banlance = Double.parseDouble((String) (box == null ? "" : box));
			}
		}
		if ("IN".equals(cash_flag)) {
			device_banlance += tcrAmt;
			box_banlance += boxAmt;
		} else if ("OUT".equals(cash_flag)) {
			device_banlance -= tcrAmt;
			box_banlance -= boxAmt;
			
		}
		// 从柜员尾箱调拨至设备
		else if("IN_OUT".equals(cash_flag)){
			device_banlance += boxAmt;
			box_banlance -= boxAmt;
			param.put("TCRAMT", "");
		}
		// 从设备调拨至柜员尾箱
		else if("OUT_IN".equals(cash_flag)){
			device_banlance -= boxAmt;
			box_banlance += boxAmt;
			param.put("TCRAMT", "");
		}
		// 账务重写
		else if("RESET".equals(cash_flag)){
			device_banlance = tcrAmt;
		}
		// 额度清零
		else if("INIT".equals(cash_flag)){
			device_banlance = 0.00;
			box_banlance = 0.00;
		}

		if(param.get("quotaControl") == "true" && box_banlance < 0 && box_banlance < box_banlance_last){
			throw new FinanceException("F001", "柜员尾箱余额不足");
		}
		if(param.get("quotaControl") == "true" && device_banlance < 0 && device_banlance < device_banlance_last){
			throw new FinanceException("F002", "设备余额不足");
		}
		
		param.put("DEVICE_BALANCE", getDoubleString(device_banlance));
		param.put("ACC_DEVICE_BALANCE", getDoubleString(device_banlance));
		param.put("BOX_BALANCE", getDoubleString(box_banlance));

	}

	private String getDoubleString(double doubleStr) {
		DecimalFormat df = new DecimalFormat("########0.00");
		String dd = df.format(doubleStr);
		return dd;
	}

	public InsertCashNoService getInsertCashNoService() {
		return insertCashNoService;
	}

	public void setInsertCashNoService(InsertCashNoService insertCashNoService) {
		this.insertCashNoService = insertCashNoService;
	}

}
