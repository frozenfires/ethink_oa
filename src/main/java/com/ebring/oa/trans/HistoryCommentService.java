package com.ebring.oa.trans;

import java.util.List;
import java.util.Map;

import org.activiti.engine.task.Comment;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.workflow.IWorkFlowService;


/**
 * 历史评论批注查询
 * @author df
 *
 */
public class HistoryCommentService implements IService {

	
	private IWorkFlowService iWorkFlowService;
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
	
	@Override
	public Result execute(Map<String, Object> parameterMap) {
		String processInstanceId = parameterMap.get("TASKID").toString();
		 Result result=new Result();
		 List<Object> commentList=null;
		try {
		    commentList = iWorkFlowService.queryProcessHistory(processInstanceId);
		} catch (Exception e) {
			result.setSuccess(false);
		}
		result.setSuccess(true);
		result.setContent(commentList);
		return result;
	}

}
