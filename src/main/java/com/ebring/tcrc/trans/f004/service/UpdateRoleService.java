package com.ebring.tcrc.trans.f004.service;

import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;



/**
 * 修改角色服务，该服务除了修改base_role表外，还要删除base_role_resource，再重新插入
 * 角色与资源（菜单）的对应表
 * 
 * @author zhigq
 *
 */
public class UpdateRoleService implements IService {

private static final Logger log = Logger.getLogger(UpdateRoleService.class);
	
	private ITcrcBaseManageDao tcrcBaseManageDao;
	
	@Override
	public Result execute(Map<String, Object> parameterMap) {
		Result result=new Result();
		try{
		tcrcBaseManageDao.updateRole(parameterMap);
		tcrcBaseManageDao.deleteRoleResource(parameterMap);
		String role_tree=(String)parameterMap.get("ROLE_TREE_UPDATE");
		if(role_tree!=null&&!"".equals(role_tree)){
			String[] role_tree_array=role_tree.split(",");
			for (int i = 0; i < role_tree_array.length; i++) {
				String node=role_tree_array[i];
				Map nodeMap=new HashMap();
				nodeMap.put("ROLE_ID", parameterMap.get("ROLE_ID"));
				nodeMap.put("MODULE_ID", node);
				tcrcBaseManageDao.insertRoleResource(nodeMap);
				
			}
		}
		result.setSuccess(true);
		
		}catch(Exception e){
			result.setSuccess(false);
			result.setMessage("更新角色失败!"); 
			log.error(Util.getStackTrace(e));
		}
		
		
		return result;
	}


	public void setTcrcBaseManageDao(ITcrcBaseManageDao tcrcBaseManageDao) {
		this.tcrcBaseManageDao = tcrcBaseManageDao;
	}
	
}
