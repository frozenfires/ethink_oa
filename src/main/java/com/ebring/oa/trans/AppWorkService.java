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


public class AppWorkService implements IService {

    private static final Logger log = Logger.getLogger(AppWorkService.class);

    private ITcrcBaseManageDao iTcrcBaseManageDao;

    public ITcrcBaseManageDao getiTcrcBaseManageDao() {
        return iTcrcBaseManageDao;
    }

    public void setiTcrcBaseManageDao(ITcrcBaseManageDao iTcrcBaseManageDao) {
        this.iTcrcBaseManageDao = iTcrcBaseManageDao;
    }
    private IWorkFlowService iWorkFlowService;

    public IWorkFlowService getiWorkFlowService() {
        return iWorkFlowService;
    }

    public void setiWorkFlowService(IWorkFlowService iWorkFlowService) {
        this.iWorkFlowService = iWorkFlowService;
    }

    @Override
    public Result execute(Map parameterMap) {
        return updateExecute(parameterMap);
    }

    public Result updateExecute(Map parameterMap) {

        Result result = new Result();


        try {



            String workid = parameterMap.get("WORK_ID").toString();

            //插入工单信息
            int insert_result = iTcrcBaseManageDao.insertAppWork(parameterMap);

            List list = iTcrcBaseManageDao.QueryApprover(parameterMap);


            String userid = (String) parameterMap.get(GlobalTcrc.PARAM_USER_ID);

            List list_new = new ArrayList();

            for (int i = 0; i < list.size(); i++) {
                Map map_userid = (Map) list.get(i);
                list_new.add(map_userid.get("USER_ID"));

            }
            log.debug("申请工单传入参数： [userid:" + userid + "],[workid:" + workid + "] [list_new:" + list_new + "]");
            String processId = iWorkFlowService.startProcess("work-form", userid, workid, list_new, "新建工单", WorkStatus.CREATE);

            Map<String, Object> map = new HashMap<>();

            map.put("ID_P", workid);
            map.put("WORK_FLOW_ID", processId);

            int _result = iTcrcBaseManageDao.updateAppwork(map);
            if (_result != 0 && insert_result != 0) {
                result.setSuccess(true);
            } else {
                result.setSuccess(false);
                result.setMessage("insertResult:" + insert_result + ",updataresult:" + _result);
            }


        } catch (Exception e) {

            log.error(Util.getStackTrace(e));
            result.setSuccess(false);
            result.setMessage(e.getMessage());
        }


        return result;
    }


}
