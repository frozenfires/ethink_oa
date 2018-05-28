package com.ebring.tcrc.trans.sdemo.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.trans.sdemo.dao.IDemoDao;



//使用Service注解 不需要再在配置文件中配置bean  
@Service
public class DemoService implements IService {

	 @Autowired
	 private IDemoDao demoDao;
	
	@Override
	public Result execute(Map parameterMap) {
		// TODO Auto-generated method stub
		return null;
	}
	
	public Integer insert(){
		try{
			
			long start=System.currentTimeMillis();
		//for (int i = 0; i < 100; i++) {
			 Map dataMap=new HashMap();
			 dataMap.put("id", "a");
			// demoDao.demoInsert(dataMap);
			 Map dataMap2=new HashMap();
			 dataMap2.put("id", "abc");
			// demoDao.demoInsert(dataMap2);
		//}
		System.out.println("user time:"+(System.currentTimeMillis()-start));
		
		}catch(Exception e){
			 e.printStackTrace();
			throw new RuntimeException(); 
		}
		return 1;
	}
		
	

}
