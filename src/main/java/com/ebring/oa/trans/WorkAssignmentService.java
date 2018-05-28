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

//工单审批服务
public class WorkAssignmentService implements IService {

    private static final Logger log = Logger.getLogger(AppWorkService.class);

    private static final String WORK_NEW_BUILD = "1";
    private static final String WORK_WAIT_ASSIGNMENT = "2";
    private static final String WORK_ASSIGNMENT_REJECT = "3";
    private static final String WORK_ASSIGNMENT_VETO = "4";
    private static final String WORK_ASSIGNMENT_SUSPEND = "5";
    private static final String WORK_WAIT_DEAL = "6";
    private static final String WORK_IN_DEAL = "7";
    private static final String WORK_WAIT_EXAMIN = "8";
    private static final String WORK_EXAMIN_REJECT = "9";
    private static final String WORK_FINISH = "10";
	
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
    	Result result = new Result();
    	
       	try {
       
    		String taskId = parameterMap.get("TASKID").toString();
    		String userid = parameterMap.get("USER_ID").toString();
    		String proposer = parameterMap.get("PROPOSER").toString();
    		String worker = parameterMap.get("WORKER").toString();
    		String remark = parameterMap.get("REMARK").toString();
    		String workstatus = parameterMap.get("WORKSTATUS").toString();
    		String operation = parameterMap.get("OPERATION").toString().toUpperCase();
    		
    		if (workstatus.equals(WORK_ASSIGNMENT_SUSPEND)) {
				log.info("工单审批-激活: taskId=[" + taskId + "]");
        		iWorkFlowService.taskActivate(taskId, null);
			}
    		
    		Map<String, Object> variables = new HashMap<>();
    		variables.put("work_owner", proposer);
    		
    		switch (operation) {
	    		case "REBUT":
	    			variables.put("status", "Reject");
	    			log.info("工单审批-驳回: taskId=[" + taskId + "] userid=[" + userid + "] variables=[" + variables.toString() + "]");
	        		iWorkFlowService.taskCompleteByProcessInstanceId(taskId, userid, variables, remark, WorkStatus.ASSIGNMENT_REJECT);
	    	    break;
	    		case "VETO":
	    			variables.put("status", "negative");
	    			log.info("工单审批-否决: taskId=[" + taskId + "] userid=[" + userid + "] variables=[" + variables.toString() + "]");
	        		iWorkFlowService.taskCompleteByProcessInstanceId(taskId, userid, variables, remark, WorkStatus.ASSIGNMENT_VETO);
	    		break;
	    		case "DISPATCH":
	    			variables.put("work_executor", worker);
	    			if (workstatus.equals(WORK_WAIT_DEAL) || workstatus.equals(WORK_IN_DEAL)) {
	    				variables.put("status", "reassign");
	    				log.info("工单审批-重新派单: taskId=[" + taskId + "] userid=[" + userid + "] variables=[" + variables.toString() + "]");
		        		iWorkFlowService.taskCompleteByProcessInstanceId(taskId, userid, variables, remark, WorkStatus.ASSIGNMENT_DISPATCH_AGIN);
	    			}else {
	    				variables.put("status", "assignment");
	    				log.info("工单审批-派单: taskId=[" + taskId + "] userid=[" + userid + "] variables=[" + variables.toString() + "]");
		        		iWorkFlowService.taskCompleteByProcessInstanceId(taskId, userid, variables, remark, WorkStatus.ASSIGNMENT_DISPATCH);
	    			}
	        		
	    		break;
	    		case "SUSPEND":
	    			log.info("工单审批-挂起: taskId=[" + taskId + "]");
	    			TaskComment taskComment = new TaskComment();
	    			taskComment.setMessage(remark);
	    			taskComment.setVariable("status", "suspend");
	    			iWorkFlowService.taskSuspend(taskId, taskComment, WorkStatus.ASSIGNMENT_SUSPEND);
	    		break;
    	    }
    		iTcrcBaseManageDao.updateAssignment(parameterMap);
    		result.setSuccess(true);
     	}catch(Exception e) {
     		log.error("工单审批失败。。。");
     		log.error(Util.getStackTrace(e));
             result.setSuccess(false);
             result.setMessage(e.getMessage());
     	}
    	
    	return result;
    }
}
