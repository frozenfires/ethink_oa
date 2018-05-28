package com.ebring.tcrc.trans.common.service;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Global;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;

@Service
public class OACustomerInfoServicre implements IService{
	private Map<String,Object> executeService;
	private static final Logger log = Logger.getLogger(OACustomerInfoServicre.class);
	@Override
	public Result execute(Map<String, Object> parameterMap) {
		
		long start=System.currentTimeMillis();
		if(log.isDebugEnabled()){
			log.debug("OACustomerInfoServicre 执行.. 参数:"+parameterMap);
		}
		String dao_parameter=(String)parameterMap.get(Global.DAO);
		Object daoObj=executeService.get(dao_parameter);
		String sql_id_parameter=(String)parameterMap.get(Global.SQLID);
		
		 Result result=new Result();
			 Class partypes[] = new Class[1];
			 partypes[0]=Map.class;
			 
			 try {
					Method method= daoObj.getClass().getMethod(sql_id_parameter, partypes);
				    List<Map> rowList=(List<Map>)method.invoke(daoObj, parameterMap);
				    result.setSuccess(true);
			
				    Long total=(Long) rowList.get(0).get("TOTALDEV");
				if (total>0) {
					
					Map<String, Object> hashmap=new HashMap<String, Object>();
					hashmap.put("deleteFlag", "N");//F0111.js页面面删除提醒标志N不删除
					rowList.add(hashmap);
					result.setContent(rowList);
				}else {
					
					parameterMap.put("SQLID", "deleteOrg");
					
					Map<String, Object> hashmap=new HashMap<String, Object>();
					hashmap.put("deleteFlag", "Y");
					rowList.add(hashmap);
					executDelete(parameterMap);
					 result.setContent(rowList);
					
				}
			
				  } catch (Exception e) {
					  log.error(e.getMessage());
						e.printStackTrace();
						result.setSuccess(false);
						result.setMessage("查询失败:"+e.getMessage()); 
				  } 
			 
		
		
		   if(log.isDebugEnabled()){
				log.debug("OACustomerInfoServicre 执行查询 结果:"+result.getResult()+"\n CommonPageService 执行用时:"+(System.currentTimeMillis()-start));
			 }

		    return result;
	}
public Result executDelete(Map<String, Object> parameterMap) {
		
		long start=System.currentTimeMillis();
		if(log.isDebugEnabled()){
			log.debug("OACustomerInfoServicre 执行.. 参数:"+parameterMap);
		}
		

	
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
									log.debug("OACustomerInfoServicre 执行结果:"+executeResult);
								}
							 }
					   }else{
						   //单次执行
						   int executeResult=(Integer)method.invoke(daoObj, parameterMap); 
						   if(log.isDebugEnabled()){
								log.debug("OACustomerInfoServicre 执行结果:"+executeResult);
							}
					   }
					
					  result.setSuccess(true);
					 
					 
				} catch (Exception e) {
					log.error(Util.getStackTrace(e));
					result.setSuccess(false);
					result.setMessage(e.getMessage());
				} 
				
				if(log.isDebugEnabled()){
					log.debug("OACustomerInfoServicre 执行耗时:"+(System.currentTimeMillis()-start));
				}
				
				return result;
			}
			
	public Map<String, Object> getexecuteService() {
		return executeService;
	}

	public void setexecuteService(Map<String, Object> executeService) {
		this.executeService = executeService;
	}

	

}
