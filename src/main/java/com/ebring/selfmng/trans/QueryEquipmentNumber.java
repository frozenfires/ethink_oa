package com.ebring.selfmng.trans;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;

public class QueryEquipmentNumber implements IService{
	private static final Logger log = Logger.getLogger(QueryEquipmentNumber.class);
	private ITcrcBaseManageDao tcrcBaseManageDao;
	@Override
	public Result execute(Map<String, Object> params) {
		// TODO Auto-generated method stub
		Result result = new Result();
		if (log.isDebugEnabled()) {
			log.debug("logQueryService接收到的参数：" + params);
		}
		try {
			//判断数据是否重复提交
			String ORG_ID = (String)params.get("ORG_ID");
			List list = new ArrayList();
			/*List list3 = new ArrayList();
			List list5 = new ArrayList();
			if(ORG_ID !="" && ORG_ID !=null){
				Map map2 = new HashMap();
				map2.put("ORG_ID", ORG_ID);
				list3 = tcrcBaseManageDao.findDevice(map2);
				Map map4 = new HashMap();
				for(int k=0;k<list3.size();k++){
					map4 =(Map)list3.get(k);
					list5.add(map4);
				}
			}*/
			List list2 = tcrcBaseManageDao.findMechanismNumber();
			Map map = new HashMap();
			for(int i=0; i<list2.size();i++){
				map = (Map)list2.get(i);
				list.add(map);
				System.out.println(list);
			}
			result.setContent(list);
			//result.setContent(list5);
			if(list.size()>0){
				result.setSuccess(true);
			}else{
				result.setSuccess(false);
			}
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		return result;
	}
	
	public void setTcrcBaseManageDao(ITcrcBaseManageDao tcrcBaseManageDao) {
		this.tcrcBaseManageDao = tcrcBaseManageDao;
	}
}
