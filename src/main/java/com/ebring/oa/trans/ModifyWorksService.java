package com.ebring.oa.trans;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.GlobalTcrc;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;
import com.ebring.workflow.IWorkFlowService;
import com.ebring.workflow.WorkStatus;

import org.apache.log4j.Logger;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ModifyWorksService implements IService {

    private static final Logger log = Logger.getLogger(ModifyWorksService.class);

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
        return modify(parameterMap);
    }


    public Result modify(Map parameterMap) {
        Result result = new Result();
        try{

            String taskId = parameterMap.get("WORK_FLOW_ID").toString();

            String userid = (String) parameterMap.get(GlobalTcrc.PARAM_USER_ID);

            parameterMap.put("WORK_STATUS_P","2");

            Map<String, Object> variables = new HashMap<>();


            log.debug("修改工单信息: taskId=[" + taskId + "] userid=[" + userid + "] variables=[" + variables.toString() + "]");
            iWorkFlowService.taskCompleteByProcessInstanceId(taskId, userid, variables, "", WorkStatus.MODIFY);

            iTcrcBaseManageDao.updateworks(parameterMap);
            result.setSuccess(true);

        }catch (Exception e) {

            log.error(Util.getStackTrace(e));
            result.setSuccess(false);
            result.setMessage(e.getMessage());
        }


        return result;
    }
}
