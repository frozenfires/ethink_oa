package com.ebring.oa.trans;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.ebring.platform.common.page.PageBean;
import com.ebring.platform.common.page.RowLimit;
import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Global;
import com.ebring.tcrc.common.GlobalTcrc;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;
import com.ebring.workflow.IWorkFlowService;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;

/**
 * 工单查询
 * @author df
 *
 */
public class WorkOrderService implements IService {

	private IWorkFlowService iWorkFlowService;
	private ITcrcBaseManageDao iTcrcBaseManageDao;
	public ITcrcBaseManageDao getiTcrcBaseManageDao() {
		return iTcrcBaseManageDao;
	}


	public void setiTcrcBaseManageDao(ITcrcBaseManageDao iTcrcBaseManageDao) {
		this.iTcrcBaseManageDao = iTcrcBaseManageDao;
	}


	@Override
	public Result execute(Map<String, Object> parameterMap) {
		Result result = new Result();
		try {
			PageBean pageBean = new PageBean(parameterMap);
			RowLimit limit = pageBean.getRowLimit();
			PageHelper.offsetPage(limit.getOffset(), limit.getLimit());
			List<Map> rowList = iTcrcBaseManageDao.selectWorkOrder(parameterMap, pageBean.getRowLimit());
			Page pageInfo = (Page) rowList;
		    pageBean.setList(rowList);
		    pageBean.setCount((int) pageInfo.getTotal());
		    Map resultMap=pageBean.getResult();
		    result.setSuccess(true);
		    result.setContent(resultMap);
		} catch (Exception e) {
			result.setSuccess(false);
			result.setMessage("查询失败:" + e.getMessage());
		}
		
		return result;
	}
	

	/**
	 * 附加工单数据
	 * @param listmap
	 * @param workapp_idlist
	 */
	private void wrapWorkappData(List<Map<String, Object>> listmap) {
		List<String > list=new ArrayList<String >();
		for(Map<String, Object>  item : listmap){
			list.add((String) item.get("workapp_ID"));
		}		
// 		List<Map> workOrder = iTcrcBaseManageDao.selectWorkOrder(list);
//		mergeList(listmap, workOrder);
	}
	
	/**
	 * 合并list
	 * @param listmap
	 * @param workOrders
	 */
	private void mergeList(List<Map<String, Object>> target, List<Map> workList) {
		
		Map<String, Map> tempMap = new HashMap<>();
		
		for(Map<String, Object>  item : workList) {
			Map<String, Object>  newItem = new HashMap<>();
			for(String key: item.keySet()) {
				newItem.put("workapp_" + key, item.get(key));
			}
			tempMap.put((String) item.get("ID"), newItem);
		}
		
		for(Map<String, Object> item: target) {
			String id = (String) item.get("workapp_ID");
			if(tempMap.containsKey(id)) {
				item.putAll(tempMap.get(id));
			}
		}
	}


	/**
	 * @return the iWorkFlowService
	 */
	public IWorkFlowService getiWorkFlowService() {
		return iWorkFlowService;
	}

	/**
	 * @param iWorkFlowService
	 *            the iWorkFlowService to set
	 */
	public void setiWorkFlowService(IWorkFlowService iWorkFlowService) {
		this.iWorkFlowService = iWorkFlowService;
	}

	

}
