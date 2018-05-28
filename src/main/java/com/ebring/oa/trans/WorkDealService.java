package com.ebring.oa.trans;

import com.ebring.platform.common.service.IService;

import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;

import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;
import com.ebring.workflow.IWorkFlowService;
import com.ebring.workflow.TaskComment;
import com.ebring.workflow.WorkStatus;

import org.apache.log4j.Logger;


import java.util.ArrayList;
import java.util.HashMap;

import java.util.List;
import java.util.Map;

//工单处理服务
public class WorkDealService implements IService {

    private static final Logger log = Logger.getLogger(AppWorkService.class);

    private ITcrcBaseManageDao iTcrcBaseManageDao;
    private IWorkFlowService iWorkFlowService;

    public ITcrcBaseManageDao getiTcrcBaseManageDao() {
        return iTcrcBaseManageDao;
    }

    public void setiTcrcBaseManageDao(ITcrcBaseManageDao iTcrcBaseManageDao) {
        this.iTcrcBaseManageDao = iTcrcBaseManageDao;
    }

    public IWorkFlowService getiWorkFlowService() {
        return iWorkFlowService;
    }

    public void setiWorkFlowService(IWorkFlowService iWorkFlowService) {
        this.iWorkFlowService = iWorkFlowService;
    }

    @Override
    public Result execute(Map parameterMap) {
      
    	log.info(parameterMap);
    	String operation = parameterMap.get("OPERATION").toString();
    	if(operation.equals("2")){
    		return dispatchExecute(parameterMap); 
    	}else{
    		return dispatchExecute_dealIn(parameterMap);
    	}   	 
    	
    }
    
     
    //工单处理
    public Result dispatchExecute(Map parameterMap) {
       	Result result = new Result();
       	try {
    		String taskId = parameterMap.get("TASKID").toString();
    		String userid = parameterMap.get("USER_ID").toString();
    		String proposer = parameterMap.get("PROPOSER").toString();
    		String ADDRESS_ID = parameterMap.get("ADDRESS_ID_P").toString();
    		String deal_desc = parameterMap.get("deal_desc").toString();
    		String dealMessage_ID = parameterMap.get("dealMessage_ID").toString();
    		log.debug("------------------------查询客户所在区域ID：" + ADDRESS_ID);
    		Map<String, Object> variables = new HashMap<>();
    		variables.put("status", "complete");
    		variables.put("work_owner", proposer);		
    		List list = iTcrcBaseManageDao.QueryVerify(parameterMap);
    		log.debug("------------------------查询出可审验人：" + list);
    		List list_new = new ArrayList();

            for(int i = 0;i<list.size();i++) {
                 Map map_userid =(Map) list.get(i);
                 list_new.add(map_userid.get("USER_ID"));
                 log.debug("可审批人数组---------------"+list_new);
            }
            //list_new.add("admin");               
            variables.put("work_confirmer", list_new);
    		log.info("rebutExecute: taskId=[" + taskId + "] userid=[" + userid + "] variables=[" + variables.toString() + "]");
    		
    		TaskComment comment = new TaskComment();
    		comment.setMessage(deal_desc);
    		comment.setVariable("data",dealMessage_ID);
    		iWorkFlowService.taskCompleteByProcessInstanceId(taskId, userid, variables, comment,WorkStatus.DEAL_FINSH);
    		iTcrcBaseManageDao.updateWorkDeal(parameterMap);
    		result.setSuccess(true);
     	}catch(Exception e) {
     		log.error("工单处理失败。。。");
     		log.error(Util.getStackTrace(e));
             result.setSuccess(false);
             result.setMessage(e.getMessage());
     	}
    	
    	return result;
    }
    
    //工单处理中
    public Result dispatchExecute_dealIn(Map parameterMap) {
       	Result result = new Result();
       	try {
    		String taskId = parameterMap.get("TASKID").toString();
    		String userid = parameterMap.get("USER_ID").toString();
    		String workid = parameterMap.get("WORKAPP_ID").toString();
    		String proposer = parameterMap.get("PROPOSER").toString();
    		String dealMessage_ID = parameterMap.get("dealMessage_ID").toString();
    		String deal_desc = parameterMap.get("deal_desc").toString();
    		log.info("rebutExecute: taskId=[" + taskId + "] userid=[" + userid + "] variables=[" + workid.toString() + "]");
    		
    		TaskComment comment = new TaskComment();
    		comment.setMessage(deal_desc);
    		comment.setVariable("data",dealMessage_ID);
    		
    		iWorkFlowService.taskComment(taskId, comment,WorkStatus.DEAL_NOT_FINSH);    		
    		iTcrcBaseManageDao.updateWorkDeal_in(parameterMap);
    		result.setSuccess(true);
     	}catch(Exception e) {
     		log.error("工单处理失败。。。");
     		log.error(Util.getStackTrace(e));
            result.setSuccess(false);
            result.setMessage(e.getMessage());
     	}
    	
    	return result;
    }
}
