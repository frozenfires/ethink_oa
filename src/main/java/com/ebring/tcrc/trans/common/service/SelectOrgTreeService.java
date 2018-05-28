/**
 * Ebring 2003 copyright
 * 
 */
package com.ebring.tcrc.trans.common.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;;

/**
 *
 * 描述: 查询机构列表
 * @author wangjing.dc@qq.com
 */
public class SelectOrgTreeService  implements IService{
	
	private static final Logger log = Logger.getLogger(SelectOrgTreeService.class);
	private ITcrcBaseManageDao tcrcBaseManageDao;
	
	@Override
	public Result execute(Map<String, Object> parameterMap) {
		Result result=new Result();
		
		// 机构管理员标志
		String orgAdmin = (String) parameterMap.get("ORG_ADMIN");
		String userId = (String) parameterMap.get("USER_ID");
		String orgId = (String) parameterMap.get("ORG_ID");
		String orgName = (String) parameterMap.get("ORG_NAME");
		List<Map> list = this.tcrcBaseManageDao.selectOrgTree(parameterMap);
		
		if("admin".equals(userId)){
			// 超级管理员可以查看所有机构
			result.setContent(list);
		}
		else if("1".equals(orgAdmin)){
			// 机构管理员可以查看本机构机下属机构
			List<Map> flist = filtOrgList(list, orgId, true);
			result.setContent(flist);
		}
		else{
			// 普通用户只能查看本机构
			List<Map> flist = filtOrgList(list, orgId, false);
			result.setContent(flist);
		}
		
		result.setSuccess(true);
		return result;
	}

	/**
	 * 过滤机构信息列表
	 * @param list 机构完成列表
	 * @param orgId 过滤条件
	 * @param deep 是否遍历查询下级机构 
	 * @return
	 */
	private List<Map> filtOrgList(List<Map> list, String orgId, boolean deep) {
		List<Map> result = new ArrayList<Map>();
		for(int i=0; i<list.size(); i++){
			Map item = list.get(i);
			String pId = (String) item.get("pId".toUpperCase());
			String id = (String) item.get("id".toUpperCase());
			if(!deep){
				if(id.equals(orgId)){
					result.add(item);
					break;
				}
			}else{
				if(orgId.equals(id)){
					result.add(item);
				}
				else if(orgId.equals(pId)){
					result.addAll(filtOrgList(list, id, true));
				}
			}
		}
		
		return result;
	}

	public void setTcrcBaseManageDao(ITcrcBaseManageDao tcrcBaseManageDao) {
		this.tcrcBaseManageDao = tcrcBaseManageDao;
	}

	
}
