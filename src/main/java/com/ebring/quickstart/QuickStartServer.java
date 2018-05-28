/**
 * Ethink 2017 copyright
 * 
 */
package com.ebring.quickstart;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 *
 * 描述: 系统启动入口
 * @author wangjing.dc@qq.com
 */
@SpringBootApplication
@ComponentScan(basePackages={"com.ebring.platform.config", "com.ebring.platform.controller", "com.ebring.workflow", "com.ebring.oa.schedule"})
@MapperScan({"com.ebring.tcrc.trans.base.dao"})
@EnableScheduling
public class QuickStartServer extends SpringBootServletInitializer {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(QuickStartServer.class);
		ConfigurableApplicationContext context = app.run(args);
		System.out.println(context + "\n---------------Application startup success-----------------");

	}
	
	
	    @Override
	    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
	        // 注意这里要指向原先用main方法执行的Application启动类
	        return builder.sources(QuickStartServer.class);
	    }

}
