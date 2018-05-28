package com.ebring.tcrc.trans.common.service;

import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Global;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;


/**
 * 公共处理数据(insert,upate,delete) 服务
 * @author zhigq
 *
 */
public class CommonExecuteService implements IService{

private static final Logger log = Logger.getLogger(CommonExecuteService.class);
	
	private Map<String,Object> executeService;
	
	@Override
	public Result execute(Map parameterMap) {

		
		if(log.isDebugEnabled()){
			log.debug("CommonExecuteService 执行.. 参数:"+parameterMap);
		}
		
		return updateExecute(parameterMap);
	}

	public Result updateExecute(Map parameterMap){
		long start=System.currentTimeMillis();
		String dao_parameter=(String)parameterMap.get(Global.DAO);
		Object daoObj=executeService.get(dao_parameter);
		String sql_id_parameter=(String)parameterMap.get(Global.SQLID);
		Result result=new Result();
		
		 Class partypes[] = new Class[1];
		 partypes[0]=Map.class;
		 
		try {
			 Method	method = daoObj.getClass().getMethod(sql_id_parameter, partypes);
			 //批量执行
			 if(parameterMap.get("BATCHDATA")!=null){
				 List<Map> rowData=(List<Map>)parameterMap.get("BATCHDATA");
			  for (int i = 0; i < rowData.size(); i++) {
				  Map rowMap=rowData.get(i);
				  int executeResult=(Integer)method.invoke(daoObj, rowMap);
					 if(log.isDebugEnabled()){
							log.debug("CommonExecuteService 执行结果:"+executeResult);
						}
					 }
			   }else{
				   //单次执行
				   int executeResult=(Integer)method.invoke(daoObj, parameterMap); 
				   if(log.isDebugEnabled()){
						log.debug("CommonExecuteService 执行结果:"+executeResult);
					}
			   }
			
			  result.setSuccess(true);
			 
			 
		} catch (Exception e) {
			log.error(Util.getStackTrace(e));
			result.setSuccess(false);
			result.setMessage(e.getMessage());
		} 
		
		if(log.isDebugEnabled()){
			log.debug("CommonExecuteService 执行耗时:"+(System.currentTimeMillis()-start));
		}
		
		return result;
	}
	
	
	public Map<String, Object> getExecuteService() {
		return executeService;
	}

	public void setExecuteService(Map<String, Object> executeService) {
		this.executeService = executeService;
	}

	
	
	

}
