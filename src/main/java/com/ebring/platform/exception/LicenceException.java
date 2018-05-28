/**
 * Ebring 2003 copyright
 * 
 */
package com.ebring.platform.exception;

import org.apache.shiro.authc.AuthenticationException;

/**
 *
 * 描述: Licence验证异常
 * @author wangjing.dc@qq.com
 */
public class LicenceException extends AuthenticationException {

	/**
	 * 
	 */
	private static final long serialVersionUID = -3933782058292765177L;
	
	public LicenceException(String message){
		super(message);
	}

}
