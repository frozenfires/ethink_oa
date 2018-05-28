/**
 * Ethink 2017 copyright
 * 
 */
package com.ebring.workflow;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.HistoryService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricProcessInstanceQuery;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.history.HistoricVariableInstance;
import org.activiti.engine.history.HistoricVariableInstanceQuery;
import org.activiti.engine.impl.identity.Authentication;
import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Comment;
import org.activiti.engine.task.Task;
import org.activiti.engine.task.TaskQuery;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ebring.platform.common.page.PageBean;
import com.ebring.platform.common.page.RowLimit;
import com.ebring.tcrc.common.UserInfo;

/**
 *
 * 描述: 工作流引擎服务
 * 
 * @author wangjing.dc@qq.com
 */
@Service(value = "workflowservice")
@Transactional
public class ActWorkFlowCommServiceImpl implements IWorkFlowService {

	private static final Logger log = LoggerFactory.getLogger(ActWorkFlowCommServiceImpl.class);

	@Autowired
	private RepositoryService repositoryService;

	@Autowired
	private RuntimeService runtimeService;

	@Autowired
	private TaskService taskService;

	@Autowired
	private HistoryService historyService;
	
	@Override
	public String startProcess(String flowid, String userid, String businessId, List<String> work_admin, Object comment, WorkStatus status) {
		Map<String, Object> vars = new HashMap<String, Object>();
		vars.put("userid", userid);
		vars.put("businessId", businessId);
		vars.put("work_admin", work_admin);

		log.info(String.format("==========>启动流程实例, userid=%s, businessId=%s, workd_admin=%s", userid, businessId,
				work_admin.toString()));
		ProcessInstance pi = runtimeService.startProcessInstanceByKey(flowid, businessId, vars);
		// 根据流程实例Id查询任务
		Task task = taskService.createTaskQuery().processInstanceId(pi.getProcessInstanceId()).singleResult();
		
		// 添加批注信息
		TaskComment tc = wrapTaskComment(comment);
		this.taskComplete(task, userid, vars, tc, status);

		return pi.getProcessInstanceId();
	}

	@Override
	public PageBean queryMyTask(String userid, PageBean pageInfo) {
		HistoricProcessInstanceQuery hispi = historyService.createHistoricProcessInstanceQuery();
		List<HistoricProcessInstance> a = hispi.involvedUser(userid).unfinished().list();
		log.debug("*****************************************", a.toString());
//		historicProcessInstanceQuery
		
		return this.queryMyTask(userid, null, pageInfo);
	}
	
	@Override
	public PageBean queryMyTask(String userid, String taskName, PageBean pageInfo) {
		RowLimit limit = pageInfo.getRowLimit();
		TaskQuery taskQuery = taskService.createTaskQuery().taskCandidateUser(userid);// .taskAssignee(userid);
		if(taskName != null) {
			taskQuery.taskName(taskName);
		}
		List<Task> list = taskQuery.orderByTaskCreateTime().desc().listPage(limit.getOffset(), limit.getLimit());
		long total = taskQuery.count();
		List<Map<String, Object>> listmap = new ArrayList<Map<String, Object>>();
		for (Task task : list) {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("id", task.getId());
			map.put("name", task.getName());
			map.put("description", task.getDescription());
			map.put("priority", task.getPriority());
			map.put("owner", task.getOwner());
			map.put("assignee", task.getAssignee());
			map.put("delegationState", task.getDelegationState());
			map.put("processInstanceId", task.getProcessInstanceId());
			map.put("executionId", task.getExecutionId());
			map.put("processDefinitionId", task.getProcessDefinitionId());
			map.put("createTime", task.getCreateTime());
			map.put("taskDefinitionKey", task.getTaskDefinitionKey());
			map.put("dueDate", task.getDueDate());
			map.put("category", task.getCategory());
			map.put("parentTaskId", task.getParentTaskId());
			map.put("tenantId", task.getTenantId());

			log.debug("当前流程变量：" + task.getProcessVariables());
			String workapp_id = (String) runtimeService.getVariable(task.getExecutionId(), "businessId");
			
			map.put("workapp_ID", workapp_id);
			listmap.add(map);
		}

		pageInfo.setCount((int) total);
		pageInfo.setList(listmap);
		
		return pageInfo;
	}
	
