package com.ebring.tcrc.trans.f004.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;





/**
 *查询已有的角色与资源（菜单）的对应表
 * 
 * @author zhigq
 *
 */
public class SelectRoleResourceService implements IService {

private static final Logger log = Logger.getLogger(SelectRoleResourceService.class);
	
	private ITcrcBaseManageDao tcrcBaseManageDao;
	
	@Override
	public Result execute(Map<String, Object> parameterMap) {
		long start=System.currentTimeMillis();
		Result result=new Result();
		try{
			
			List<Map> allResourceList=tcrcBaseManageDao.selectResourceTree(null);
			
			List<Map> roleResource=tcrcBaseManageDao.selectResourceTreeForRole(parameterMap);
			
			Map tempMap=new HashMap();
			for (int i = 0; i < allResourceList.size(); i++) {
				Map nodeMap=allResourceList.get(i);
				tempMap.put(nodeMap.get("ID"), i);
			}
			
			 for (int i = 0; i < roleResource.size(); i++) {
				Map nodeMap=roleResource.get(i);
				String module_id=(String)nodeMap.get("MODULE_ID");
				if(tempMap.containsKey(module_id)){
				  int listIndex=(Integer)tempMap.get(module_id);
				  Map oldNodeMap= allResourceList.get(listIndex);
				    oldNodeMap.put("checked", true);
				}
			}
			 
			 for (int i = 0; i < allResourceList.size(); i++) {
				 Map nodeMap=allResourceList.get(i);
				 String id=(String)nodeMap.get("ID");
				 String pid=(String)nodeMap.get("PID");
				 String name=(String)nodeMap.get("NAME");
				 
				 nodeMap.put("id", id);
				 nodeMap.put("pId", pid);
				 nodeMap.put("name", name);
				 
				 nodeMap.remove("ID");
				 nodeMap.remove("PID");
				 nodeMap.remove("NAME");
				
			  }
			
			 if(log.isDebugEnabled()){
				 log.debug("查询结果:"+allResourceList);
			 }
			 
			List<Map> roleDetailList= tcrcBaseManageDao.selectRoleDetail(parameterMap);
			
			Map resultMap=new HashMap();
			resultMap.put("RoleDetail", roleDetailList);
			resultMap.put("RoleTree", allResourceList);
			
		 result.setContent(resultMap);
		 result.setSuccess(true);
		
		 if(log.isDebugEnabled()){
			 log.debug("SelectRoleResourceService use time:"+(System.currentTimeMillis()-start));
		 }
		 
		}catch(Exception e){
			result.setSuccess(false);
			result.setMessage("查询角色失败!");
			log.error(Util.getStackTrace(e));
		}
		
		
		return result;
	}


	public void setTcrcBaseManageDao(ITcrcBaseManageDao tcrcBaseManageDao) {
		this.tcrcBaseManageDao = tcrcBaseManageDao;
	}
	
}
