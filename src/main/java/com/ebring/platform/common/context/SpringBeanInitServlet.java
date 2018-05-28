package com.ebring.platform.common.context;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.springframework.web.context.support.WebApplicationContextUtils;

import com.ebring.platform.common.license.TCREntry;

/**
 * SpringBean 初始化servlet 
 * @author zhigq
 *
 */
public class SpringBeanInitServlet  extends HttpServlet {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public void init(ServletConfig arg0) throws ServletException {
		SpringBeanProxy.setApplicationContext(WebApplicationContextUtils.getWebApplicationContext(arg0.getServletContext()));
		TCREntry.validate();
        
    }
}
