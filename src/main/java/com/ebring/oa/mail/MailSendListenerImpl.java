package com.ebring.oa.mail;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.activiti.engine.delegate.event.ActivitiEventType;
import org.activiti.engine.task.IdentityLink;
import org.springframework.beans.factory.annotation.Autowired;

import com.ebring.oa.event.MailEvent;
import com.ebring.oa.event.MailSendListener;
import com.ebring.workflow.IWorkFlowService;
public class MailSendListenerImpl implements  MailSendListener {

	
	@Autowired
	private MailUtil mailUtil;
	public MailUtil getMailUtil() {
	return mailUtil;
	}

	public void setMailUtil(MailUtil mailUtil) {
		this.mailUtil = mailUtil;
	}
	
	@Autowired
	private  ContentDeal contentDeal;

	@Override
	public Object buildMailContent(ActivitiEventType type, MailEvent buildMailEvent) {

          	if (type == ActivitiEventType.TASK_CREATED) {
			List<ContentBean> mailList = new ArrayList<ContentBean>();
			String taskName = buildMailEvent.getTaskName();
			Set<IdentityLink> identities = buildMailEvent.getTaskCandidates();
 			String businessKey = buildMailEvent.getBusinessKey();
			Map<String, Object> mp = buildMailEvent.getVariables();
			if (!taskName.equals("新建工单")) {
				if (null == mp.get("work_owner") || mp.get("work_owner").equals("")) {
					for (IdentityLink link : identities) {
						ContentBean contentBean = new ContentBean();
						contentBean.setMailTitle("新建工单/" + businessKey + "/审核/新工单待审批");
						contentBean.setMailflag(businessKey+"*#06#");					
						contentBean.setMailPath(link.getUserId());
						mailList.add(contentBean);
					}
					return mailList;
				} else {
					if (taskName.equals("修改工单")) {
						for (IdentityLink link : identities) {
							ContentBean contentBean = new ContentBean();
							contentBean.setMailTitle("更新工单/" + businessKey + "/驳回/新工单待审批");
							//contentBean.setMailContent("您有工单被驳回，请仔调整后处理,审批人:" + link.getUserId());	
							contentBean.setMailflag(businessKey+"*#06#*#07#");
							contentBean.setMailPath(link.getUserId());
							mailList.add(contentBean);
						}
						return mailList;
					} else if (taskName.equals("工单处理")) {
						if (!mp.get("status").equals("processing") && null != mp.get("status")) {
							if (mp.get("status").equals("unconfirm") && null != mp.get("status")) {
								for (IdentityLink link : identities) {
									ContentBean contentBean = new ContentBean();
									contentBean.setMailTitle("更新工单/" + businessKey + "/审验未通过/新工单待处理");
									contentBean.setMailflag(businessKey+"*#06#*#11#");
									//contentBean.setMailContent("您有未通过审验工单，请仔及时处理,审批人:" + link.getUserId());		
									contentBean.setMailPath(link.getUserId());
									mailList.add(contentBean);
								}
								return mailList;
							} else {
								for (IdentityLink link : identities) {
									ContentBean contentBean = new ContentBean();
									contentBean.setMailTitle("更新工单/" + businessKey + "/派单/新工单待处理");
									contentBean.setMailflag(businessKey+"*#06#*#10#");
									//contentBean.setMailContent("您有新的派发工单，请仔及时处理,审批人:" + link.getUserId());	
									contentBean.setMailPath(link.getUserId());
									mailList.add(contentBean);
								}
								return mailList;
							}
						}
					} else if (taskName.equals("工单审验")) {
						ContentBean contentBean = new ContentBean();
						for (IdentityLink link : identities) {
							contentBean.setMailTitle("更新工单/" + businessKey + "/审核/工单审验");
							contentBean.setMailflag(businessKey+"*#06#*#12#");
							//contentBean.setMailContent("您有新待审验工单，请及时处理,审批人:" + link.getUserId());			
							contentBean.setMailPath(link.getUserId());
							mailList.add(contentBean);
						}
						return mailList;
					}
				}
			}
		} else if (type == ActivitiEventType.ENTITY_SUSPENDED || type == ActivitiEventType.PROCESS_COMPLETED) {

			List<ContentBean> mailList = new ArrayList<ContentBean>();
			ContentBean contentBean = new ContentBean();
			String taskName = buildMailEvent.getTaskName();
			Map<String, Object> map = buildMailEvent.getVariables();
			if (type == ActivitiEventType.ENTITY_SUSPENDED) {
				if (null != taskName && !taskName.equals("")) {
					contentBean.setMailTitle("更新工单/" + map.get("businessId") + "/挂起/您有工单被挂起");
					contentBean.setMailflag(map.get("businessId")+"*#06#*#08#");
					//contentBean.setMailContent("您有工单被挂起，请及时查看并处理,审批人:" + map.get("userid"));			
					contentBean.setMailPath(map.get("userid").toString());
					mailList.add(contentBean);
					return mailList;
				}
			} else if (type == ActivitiEventType.PROCESS_COMPLETED) {
				if (map.get("status").equals("negative") && null != map.get("status")) {					
					contentBean.setMailTitle("更新工单/" + map.get("businessId") + "/否决/您有工单被否决");
					contentBean.setMailflag(map.get("businessId")+"*#06#"+"*#09#");
					//contentBean.setMailContent("您有工单被否决，请及时查看并处理,审批人:" + map.get("userid"));		
					contentBean.setMailPath(map.get("userid").toString());
					mailList.add(contentBean);
					return mailList;
				} else {
					contentBean.setMailPath(map.get("userid").toString());
					contentBean.setMailTitle("完成工单/" + map.get("businessId") + "/完成/您有工单完成");
					contentBean.setMailflag(map.get("businessId")+"*#06#*#13#");
					//contentBean.setMailContent("工单完成，请及时查看并处理,审批人:" + map.get("userid"));
					mailList.add(contentBean);
					return mailList;
				}
			}
		} else {
		}

		return "";
	}

	@Override
	public void sendMail(Object take, IWorkFlowService flowService) {
		System.err.println("flowService================" + flowService);
			if (null != take && !take.equals("")) {
				for (ContentBean contentBean : (List<ContentBean>) take) {			
					ContentBean mailContent = contentDeal.sendMail(contentBean,flowService);
				mailUtil.sendMail(mailContent.getMailContent(), mailContent.getMailPath(), mailContent.getMailTitle());
				}
			}

	}
   
	
}



