/**
 * Ethink 2017 copyright
 * 
 */
package com.ebring.workflow;

import java.util.List;
import java.util.Map;

import org.activiti.engine.task.Comment;

import com.ebring.platform.common.page.PageBean;

/**
 *
 * 描述: 工作流引擎服务接口
 * @author wangjing.dc@qq.com
 */
public interface IWorkFlowService {

	/**
	 * 启动流程实例
	 * 
	 * @param flowid 流程定义id
	 * @param userid 当前用户id
	 * @param businessId 业务逻辑id
	 * @param work_admin 审批人列表
	 * @param comment 批注信息
	 * @param status 工单状态
	 * 
	 * @return 流程实例id
	 */
	public String startProcess(String flowid, String userid, String businessId, List<String> work_admin, Object comment, WorkStatus status);

	/**
	 * 完成提交任务
	 * 
	 * @param processInstanceId
	 *            流程实例id
	 * @param userId
	 *            操作人id
	 * @param comment
	 *            备注
	 * @param variables
	 *            业务变量
	 * @param status 工单状态
	 */
	public void taskCompleteByProcessInstanceId(String processInstanceId, String userId, Map<String, Object> variables,
			Object comment, WorkStatus status);

	/**
	 * 完成提交任务
	 * 
	 * @param taskId
	 *            任务id
	 * @param userId
	 *            操作人id
	 * @param comment
	 *            备注
	 * @param variables
	 *            业务变量
	 * @param status 工单状态
	 */
	public void taskCompleteByTaskId(String taskId, String userId, Map<String, Object> variables, Object comment, WorkStatus status);

	/**
	 * 添加task 批注信息
	 * @param processInstanceId 流程实例id
	 * @param subBusinessId 子业务id
	 * @param comment 批注
	 * @param status 工单状态
	 */
	public void taskComment(String processInstanceId, TaskComment comment, WorkStatus status);
	
	/**
	 * 查看个人任务列表
	 * @param userid 用户id
	 * @param pageInfo 分页信息
	 * @return 任务列表分页数据
	 */
	public PageBean queryMyTask(String userid, PageBean pageInfo);
	
	/**
	 * 查看指定任务的个人任务列表
	 * @param userid 用户id
	 * @param taskName 任务名称
	 * @param pageInfo 分页信息
	 * @return 任务列表分页数据
	 */
	public PageBean queryMyTask(String userid, String taskName, PageBean pageInfo);
	
	/**
	 * 查询批注信息
	 * @param processInstanceId 流程实例id
	 * @param 
	 * @return boolean
	 */
	public 	List<Comment>   queryContents(String processInstanceId);
	
	
	
	/**
	 * 流程激活
	 * 
	 * @param processInstanceId 流程实例id
	 * @param comment 批注信息
	 * @return boolean
	 */
	public boolean  taskActivate(String processInstanceId ,TaskComment remark );
	
	/**
	 * 流程挂起
	 * @param processInstanceId 流程实例id
	 * @param comment 批注信息
	 * @param status 工单状态
	 * @return boolean
	 */
	public boolean taskSuspend(String processInstanceId ,TaskComment comment, WorkStatus status);
	
	/**
	 * 查看当前流程图
	 * @param taskId
	 * @return
	 * @throws Exception
	 */
	public WorkFlowImageBean queryCurrentView(String taskId) throws Exception;

	/**
	 * 查询流程历史信息
	 * 
	* @param processInstanceId
	 *            流程实例ID
	 * @return 流程历史信息
	 * @throws Exception 
	 */
	public List<Object> queryProcessHistory(String processInstanceId) throws Exception;

	
}