	@Override
	public void taskCompleteByProcessInstanceId(String processInstanceId, String userId, Map<String, Object> variables,
			Object comment, WorkStatus status) {
		this.taskComplete(queryLastTask(processInstanceId), userId, variables, this.wrapTaskComment(comment), status);
	}
	
	@Override
	public void taskCompleteByTaskId(String taskId, String userId, Map<String, Object> variables, Object comment, WorkStatus status) {
		taskService.createTaskQuery().processInstanceId(taskId).orderByTaskCreateTime();

		// 任务Id 查询任务对象
		Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
		
		this.taskComplete(task, userId, variables, this.wrapTaskComment(comment), status);
	}

	/**
	 * 
	 * @param task task对象
	 * @param userId 当前用户id
	 * @param variables 附带变量
	 * @param comment 批注信息
	 */
	private void taskComplete(Task task, String userId, Map<String, Object> variables, TaskComment comment, WorkStatus status) {
		log.debug("当前处理任务 taskComplete================" + task.toString());
		log.debug("variables=" + variables);
		
		// 任务对象 获取流程实例Id
		String processInstanceId = task.getProcessInstanceId();
		
		// 设置操作人userId
		Authentication.setAuthenticatedUserId(userId);
		task.setAssignee(userId);
		task.setOwner(userId);

		// 添加记录
		this.taskComment(processInstanceId, comment, status);

		taskService.setVariablesLocal(task.getId(), variables);
		taskService.setVariables(task.getId(), variables);
		// 完成办理
		taskService.complete(task.getId(), variables);
		
		
	//List<Task> list = taskService.createTaskQuery().active().list();
//		  List<Task> tasks = taskService.createTaskQuery().
//
//	    	         .orderByDueDate().asc()
//    	         .excludeSubtasks()
//	    	         .list();
	       
	  //  System.out.println(list.size()+"**************************************************");
	  
	    
	}
	
	
	

	@Override
	public List<Object> queryProcessHistory(String processInstanceId) {
		
		List<Object> list = new ArrayList<Object>();		
		List<HistoricTaskInstance> htilist = historyService.createHistoricTaskInstanceQuery()
				.processInstanceId(processInstanceId).orderByTaskCreateTime().desc().list();

		if (htilist != null && htilist.size() > 0) {
			for (int index = 0; index < htilist.size(); index++) {
				HistoricTaskInstance task = htilist.get(index);
				log.debug(task.toString());
				 
				HistoricVariableInstanceQuery  query = 	historyService.createHistoricVariableInstanceQuery().taskId(task.getId());
				List<HistoricVariableInstance> hisVars = query.list();
				List<Comment> tasklist = taskService.getTaskComments(task.getId());
				
				List<Map<String, Object>> result = new ArrayList<>();
				if(tasklist == null || tasklist.size() <= 0) {
					result.add(buildComment(task, null, hisVars));
				}else {
					for(Comment comment : tasklist) {
						result.add(buildComment(task, comment, hisVars));
					}
				}
			
				list.addAll(result);
			}
		}
		
		
		
		return list;
	}

	/**
	 * 构建单个批注信息
	 * @param task
	 * @param comment
	 * @param hisVars 
	 * @return
	 */
	private Map<String, Object> buildComment(HistoricTaskInstance task, Comment comment, List<HistoricVariableInstance> hisVars) {

		Map<String,Object> map=new HashMap<String, Object>();
		
		map.put("comment_data", "");
		for(HistoricVariableInstance var : hisVars) {
			if(("comment_"+comment.getId()).equals(var.getVariableName())) {
				map.put("comment_data", var.getValue());
			}else {
				map.put("task_" + var.getVariableName(), var.getValue());
			}
		}
		map.put("processInstanceId", task.getProcessInstanceId() );
		map.put("status", task.getName());
		
		Date commentTime = comment == null ? task.getStartTime() : comment.getTime();
		map.put("time", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(commentTime));
		map.put("timeObject", commentTime);
		map.put("taskid", task.getId());
		map.put("owner", task.getOwner());
		map.put("assignee", task.getAssignee());
		map.put("category",  task.getCategory());
		map.put("comment", comment == null ? "" : comment.getFullMessage());
		map.put("userId", comment == null ? "" : comment.getUserId());
		
		
		return map;
	}

