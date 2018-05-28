package com.ebring.oa.schedule;


import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;


/**
 * 1类事故监听处理、过保预警处理
 * 
 * @author df
 *
 */
@Component
public class TimeOutEventDeal {	
	@Autowired
	private OutTimeMailSend outTimeMailSend;
	@Autowired
	private OverinSuranceMailSend overinSuranceMailSend;
	private static Logger log = LoggerFactory.getLogger(TimeOutEventDeal.class);

	public OverinSuranceMailSend getOverinSuranceMailSend() {
		return overinSuranceMailSend;
	}

	public void setOverinSuranceMailSend(OverinSuranceMailSend overinSuranceMailSend) {
		this.overinSuranceMailSend = overinSuranceMailSend;
	}

	public OutTimeMailSend getOutTimeMailSend() {
		return outTimeMailSend;
	}

	public void setOutTimeMailSend(OutTimeMailSend outTimeMailSend) {
		this.outTimeMailSend = outTimeMailSend;
	}

	@Scheduled(cron = "0 10 0 1-31 * ? ")
	private void process() {
	Boolean flag = outTimeMailSend.sendUser();
		if (flag) {
			log.info("I类事故检查完毕，检查时间为：" + new Date());
		} else {
			log.info("I类事故检查失败，检查时间为：" + new Date());
		}
	}

	@Scheduled(cron = "0 30 0 1-31 * ? ")
	private void OverinSuranceWarn() {
		System.out.println();
         Boolean flag = overinSuranceMailSend.getUserMailContent();
		if (flag) {
			log.info("I类事故检查完毕，检查时间为：" + new Date());
		} else {
			log.info("I类事故检查失败，检查时间为：" + new Date());
		}
	}
}