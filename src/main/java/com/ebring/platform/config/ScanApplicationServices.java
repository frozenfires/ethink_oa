/**
 * Ethink 2017 copyright
 * 
 */
package com.ebring.platform.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;

/**
 *
 * 描述:
 * 
 * @author wangjing.dc@qq.com
 */
@Configuration
@ImportResource(locations= {"classpath:applicationContext-service.xml", "classpath:applicationContext.activiti.cfg.xml"})
public class ScanApplicationServices{

//	  private static final Logger logger = LoggerFactory.getLogger(ScanApplicationServices.class);


}
