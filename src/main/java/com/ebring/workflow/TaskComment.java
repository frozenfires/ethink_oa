/**
 * Ethink 2017 copyright
 * 
 */
package com.ebring.workflow;

import java.util.HashMap;
import java.util.Map;

/**
 *
 * 描述: 批注信息Bean
 * @author wangjing.dc@qq.com
 */
public class TaskComment {

	private String message;
	private Map<String, Object> variable = new HashMap<>();
	/**
	 * @return the message
	 */
	public String getMessage() {
		return message;
	}
	/**
	 * @param message the message to set
	 */
	public void setMessage(String message) {
		this.message = message;
	}
	/**
	 * @return the variable
	 */
	public Object getVariable() {
		return variable;
	}
	/**
	 * @param variable the variable to set
	 */
	public void setVariable(String varName, Object variable) {
		this.variable.put(varName, variable);
	}
	
	
	
}
