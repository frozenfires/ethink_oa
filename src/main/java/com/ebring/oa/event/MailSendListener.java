/**
 * Ethink 2017 copyright
 * 
 */
package com.ebring.oa.event;

import org.activiti.engine.delegate.event.ActivitiEventType;

import com.ebring.workflow.IWorkFlowService;

/**
 *
 * 描述:
 * @author wangjing.dc@qq.com
 */
public interface MailSendListener {

	/**
	 * 发送邮件
	 * @param mailContent 邮件内容
	 * @param flowService 流程引擎服务
	 */
	public void sendMail(Object mailContent, IWorkFlowService flowService);

	/**
	 * 生成邮件内容
	 * @param event
	 * @return
	 */
	public Object buildMailContent(ActivitiEventType type, MailEvent buildMailEvent);

}
