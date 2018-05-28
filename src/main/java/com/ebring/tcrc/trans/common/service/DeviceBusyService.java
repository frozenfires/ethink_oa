package com.ebring.tcrc.trans.common.service;

import java.util.HashMap;
import java.util.Map;
import javax.servlet.ServletContext;
import org.apache.log4j.Logger;
import org.springframework.web.context.ServletContextAware;
import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;

/**
 * 设备占用Service
 * @author Liujian
 *
 */
public class DeviceBusyService implements IService, ServletContextAware {
	/**
	 * Logger for this class
	 */
	private static final Logger logger = Logger.getLogger(DeviceBusyService.class);

	private ServletContext servletContext;
	
	@Override
	public Result execute(Map<String, Object> parameterMap) {
		if(logger.isDebugEnabled()){
			logger.debug("DeviceBusyService 执行.. 参数:"+parameterMap);
		}
		Result result = new Result();
		Map<String, String> map = (Map<String, String>) servletContext.getAttribute("map");
		if (map == null) {
			map = new HashMap<String, String>();
			servletContext.setAttribute("map", map);
		}
		String DEVICE_ID = (String) parameterMap.get("DEVICE_ID");
		String USER_IP = (String) parameterMap.get("USER_IP");
		if (!map.containsKey(DEVICE_ID)) {
			map.put(DEVICE_ID, USER_IP);
			result.setSuccess(true);
		} else if (!USER_IP.equals(map.get(DEVICE_ID))) {
			map.put(DEVICE_ID, USER_IP);
			result.setSuccess(false);
		} else {
			result.setSuccess(true);
		}
		return result;
	}

	@Override
	public void setServletContext(ServletContext servletContext) {
		this.servletContext = servletContext;
	}

}
