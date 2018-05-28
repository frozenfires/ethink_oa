package com.ebring.tcrc.trans.common.service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.log4j.Logger;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;

/**
 * 生成交易流水号 当前时间 yyyyMMdd+6位顺序号,如果交易数量大于6位，则按实际位数.
 * 
 * @author zhigq
 *
 *
 * 修改流水号为3位即yyyymmdd+3位流水号
 */
public class CreateSeqNoService implements IService {

	private ITcrcBaseManageDao tcrcBaseManageDao;
	
//	private Map<String,Integer> seqMap=new HashMap<String,Integer>();
	
	private static final Logger log = Logger.getLogger(CreateSeqNoService.class);
	
	@Override
	public Result execute(Map parameterMap) {
        long start=System.currentTimeMillis();
		Result result = new Result();
		result.setSuccess(true);
		Map<String, String> seqMap = new HashMap<String, String>();
		seqMap.put("SEQNO", getSeqNo());
		result.setContent(seqMap);	
		if(log.isDebugEnabled()){
			log.debug("获取序号耗时:"+(System.currentTimeMillis()-start)+"毫秒.");
		}
		return result;
	}
	
	
	/**
	 * 
	 * @return
	 */
	@Transactional(isolation = Isolation.SERIALIZABLE)
	private String getSeqNo(){
      String today=getToday();
	  int newSeqNo=0;
//		if(seqMap.containsKey(today)){
//		   int seqNo=seqMap.get(today);
//		   newSeqNo=seqNo+1;
//		   updateSeqNo(today, newSeqNo);
//		}else{
			Map<String, String> selectMap=new HashMap<>();
			selectMap.put("SEQNO_DATE", today);
			List<Map> listMap=tcrcBaseManageDao.selectSeqNo(selectMap);
			if(listMap.size()>0){
				Map rowMap=listMap.get(0);
			    String dataSeqNo=(String)rowMap.get("SEQNO");
			    newSeqNo=Integer.parseInt(dataSeqNo)+1;
			    updateSeqNo(today, newSeqNo);
			}else{
				newSeqNo = createNewSeq(today);
			}
//		}
		
		return today+getSeqNoStr(newSeqNo);
		
	}
	
	private int createNewSeq(String today) {
		tcrcBaseManageDao.deleteSeqNo(null);
		Map newMap=new HashMap();
		newMap.put("SEQNO_DATE", today);
		newMap.put("SEQNO", 1);
		tcrcBaseManageDao.insertSeqNo(newMap);
		return 1;
	}


	/**
	 * 更新序列号，更新缓存中，同时更新数据库中。
	 * @param date
	 * @param seqNo
	 */
	private void updateSeqNo(String date,int seqNo){
//		 seqMap.put(date,seqNo);
		Map tempMap=new HashMap();
		tempMap.put("SEQNO_DATE", date);
		tempMap.put("SEQNO", seqNo);
		tcrcBaseManageDao.updateSeqNo(tempMap);
	}
	
	/**
	 * 获取序列号字符串，不足位数补零
	 * @param num
	 * @return
	 */
	private String getSeqNoStr(int num){
		int defaultLength=3;
		int numLength=String.valueOf(num).length();
		if(numLength>defaultLength){
			defaultLength=numLength;
		}
		
		StringBuffer tempStr=new StringBuffer();
			for (int i = 0; i < (defaultLength-numLength); i++) {
				tempStr.append("0");
			}
			
			return tempStr.append(num).toString();
		}
	
	
	/**
	 * 获取当天的日期 如20140528
	 * @return
	 */
	private String getToday(){
		java.text.DateFormat format = new java.text.SimpleDateFormat("yyyyMMdd");
		String today = format.format(new Date());
		return today;
	}

	public ITcrcBaseManageDao getTcrcBaseManageDao() {
		return tcrcBaseManageDao;
	}

	public void setTcrcBaseManageDao(ITcrcBaseManageDao tcrcBaseManageDao) {
		this.tcrcBaseManageDao = tcrcBaseManageDao;
	}
	
	
	public static void main(String args[]){
		CreateSeqNoService seqService=new CreateSeqNoService();
		System.out.println(seqService.getSeqNoStr(923456199));;
	}
	
	

}
