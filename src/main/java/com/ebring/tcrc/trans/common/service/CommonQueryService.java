package com.ebring.tcrc.trans.common.service;

import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.ebring.platform.common.page.PageBean;
import com.ebring.platform.common.page.RowLimit;
import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Global;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;

/**
 * 公共查询服务
 * @author zhigq
 *
 */
public class CommonQueryService implements IService{
	
	private static final Logger log = Logger.getLogger(CommonQueryService.class);
	
	private Map<String,Object> queryService;

	@Override
	public Result execute(Map<String, Object> parameterMap) {
		
		long start=System.currentTimeMillis();
		if(log.isDebugEnabled()){
			log.debug("CommonQueryService 执行.. 参数:"+parameterMap);
		}
		
		//是否分页
		boolean is_page_parameter=false;
		if(parameterMap.get(Global.IS_PAGE)!=null){
			is_page_parameter=(Boolean)parameterMap.get(Global.IS_PAGE);
		}
		String dao_parameter=(String)parameterMap.get(Global.DAO);
		Object daoObj=queryService.get(dao_parameter);
		String sql_id_parameter=(String)parameterMap.get(Global.SQLID);
		
		 Result result=new Result();
		
		 //分页
		if(is_page_parameter){
			 Class<?> partypes[] = new Class[2];
			 partypes[0]=Map.class;
			 partypes[1]=RowLimit.class;
			 
			 PageBean pageBean=new PageBean(parameterMap);
			 
			 try {
				RowLimit limit = pageBean.getRowLimit();
				PageHelper.offsetPage(limit.getOffset(), limit.getLimit());
				Method method= daoObj.getClass().getMethod(sql_id_parameter, partypes);
			    List<Map> rowList=(List<Map>)method.invoke(daoObj, parameterMap, pageBean.getRowLimit());
			    
			    Page pageInfo = (Page) rowList;
			    pageBean.setList(rowList);
			    pageBean.setCount((int) pageInfo.getTotal());
			    
			    Map resultMap=pageBean.getResult();
			    result.setSuccess(true);
			    result.setContent(resultMap);
										
			  } catch (Exception e) {
				  log.error(Util.getStackTrace(e));
					e.printStackTrace();
					result.setSuccess(false);
					result.setMessage("查询失败:"+e.getMessage()); 
			  } 
			    
			 
		 }else{
			 //非分页
			 Class partypes[] = new Class[1];
			 partypes[0]=Map.class;
			 
			 try {
					Method method= daoObj.getClass().getMethod(sql_id_parameter, partypes);
				    List<Map> rowList=(List<Map>)method.invoke(daoObj, parameterMap);
				    result.setSuccess(true);
				    result.setContent(rowList);

				  } catch (Exception e) {
					  log.error(e.getMessage());
						e.printStackTrace();
						result.setSuccess(false);
						result.setMessage("查询失败:"+e.getMessage()); 
				  } 
			 
		 }
		
		   if(log.isDebugEnabled()){
				log.debug("CommonPageService 执行查询 结果:"+result.getResult()+"\n CommonPageService 执行用时:"+(System.currentTimeMillis()-start));
			 }

		    return result;
	}

	public Map<String, Object> getQueryService() {
		return queryService;
	}

	public void setQueryService(Map<String, Object> queryService) {
		this.queryService = queryService;
	}

	

}
