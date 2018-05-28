package com.ebring.oa.event;

import java.io.Serializable;
import java.util.Map;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

import org.activiti.engine.delegate.event.ActivitiEntityEvent;
import org.activiti.engine.delegate.event.ActivitiEvent;
import org.activiti.engine.delegate.event.ActivitiEventListener;
import org.activiti.engine.delegate.event.ActivitiEventType;
import org.activiti.engine.impl.persistence.entity.TaskEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import com.ebring.workflow.IWorkFlowService;
;

/**
 * 工单系统流程监听器
 * 
 * @author wangjingjing
 *
 */
public class EventListenerService implements ActivitiEventListener, Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2247184933030252290L;
	private static Logger log = LoggerFactory.getLogger(EventListenerService.class);
	
	@Autowired
	private MailSendListener mailSender ;
	@Autowired  
    private ApplicationContext applicationContext;  

	// 邮件发送队列
	private BlockingQueue<Object> mailQueue = new ArrayBlockingQueue<>(100);

	@Override
	public void onEvent(ActivitiEvent event) {
		if (!(event instanceof ActivitiEntityEvent)) {
			log.debug("事件类型无法处理，丢弃" + event);
			return;
		}

		try {
			mailSend((ActivitiEntityEvent) event);
		} catch (Throwable e) {
			log.error("邮件处理出错", e);
		}

	}

	/**
	 * 处理邮件发送
	 * 
	 * @param event
	 */
	private void mailSend(ActivitiEntityEvent event) {
		if (mailSender == null)
			return;

		ActivitiEntityEvent entityEvent = event;
		Object mailContent = mailSender.buildMailContent(event.getType(), buildMailEvent(event.getType(), entityEvent));

		if (mailContent != null && !mailContent.equals("")) {
			try {
				mailQueue.put(mailContent);
				if (!mailThred.isAlive()) {
					mailThred.start();
				}
			} catch (InterruptedException e) {
				log.info(e.getMessage());
			}
		}
	}

	private Thread mailThred = new Thread() {
		public void run() {
			log.info("线程启动**************************************");
			if (mailSender == null)
				return;

			while (true) {
				try {
					Object take = mailQueue.take();
					IWorkFlowService flowService = (IWorkFlowService) applicationContext.getBean("workflowservice");
					mailSender.sendMail(take, flowService);
				} catch (InterruptedException e) {
					log.error(null, e);
				}
			}

		}
	};

	/**
	 * 构建邮件发送事件对象
	 * 
	 * @param activitiEventType
	 * @param event
	 * @return
	 */
	private MailEvent buildMailEvent(ActivitiEventType activitiEventType, ActivitiEntityEvent event) {
		Object entity = event.getEntity();
		MailEvent mevent = new MailEvent();
		if (entity instanceof TaskEntity) {
			TaskEntity task = (TaskEntity) entity;
			if (task.getProcessInstance() != null)
				mevent.setBusinessKey(task.getProcessInstance().getBusinessKey());
			mevent.setTaskCandidates(task.getCandidates());
			mevent.setTaskName(task.getName());
			mevent.setVariables(task.getVariables());

		} else {
			if (activitiEventType == ActivitiEventType.ENTITY_SUSPENDED
					|| activitiEventType == ActivitiEventType.PROCESS_COMPLETED) {
				Map<String, Object> vars = event.getEngineServices().getRuntimeService()
						.getVariables(event.getProcessInstanceId());
				mevent.setVariables(vars);
			}
		}

		return mevent;
	}

	@Override
	public boolean isFailOnException() {
		// TODO Auto-generated method stub
		return false;
	}

}