/**
 * 
 */
package com.ebring.workflow;

/**
 * 工单状态
 * @author ChenQuanHong
 *
 */
public enum WorkStatus {
	CREATE, //新建工单
	MODIFY, //修改工单
	ASSIGNMENT_REJECT,//审批驳回
    ASSIGNMENT_VETO,//审批否决
	ASSIGNMENT_SUSPEND,//审批挂起
	ASSIGNMENT_DISPATCH,//审批派单
	ASSIGNMENT_DISPATCH_AGIN,//审批重新派单
	DEAL_NOT_FINSH,//处理未完成
	DEAL_FINSH,//处理完成
    VERIFY_PASS,//审验通过
	VERIFY_NOT_PASS//审验不通过
}
