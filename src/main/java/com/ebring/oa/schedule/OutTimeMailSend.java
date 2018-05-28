package com.ebring.oa.schedule;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.IdentityLink;
import org.activiti.engine.task.Task;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import com.ebring.oa.mail.MailUtil;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;

public class OutTimeMailSend {

	@Autowired
	private RuntimeService runtimeService;
	@Autowired
	private TaskService taskService;

	private SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");

	@Value("${OneTypeAccident.time}")
	private int outTime;

	@Autowired
	private MailUtil mailUtil;

	public MailUtil getMailUtil() {
		return mailUtil;
	}

	public void setMailUtil(MailUtil mailUtil) {
		this.mailUtil = mailUtil;
	}

	private static Logger log = LoggerFactory.getLogger(OutTimeMailSend.class);

	public Boolean sendUser() {
		List<ProcessInstance> process = runtimeService.createProcessInstanceQuery().active()
				.processDefinitionKey("work-form").orderByProcessInstanceId().desc().list();
		for (ProcessInstance proces : process) {
			List<Task> list2 = taskService.createTaskQuery().processInstanceId(proces.getProcessInstanceId()).list();
			Task taskw = list2.get(0);
			Date createTime = taskw.getCreateTime();
			String dats = df.format(createTime.getTime() + (long) outTime * 365 * 24 * 60 * 60 * 1000);
			try {
				if (df.parse(dats).compareTo(df.parse(df.format(new Date()))) > 0) {
					List<IdentityLink> identityLinksForTask = taskService.getIdentityLinksForTask(taskw.getId());
					for (IdentityLink identityLink : identityLinksForTask) {
						if (identityLink.getType().equals("candidate")) {
							identityLink.getUserId();
							String mailContent = mailContent(proces.getBusinessKey());
							String toMail = identityLink.getUserId();
							String mailTitle = "重要事故通知尽快处理";
							if (!mailContent.equals("")) {
								mailContent=proces.getBusinessKey()+"/"+mailContent;
								mailUtil.sendMail(mailContent, toMail, mailTitle);
							}
						}

					}

				}
			} catch (ParseException e) {
				return false;
			}
		}
		return true;
	}

	@Autowired
	private ITcrcBaseManageDao iTcrcBaseManageDao;

	public String mailContent(String workID) {
		String contents = "";
		Map<String, String> parameterMap = new HashMap<String, String>();
		parameterMap.put("ID", workID);

		List<Map> content = iTcrcBaseManageDao.mailContent(parameterMap);
		if (!content.isEmpty()) {

			Map map = content.get(0);
			if (null != map.get("WORK_APPMARK") && !map.get("WORK_APPMARK").equals("")) {
				contents = "工单申请备注：";
				if (null != map.get("WORK_APPMARK")) {
					contents += map.get("WORK_APPMARK");
				} else {
					contents += "暂无信息</br>";
				}
			}
			contents += "<h3>工单客户信息：</h3>";
			if (null != map.get("ORG_ID_P")) {
				contents += "<table border='1' style='margin-top: 8px;'><tr> <th>网点编号为：</th><th>" + map.get("ORG_ID_P")
						+ "</th></tr>";
			}
			if (null != map.get("ORG_NAME")) {
				contents += "<tr> <th>客户名称：</th><th>" + map.get("ORG_NAME") + "</th></tr>";
			}
			if (null != map.get("ORG_ADDRESS")) {
				contents += "<tr> <th>客户地址：</th><th>" + map.get("ORG_ADDRESS") + "</th></tr>";
			}
			if (null != map.get("LINKMAN")) {
				contents += "<tr> <th>联系人：</th><th>" + map.get("LINKMAN") + "</th></tr>";
			}
			if (null != map.get("ORG_PHONE")) {
				contents += "<tr> <th>联系电话：</th><th>" + map.get("ORG_PHONE") + "</th></tr></table>";
			}
			if (!map.get("WORK_TYPE").equals(1) || !map.get("WORK_TYPE").equals(2) || !map.get("WORK_TYPE").equals(4)) {
				String contentx = "<h5>工单设备信息：</h5>";
				if (null != map.get("DEVICE_ID")) {
					contentx += "<table border='1' style='margin-top: 8px;'><tr> <th>设备编号：</th><th>"
							+ map.get("DEVICE_ID") + "</th></tr>";
				}
				if (null != map.get("DEVICE_NAME")) {
					contentx += "<tr> <th>设备名称：</th><th>" + map.get("DEVICE_NAME") + "</th></tr>";
				}
				if (null != map.get("DEVICE_MODEL_NAME")) {
					contentx += "<tr> <th>设备型号：</th><th>" + map.get("DEVICE_MODEL_NAME") + "</th></tr>";
				}
				if (null != map.get("DEVICE_TYPE_NAME")) {
					contentx += "<tr> <th>设备类型：</th><th>" + map.get("DEVICE_TYPE_NAME") + "</th></tr></table>";
				}
				if (!contentx.equals("<h5>工单设备信息：</h5>")) {
					contents += contentx;
				}

			}

			return contents;
		}
		return "";
	}
}