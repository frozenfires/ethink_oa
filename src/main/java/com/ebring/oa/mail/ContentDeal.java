package com.ebring.oa.mail;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.task.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;
import com.ebring.workflow.IWorkFlowService;

@Service
public class ContentDeal {

	@Autowired
	private ITcrcBaseManageDao iTcrcBaseManageDao;

	/*
	 * 获取收件人邮箱地址
	 * 
	 */
	public String contentDeal(String mailflag, IWorkFlowService flowService) {
		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {

		}
		String contents = "";
		if (mailflag.contains("*#06#")) {
			Map<String, String> parameterMap = new HashMap<String, String>();
			String workID = mailflag.substring(0, mailflag.indexOf("*#06#"));
			parameterMap.put("ID", workID);
			List<Map> content = iTcrcBaseManageDao.mailContent(parameterMap);
			Map map = content.get(0);
			if (null != map.get("WORK_APPMARK") && !map.get("WORK_APPMARK").equals("")) {
				contents = "工单申请备注：";
				if (null != map.get("WORK_APPMARK")) {
					contents += map.get("WORK_APPMARK");
				} else {
					contents += "暂无信息</br>";
				}
			}
			contents += "<h5>工单客户信息：</h5>";
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
			if (mailflag.contains("*#08#")) {
				contents += "<h5 style='margin-top:8px;'>挂起原因：";
				List<Comment> Content = flowService.queryContents(map.get("WORK_FLOW_ID").toString());
				Comment comment = Content.get(Content.size() - 1);
				String fullMessage = comment.getFullMessage();
				if (null != fullMessage && !fullMessage.equals("")) {
					contents += fullMessage;
				} else {
					contents += "无！</h5>";
				}
			}
			if (mailflag.contains("*#09#")) {
				contents += "<h5 style='margin-top:8px;'>否决原因：";
				List<Comment> Content = flowService.queryContents(map.get("WORK_FLOW_ID").toString());
				Comment comment = Content.get(Content.size() - 1);		
				String fullMessage = comment.getFullMessage();
				if (null != fullMessage && !fullMessage.equals("")) {
					contents += fullMessage;
				} else {
					contents += "无！</h5>";
				}

			}
			if (mailflag.contains("*#07#")) {
				contents += "<h5 style='margin-top:8px;'>驳回原因：";
				List<Comment> Content = flowService.queryContents(map.get("WORK_FLOW_ID").toString());
				Comment comment = Content.get(Content.size() - 1);
				String fullMessage = comment.getFullMessage();
				if (null != fullMessage && !fullMessage.equals("")) {
					contents += fullMessage;
				} else {
					contents += "无！</h5>";
				}
			}
			if (mailflag.contains("*#10#")) {
				contents += "<h5 style='margin-top:8px;'>最新处理详情：";
				List<Comment> Content = flowService.queryContents(map.get("WORK_FLOW_ID").toString());
				Comment comment = Content.get(Content.size() - 1);
				String fullMessage = comment.getFullMessage();
				if (null != fullMessage && !fullMessage.equals("")) {
					contents += fullMessage;
				} else {
					contents += "无！</h5>";
				}
			}
			if (mailflag.contains("*#11#")) {
				List<Comment> Content = flowService.queryContents(map.get("WORK_FLOW_ID").toString());
				if (Content.size() > 5) {
					contents += "<h5 style='margin-top:8px;'>审验未通过详情：</h5>";
					for (int i = 5; i < Content.size(); i++) {
						String fullMessage = Content.get(i).getFullMessage();
						if (null != fullMessage && !fullMessage.equals("")) {
							contents += "<h5 style='margin-left:20px;'>" + fullMessage + "</h5>";
						}
					}
				} else {
						contents += "<h5 style='margin-top:8px;'>审验未通过详情:";
						Comment comment = Content.get(Content.size() - 1);
						String fullMessage = comment.getFullMessage();
						if (null != fullMessage && !fullMessage.equals("")) {
							contents += fullMessage;
						} else {
							contents += "无！</h5>";
						}
				}
			}
			if (mailflag.contains("*#12#")) {
				contents += "<h5 style='margin-top:8px;'>待审验批注：";
				List<Comment> Content = flowService.queryContents(map.get("WORK_FLOW_ID").toString());
				Comment comment = Content.get(Content.size() - 1);
				String fullMessage = comment.getFullMessage();
				if (null != fullMessage && !fullMessage.equals("")) {
					contents += fullMessage;
				} else {
					contents += "无！</h5>";
				}

			}
			if (mailflag.contains("*#13#")) {
				contents += "<h5 style='margin-top:8px;'>审验通过详情：";
				List<Comment> Content = flowService.queryContents(map.get("WORK_FLOW_ID").toString());
				Comment comment = Content.get(Content.size() - 1);
				String fullMessage = comment.getFullMessage();
				if (null != fullMessage && !fullMessage.equals("")) {
					contents += fullMessage;
				} else {
					contents += "无！</h5>";
				}
			}
		} else {
			return contents;
		}

		// 工单被否决

		return contents;

	}

	public ContentBean sendMail(ContentBean contentBean, IWorkFlowService flowService) {
		String mailPath = contentBean.getMailPath();
		if (mailPath.indexOf("ethinkbank.com") <= -1) {
			String userMailPath = getUserMailPath(mailPath);
			contentBean.setMailPath(userMailPath);
		}
		String contentDeal = contentDeal(contentBean.getMailflag(), flowService);
		contentBean.setMailContent(contentDeal);
		return contentBean;
	}

	public String getUserMailPath(String userId) {
		Map<String, String> parameterMap = new HashMap<String, String>();
		parameterMap.put("USER_ID", userId);
		List<Map> selectOneWorkDeail = iTcrcBaseManageDao.selectMailPath(parameterMap);
		String emailPath = selectOneWorkDeail.get(0).get("EMAIL").toString();
		return emailPath;
	}

}
