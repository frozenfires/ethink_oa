package com.ebring.tcrc.trans.f004.service;

import java.util.List;
import java.util.Map;
import org.apache.log4j.Logger;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;


/**
 *删除角色服务，该服务除了删除base_role表外，还要删除base_role_resource，角色与资源（菜单）的对应表
 * 
 * @author zhigq
 *
 */
public class DeleteRoleService implements IService {

private static final Logger log = Logger.getLogger(AddRoleService.class);
	
	private ITcrcBaseManageDao tcrcBaseManageDao;
	
	@Override
	public Result execute(Map<String, Object> parameterMap) {
		Result result=new Result();
		try{ 
			
			 if(parameterMap.get("BATCHDATA")!=null){
				 List<Map> rowData=(List<Map>)parameterMap.get("BATCHDATA");
			  for (int i = 0; i < rowData.size(); i++) {
				  Map rowMap=rowData.get(i);
				    tcrcBaseManageDao.deleteRole(rowMap);
					tcrcBaseManageDao.deleteRoleResource(rowMap);
					 
					 }
			   }
			
			
		
		result.setSuccess(true);
		}catch(Exception e){
			result.setSuccess(false);
			result.setMessage("删除角色失败!");
			log.error(Util.getStackTrace(e));
		}
		
		
		return result;
	}


	public void setTcrcBaseManageDao(ITcrcBaseManageDao tcrcBaseManageDao) {
		this.tcrcBaseManageDao = tcrcBaseManageDao;
	}
	
}
