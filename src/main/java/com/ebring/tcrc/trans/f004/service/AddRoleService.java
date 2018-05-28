package com.ebring.tcrc.trans.f004.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;
import com.ebring.tcrc.trans.f006.service.InsertDeviceInfoService;


/**
 * 增加角色服务，该服务除了插入base_role表外，还要插入base_role_resource，角色与资源（菜单）的对应表
 * 
 * @author zhigq
 *
 */
public class AddRoleService implements IService {

private static final Logger log = Logger.getLogger(AddRoleService.class);
	
	private ITcrcBaseManageDao tcrcBaseManageDao;
	
	@Override
	public Result execute(Map<String, Object> parameterMap) {
		Result result=new Result();
		try{
		tcrcBaseManageDao.insertRole(parameterMap);
		String role_tree=(String)parameterMap.get("ROLE_TREE");
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
			result.setMessage("增加角色失败!");
			log.error(Util.getStackTrace(e));
		}
		
		
		return result;
	}


	public void setTcrcBaseManageDao(ITcrcBaseManageDao tcrcBaseManageDao) {
		this.tcrcBaseManageDao = tcrcBaseManageDao;
	}
	
}
