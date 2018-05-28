/**
 * Ebring 2003 copyright
 * 
 */
package com.ebring.tcrc.trans.c002;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseFunctionDao;
import com.ebring.tcrc.trans.common.service.InsertCashNoService;

/**
 *
 * 描述: 故障清除处理
 *       计算故障交易的实际交易金额、并将该金额更新到交易流水信息中。
 * @author wangjing.dc@qq.com
 */
public class C002Service  implements IService{
	private static final Logger log = Logger.getLogger(C002Service.class);
	
	private ITcrcBaseFunctionDao tcrcBaseFunctionDao;

	@Override
	public Result execute(Map parameterMap) {
		
		Result result = new Result();
		List<Map> counters = tcrcBaseFunctionDao
				.selectCounter(parameterMap);
		
		// 计算实际交易金额
		if(counters.size() > 1){
			Map<String, Integer> startAmt = blanceSum(counters.get(0));
			Map<String, Integer> endAmt = blanceSum(counters.get(counters.size() -1));
			int amt = endAmt.get("amtsum") - startAmt.get("amtsum");
			
			Map<String, Object> content = new HashMap<String, Object>();
			
			Map<String, Object> amtMap = new HashMap<String, Object>();
			amtMap.put("amt", amt);
			Map<String, Integer> typeMap = new HashMap<String, Integer>();
			typeMap.put("100", endAmt.get("100") - startAmt.get("100"));
			typeMap.put("50", endAmt.get("50") - startAmt.get("50"));
			typeMap.put("20", endAmt.get("20") - startAmt.get("20"));
			typeMap.put("10", endAmt.get("10") - startAmt.get("10"));
			typeMap.put("5", endAmt.get("5") - startAmt.get("5"));
			typeMap.put("1", endAmt.get("1") - startAmt.get("1"));
			amtMap.put("detail", typeMap);
			
			content.put("DATA", amtMap);
			
			parameterMap.put("tcr_real_amt".toUpperCase(), amt);
			tcrcBaseFunctionDao.updateTransLog(parameterMap);
			
			result.setSuccess(true);
			result.setContent(content);
		}else{
			// 没有可以计算的数据
			String msg = "计数器历史数据不足，计算出实际交易金额失败。";
			log.error(msg);
			result.setMessage(msg);
		}
		
		
		return result;
	}
	
	/**
	 * 计算blance总金额
	 * @param map
	 * @return
	 */
	private Map<String, Integer> blanceSum(Map<String, Object> map) {
		Map<String, Integer> result = new HashMap<String, Integer>();
		int amt100 =  parseInt(map.get("blance_100".toUpperCase()));
		int amt50 =  parseInt(map.get("blance_50".toUpperCase()));
		int amt20 =  parseInt(map.get("blance_20".toUpperCase()));
		int amt10 =  parseInt(map.get("blance_10".toUpperCase()));
		int amt5 =  parseInt(map.get("blance_5".toUpperCase()));
		int amt1 =  parseInt(map.get("blance_1".toUpperCase()));
		
		result.put("100", amt100);
		result.put("50", amt50);
		result.put("20", amt20);
		result.put("10", amt10);
		result.put("5", amt5);
		result.put("1", amt1);
		result.put("amtsum", amt100 * 100 + amt50 * 50 + amt20 * 20 + amt10 * 10 + amt5 * 5 + amt1);
		
		
		return result;
	}

	private int parseInt(Object object) {
		String amt = (String) object;
		return amt == "" ? 0 : Integer.valueOf(amt);
	}

	public void setTcrcBaseFunctionDao(ITcrcBaseFunctionDao tcrcBaseFunctionDao) {
		this.tcrcBaseFunctionDao = tcrcBaseFunctionDao;
	}
	
	
}
