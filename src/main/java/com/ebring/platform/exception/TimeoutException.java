/**
 * Ebring 2003 copyright
 * 
 */
package com.ebring.platform.exception;

/**
 *
 * 描述: 超时异常。
 * @author wangjing.dc@qq.com
 */
@SuppressWarnings("serial")
public class TimeoutException extends Exception {

	public TimeoutException(String message, Exception cause) {
		super(message, cause);
	}

	public TimeoutException(String message) {
		super(message);
	}

}
