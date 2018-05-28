package com.ebring.oa.schedule;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import com.ebring.oa.mail.MailUtil;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;

public class OverinSuranceMailSend {
	private SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");

	@Autowired
	private ITcrcBaseManageDao iTcrcBaseManageDao;
	public ITcrcBaseManageDao getiTcrcBaseManageDao() {
		return iTcrcBaseManageDao;
	}

	public void setiTcrcBaseManageDao(ITcrcBaseManageDao iTcrcBaseManageDao) {
		this.iTcrcBaseManageDao = iTcrcBaseManageDao;
	}

	
	@Autowired
	private MailUtil mailUtil;
	

	public MailUtil getMailUtil() {
		return mailUtil;
	}

	public void setMailUtil(MailUtil mailUtil) {
		this.mailUtil = mailUtil;
	}

	/*
	 * 获取收件人邮箱地址
	 * 
	 */
	public Boolean getUserMailContent() {
		// USER_ID_P

		Map<String, String> parameterMap = new HashMap<String, String>();
		Map<String, List<Map<String, String>>> DeviceMap = new HashMap<String, List<Map<String, String>>>();
		List<Map> selectOneWorkDeail = iTcrcBaseManageDao.selectDevice(parameterMap);

		for (Map map : selectOneWorkDeail) {
			List<Map<String, String>> list = new ArrayList<Map<String, String>>();
			Date createTime = (Date) map.get("OUTOF_TIME");
			if (createTime != null) {
				String dats = df.format(createTime.getTime() - (long) 30 * 24 * 60 * 60 * 1000);
				try {
					if (df.parse(dats).compareTo(df.parse(df.format(new Date()))) < 0) {
						if (DeviceMap.containsKey(map.get("SETUP_BRANCH_ID"))) {
							List<Map<String, String>> list2 = DeviceMap.get(map.get("SETUP_BRANCH_ID"));
							list2.add(list2.size(), map);
							DeviceMap.put(map.get("SETUP_BRANCH_ID").toString(), list2);
						} else {
							list.add(map);
							DeviceMap.put(map.get("SETUP_BRANCH_ID").toString(), list);
						}
					}
				} catch (ParseException e) {

				}
			}
		}

		boolean flag = OverinSuranceDeal(DeviceMap);
		if (flag) {
			return true;
		} else {
			return false;
		}
	}

	public boolean OverinSuranceDeal(Map<String, List<Map<String, String>>> deviceMap) {

		try {

			if (!deviceMap.isEmpty()) {
				Map<String, String> parame_ID = new HashMap<String, String>();
				parame_ID.put("ROLE_ID", "workleader");
				List<Map> OverinSuranceMail = iTcrcBaseManageDao.selectOverInsuranceMail(parame_ID);
				for (Entry<String, List<Map<String, String>>> entry : deviceMap.entrySet()) {

					String bankNameID = entry.getValue().get(0).get("SETUP_BRANCH_ID");
					Map<String, String> parame = new HashMap<String, String>();
					parame.put("ORG_ID_P", bankNameID.split(",")[bankNameID.split(",").length - 1]);
					List<Map> selectBranchPath = iTcrcBaseManageDao.selectBranchPath(parame);
					Object bankName = selectBranchPath.get(0).get("ORG_NAME");
					List<Map<String, String>> deviceDatil = entry.getValue();
					String deviceDatilContent = "";
					for (int i = 0; i < deviceDatil.size(); i++) {
						Map<String, String> map2 = deviceDatil.get(i);
						deviceDatilContent +="<table border='1'><tr> <th> 设备名称</th><th>" + map2.get("DEVICE_NAME") + "</th></tr><tr><th>所属银行网点</th><th>" + bankName + "</th></tr><tr><th>设备编号</th><th>"
								+ map2.get("DEVICE_ID") + "</th></tr><tr><th>投产日期</th><th>" + df.format(map2.get("START_TIME")).toString()
								+ "</th></tr><tr><th>维保年限</th><th>" + map2.get("EXP_TIME").toString() + "年</th></tr></table>";
					}
					// 过保预警+银行+设备数量
					for (Map<String, String> map : OverinSuranceMail) {
						
						String mailContent=deviceDatilContent;
						String toMail=map.get("EMAIL");
						String mailTitle ="过保预警/" + bankName + "/" + deviceDatil.size();											
						mailUtil.sendMail(mailContent, toMail, mailTitle);
					}
				}			
			}
		} catch (Exception e) {
			return false;
		}
		return true;

	}
}
