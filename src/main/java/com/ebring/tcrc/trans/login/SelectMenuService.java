package com.ebring.tcrc.trans.login;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;
import com.ebring.tcrc.trans.f004.service.AddRoleService;




/**
 * 查询用户、角色与资源（菜单）的对应表
 * 
 * @author zhigq
 *
 */
public class SelectMenuService implements IService {

private static final Logger log = Logger.getLogger(AddRoleService.class);
	
	private ITcrcBaseManageDao tcrcBaseManageDao;
	
	@Override
	public Result execute(Map<String, Object> parameterMap) {
		Result result=new Result();
		try{
		
			Map firstMap=new HashMap();
			firstMap.put("USER_ID", parameterMap.get("USER_ID"));
			firstMap.put("MODULE_LEVEL", 1);
			
		//查询一级菜单	
	   List<Map> firstList=	tcrcBaseManageDao.selectUserMenu(firstMap);
	   //查询所有菜单
	   List<Map> allList=	tcrcBaseManageDao.selectUserMenu(parameterMap);
	   
	    Map menuMap=new HashMap();
	    menuMap.put("FIRST", firstList);
	    menuMap.put("ALL", allList);
		
	   result.setContent(menuMap);
		result.setSuccess(true);
		
		}catch(Exception e){
			result.setSuccess(false);
			result.setMessage("查询菜单失败!");
			log.error(Util.getStackTrace(e));
		}
		
		
		return result;
	}


	public void setTcrcBaseManageDao(ITcrcBaseManageDao tcrcBaseManageDao) {
		this.tcrcBaseManageDao = tcrcBaseManageDao;
	}
	
}
