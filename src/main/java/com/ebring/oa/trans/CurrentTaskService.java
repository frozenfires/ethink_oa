package com.ebring.oa.trans;

import java.util.Map;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.workflow.IWorkFlowService;
import com.ebring.workflow.WorkFlowImageBean;

/**
 * 查询当前业务流程图
 * @author df
 *
 */
public class CurrentTaskService implements IService{

	

	public IWorkFlowService getiWorkFlowService() {
		return iWorkFlowService;
	}

	public void setiWorkFlowService(IWorkFlowService iWorkFlowService) {
		this.iWorkFlowService = iWorkFlowService;
	}

	private IWorkFlowService iWorkFlowService;
	
	@Override
	public Result execute(Map<String, Object> parameterMap) {
		 String taskId=(String) parameterMap.get("TASKID");
		 WorkFlowImageBean showCurrentView=null;
		 Result result=new Result();
		try {
			 showCurrentView = iWorkFlowService.queryCurrentView(taskId);
		} catch (Exception e) {
			 result.setSuccess(false);
			 result.setMessage("查询失败:"+e.getMessage()); 
		}
		     result.setSuccess(true);
		     result.setContent(showCurrentView);
		return result;
	}	 
}
