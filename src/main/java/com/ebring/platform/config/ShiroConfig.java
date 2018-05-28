/**
 * Ethink 2017 copyright
 * 
 */
package com.ebring.platform.config;

import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.apache.shiro.mgt.SecurityManager;

import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;
import com.ebring.tcrc.trans.login.MyShiroRealm;

/**
 *
 * 描述: shrio 安全系统配置
 * @author wangjing.dc@qq.com
 */
@Configuration
public class ShiroConfig {

	private static final Logger log = LoggerFactory.getLogger(ShiroConfig.class);

	@Bean
	public ShiroFilterFactoryBean shirFilter(SecurityManager securityManager) {
		log.info("ShiroConfiguration.shirFilter()");
		ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
		shiroFilterFactoryBean.setSecurityManager(securityManager);
		// 拦截器.
		Map<String, String> filterChainDefinitionMap = new LinkedHashMap<String, String>();
		// 配置不会被拦截的链接 顺序判断
		filterChainDefinitionMap.put("/static/**", "anon");
		// 配置退出 过滤器,其中的具体的退出代码Shiro已经替我们实现了
		filterChainDefinitionMap.put("/login.html", "anon");
		
		// <!-- 过滤链定义，从上向下顺序执行，一般将/**放在最为下边 -->:这是一个坑呢，一不小心代码就不好使了;
		// <!-- authc:所有url都必须认证通过才可以访问; anon:所有url都都可以匿名访问-->
//		filterChainDefinitionMap.put("/**", "authc");
		filterChainDefinitionMap.put("/main.html", "authc");
//		<!-- 访问_admin目录下的文件需要验证 -->
		filterChainDefinitionMap.put("/_admin/**", "authc");

		// 如果不设置默认会自动寻找Web工程根目录下的"/login.jsp"页面
		shiroFilterFactoryBean.setLoginUrl("/login.html");
		// 登录成功后要跳转的链接
		shiroFilterFactoryBean.setSuccessUrl("/main.html");
		

		// 未授权界面;
		shiroFilterFactoryBean.setUnauthorizedUrl("/403");
		shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
		return shiroFilterFactoryBean;
	}

	@Bean
	public MyShiroRealm myShiroRealm(ITcrcBaseManageDao tcrcBaseManageDao) {
		MyShiroRealm myShiroRealm = new MyShiroRealm();
		myShiroRealm.setTcrcBaseManageDao(tcrcBaseManageDao);
		return myShiroRealm;
	}

	@Bean
	public SecurityManager securityManager(ITcrcBaseManageDao tcrcBaseManageDao) {
		DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
		securityManager.setRealm(myShiroRealm(tcrcBaseManageDao));
		return securityManager;
	}
}
