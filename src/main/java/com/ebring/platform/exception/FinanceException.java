/**
 * Ebring 2003 copyright
 * 
 */
package com.ebring.platform.exception;

/**
 *
 * 描述: 金融操作异常
 * @author wangjing.dc@qq.com
 */
@SuppressWarnings("serial")
public class FinanceException extends Exception {
	private String errCode = "";
	
	public FinanceException(String errCode, String message, Exception cause) {
		super(message, cause);
		this.errCode = errCode;
	}

	public FinanceException(String errCode, String message) {
		super(message);
		this.errCode = errCode;
	}
	
	/**
	 * 获取错误代码。
	 * @return
	 */
	public String getErrCode(){
		return this.errCode;
	}
}
