package com.ebring.platform.common.context;

import org.apache.log4j.Logger;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.WebApplicationContext;

/**
 * SpringBean 代理，使用时可直接调用SpringBeanProxy.getBean("#")来获取
 * 
 * @author zhigq
 *
 */
public class SpringBeanProxy {

	private static ApplicationContext applicationContext;
	private static final Logger log = Logger
			.getLogger(ApplicationContext.class);

	public synchronized static void setApplicationContext(
			ApplicationContext arg0) {
		applicationContext = arg0;
	}

	public static Object getBean(String beanName) {
		try {
			WebApplicationContext wac = ContextLoader.getCurrentWebApplicationContext();
//			T bean = wac.getBean(clazz.getClass());
//			return applicationContext.getBean(beanName);
			return wac.getBean(beanName);
		} catch (Exception e) {
			log.error("", e);
			return null;
		}

	}

}
