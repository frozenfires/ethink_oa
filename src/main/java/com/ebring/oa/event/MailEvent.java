/**
 * Ethink 2017 copyright
 * 
 */
package com.ebring.oa.event;

import java.io.Serializable;
import java.util.Map;
import java.util.Set;

import org.activiti.engine.task.IdentityLink;

/**
 *
 * 描述:
 * @author wangjing.dc@qq.com
 */
public class MailEvent implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -7558047475441069017L;
	private String taskName;
	private String businessKey;
	private Map<String, Object> Variables;
	private Set<IdentityLink> taskCandidates;
	
	/**
	 * @return the taskCandidates
	 */
	public Set<IdentityLink> getTaskCandidates() {
		return taskCandidates;
	}
	/**
	 * @return the variables
	 */
	public Map<String, Object> getVariables() {
		return Variables;
	}
	/**
	 * @param variables the variables to set
	 */
	public void setVariables(Map<String, Object> variables) {
		Variables = variables;
	}
	/**
	 * @param taskCandidates the taskCandidates to set
	 */
	public void setTaskCandidates(Set<IdentityLink> taskCandidates) {
		this.taskCandidates = taskCandidates;
	}
	/**
	 * @return the taskName
	 */
	public String getTaskName() {
		return taskName;
	}
	/**
	 * @param taskName the taskName to set
	 */
	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}
	/**
	 * @return the businessKey
	 */
	public String getBusinessKey() {
		return businessKey;
	}
	/**
	 * @param businessKey the businessKey to set
	 */
	public void setBusinessKey(String businessKey) {
		this.businessKey = businessKey;
	}
	
}
