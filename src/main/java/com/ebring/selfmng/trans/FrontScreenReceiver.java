package com.ebring.selfmng.trans;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.log4j.Logger;
import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;

/**
 * 描述: 接收前屏传入的一批电子日志
 * 将该批次电子日志插入到数据库中。
 * @author jiaomingxuan
 */
public class FrontScreenReceiver implements IService{
	private static final Logger log = Logger.getLogger(FrontScreenReceiver.class);
	private ITcrcBaseManageDao tcrcBaseManageDao;
	@Override
	public Result execute(Map<String, Object> params) {
		Result result = new Result();
		if (log.isDebugEnabled()) {
			log.debug("logQueryService接收到的参数：" + params);
		}
		try {
			List<?> ElogDataGroup = (List<?>)params.get("ELOG");
			//声明一个map存放前台页面传入的参数
			Map<String, String> InsertData = new HashMap<String, String>();
			for(int i=0;i<ElogDataGroup.size();i++){
				Map<?,?> EachOneElogData = (Map<?,?>)ElogDataGroup.get(i);
				String LOGTIME = (String)EachOneElogData.get("FRONTLOGTIME");
				String ACCOUNT = (String)EachOneElogData.get("ACCOUNT");
				String SEQNO = (String)EachOneElogData.get("SEQNO");
				String LOGDATA = (String)EachOneElogData.get("LOG");
				String ORGID = (String)EachOneElogData.get("ORGID");
				String DEVICEID = (String)EachOneElogData.get("DEVICEID");
				String TRANAMT = (String)EachOneElogData.get("TRANAMT");
				String PLATFORMNUMBER = (String)EachOneElogData.get("PLATFORMNUMBER");
				
						
				InsertData.put("LOGTIME", LOGTIME);	
				InsertData.put("SEQNO", SEQNO);
				InsertData.put("LOG", LOGDATA);
				InsertData.put("ORGID", ORGID);
				InsertData.put("ACCOUNT", ACCOUNT);
				InsertData.put("TRANAMT", TRANAMT);
				InsertData.put("DEVICEID", DEVICEID);
				InsertData.put("PLATFORMNUMBER", PLATFORMNUMBER);
				insert(InsertData);
				InsertData.clear();
			}
			
			result.setSuccess(true);
			
		} catch (Exception e) {
			// TODO: handle exception
			result.setSuccess(false);
			result.setMessage("日志保存失败！");
			e.printStackTrace();
		}
		return result;
	}
	
	private void insert (Map<?,?> InsertData) throws Exception{
			tcrcBaseManageDao.InsertStatement(InsertData);
	}
	
	public void setTcrcBaseManageDao(ITcrcBaseManageDao tcrcBaseManageDao) {
		this.tcrcBaseManageDao = tcrcBaseManageDao;
	}
	

}