	@Override
	public WorkFlowImageBean queryCurrentView(String taskId) throws Exception {
		Task task = taskService.createTaskQuery() // 创建任务查询
				.taskId(taskId) // 根据任务id查询
				.singleResult();
		// 获取流程定义id
		String processDefinitionId = task.getProcessDefinitionId();
		ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery() // 创建流程定义查询
				// 根据流程定义id查询
				.processDefinitionId(processDefinitionId).singleResult();

		ProcessDefinitionEntity processDefinitionEntity = (ProcessDefinitionEntity) repositoryService
				.getProcessDefinition(processDefinitionId);
		// 获取流程实例id
		String processInstanceId = task.getProcessInstanceId();
		// 根据流程实例id获取流程实例
		ProcessInstance pi = runtimeService.createProcessInstanceQuery().processInstanceId(processInstanceId)
				.singleResult();
		// 根据活动id获取活动实例
		ActivityImpl activityImpl = processDefinitionEntity.findActivity(pi.getActivityId());

		WorkFlowImageBean wfIamge = new WorkFlowImageBean();
		// 部署id
		wfIamge.setDeploymentId(processDefinition.getDeploymentId());
		wfIamge.setDiagramResourceName(processDefinition.getDiagramResourceName());
		// wfIamge.setDiagramResourceName(URLDecoder.decode(processDefinition.getDiagramResourceName()));
		// // 图片资源文件名称
		// 整理好View视图返回到显示页面
		wfIamge.setX(activityImpl.getX()); // x坐标
		wfIamge.setY(activityImpl.getY()); // y坐标
		wfIamge.setWidth(activityImpl.getWidth()); // 宽度
		wfIamge.setHeight(activityImpl.getHeight()); // 高度

		return wfIamge;
	}

	@Override
	public boolean taskActivate(String processInstanceId, TaskComment comment) {
		try {
//			this.taskComment(processInstanceId, comment);
			runtimeService.activateProcessInstanceById(processInstanceId);
		} catch (Exception e) {
			log.error(null, e);
			return false;
		}

		return true;
	}

	@Override
	public boolean taskSuspend(String processInstanceId, TaskComment comment, WorkStatus status) {
		try {
			this.taskComment(processInstanceId, comment, status);
			runtimeService.suspendProcessInstanceById(processInstanceId);
		} catch (Exception e) {
			log.error(null, e);
			return false;
		}

		return true;
	}
	
	/**
	 * 查找当前流程最后一个task
	 * @param processInstanceId
	 * @return
	 */
	private Task queryLastTask(String processInstanceId) {
		
		Task task = taskService.createTaskQuery().processInstanceId(processInstanceId).singleResult();
		if(task == null) {
			throw new RuntimeException("流程丢失[processInstanceId="+processInstanceId+"]");
		}
		
		return task;
	}

	@Override
	public void taskComment(String processInstanceId, TaskComment comment, WorkStatus status) {
		if(comment == null) return;
		
		Task task = this.queryLastTask(processInstanceId);
		
		if(Authentication.getAuthenticatedUserId() == null)
			Authentication.setAuthenticatedUserId(this.findCurrentUser());
		
		comment.setVariable("status", status);
		Comment comm = taskService.addComment(task.getId(), processInstanceId, comment.getMessage());
		taskService.setVariableLocal(task.getId(), "comment_" + comm.getId(), comment.getVariable());
	}
	
	/**
	 * 封装taskComment对象
	 * @param comment
	 * @return
	 */
	private TaskComment wrapTaskComment(Object comment) {
		if(comment instanceof TaskComment){
			return (TaskComment) comment;
		}
		
		TaskComment tc = new TaskComment();		
		if(comment == null) {
			tc.setMessage("");
		}
		else if(comment instanceof String) {
			tc.setMessage((String) comment);
		}else {
			tc.setVariable("data", comment);
		    
		}
		
		return tc;
	}

	/**
	 * 获取系统登录用户id
	 * @return
	 */
	private String findCurrentUser() {
		Subject currentUser = SecurityUtils.getSubject();
		UserInfo userInfo = (UserInfo) currentUser.getSession().getAttribute(
				"UserInfo");
		return userInfo.getUserID();
	}

	@Override
	public List<Comment> queryContents(String processInstanceId) {
		List<Comment> commentList = taskService
				.getProcessInstanceComments(processInstanceId);
		// 改变顺序，按原顺序的反向顺序返回list
		Collections.reverse(commentList);
		return commentList;
	}
	

}
