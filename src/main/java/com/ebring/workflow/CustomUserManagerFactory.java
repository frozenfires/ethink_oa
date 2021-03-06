/**
 * Ethink 2017 copyright
 * 
 */
package com.ebring.workflow;

import org.activiti.engine.impl.interceptor.Session;
import org.activiti.engine.impl.interceptor.SessionFactory;
import org.activiti.engine.impl.persistence.entity.UserEntityManager;
import org.activiti.engine.impl.persistence.entity.UserIdentityManager;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * 描述:
 * @author wangjing.dc@qq.com
 */
public class CustomUserManagerFactory implements SessionFactory{
	private UserEntityManager userEntityManager;    
    
    @Autowired    
    public void setUserEntityManager(UserEntityManager userEntityManager) {    
        this.userEntityManager = userEntityManager;    
    }
    
    public Class<?> getSessionType() {    
        // 返回原始的UserManager类型    
        return UserIdentityManager.class;    
    }    
    
    public Session openSession() {    
        // 返回自定义的UserManager实例    
        return userEntityManager;    
    }    
    
}
