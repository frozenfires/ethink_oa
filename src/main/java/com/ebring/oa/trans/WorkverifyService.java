package com.ebring.oa.trans;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.ebring.platform.common.page.PageBean;
import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.GlobalTcrc;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;
import com.ebring.workflow.IWorkFlowService;
import com.ebring.workflow.WorkStatus;


public class WorkverifyService implements IService {
	private static final Logger log = Logger.getLogger(AppWorkService.class);
	private IWorkFlowService iWorkFlowService;
	private ITcrcBaseManageDao iTcrcBaseManageDao;
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
		System.out.println("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    	log.info(parameterMap);
    	String operation = parameterMap.get("OPERATION").toString().toUpperCase();
    	System.out.println("2222222222222222222222222222222");
    	System.out.println(operation);
    	switch (operation) {
    		case "VERIFY":
    			return verify(parameterMap);
    		case "NOTVERIFY":
    			return notverify(parameterMap);
    		
    	}
		return null;
	
	}

	public Result notverify(Map parameterMap) {
	Result result = new Result();
	try {
	String taskId = parameterMap.get("WORK_FLOW_ID").toString();
	String userid = parameterMap.get("USER_ID").toString();
	String remark = parameterMap.get("REMARK").toString();
	Map<String, Object> variables = new HashMap<>();
	variables.put("status","unconfirm");
	iWorkFlowService.taskCompleteByProcessInstanceId(taskId, userid, variables,remark,WorkStatus.VERIFY_NOT_PASS);
	iTcrcBaseManageDao.updateNotVerify(parameterMap);
	result.setSuccess(true);
}catch(Exception e) {
		log.error("工单审验不通过失败。。。");
		log.error(Util.getStackTrace(e));
     result.setSuccess(false);
     result.setMessage(e.getMessage());
	}
	return result;
	}



	//审验通过
	public Result verify(Map parameterMap) {
		Result result = new Result();
		try {
		String taskId = parameterMap.get("WORK_FLOW_ID").toString();
		String userid = parameterMap.get("USER_ID").toString();
		String remark = parameterMap.get("REMARK").toString();
		Map<String, Object> variables = new HashMap<>();
		variables.put("status","confirm");
		iWorkFlowService.taskCompleteByProcessInstanceId(taskId, userid, variables,remark,WorkStatus.VERIFY_PASS);
		iTcrcBaseManageDao.updateVerify(parameterMap);
		result.setSuccess(true);
	}catch(Exception e) {
 		log.error("工单审验失败。。。");
 		log.error(Util.getStackTrace(e));
         result.setSuccess(false);
         result.setMessage(e.getMessage());
 	}
		return result;
	}
	

}
