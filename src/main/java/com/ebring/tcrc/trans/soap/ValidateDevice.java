package com.ebring.tcrc.trans.soap;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebResult;
import javax.jws.WebService;

/**
 * 验证设备
 * soap请求报文示例：
 * <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://soap.trans.tcrc.ebring.com/">
 *  <soapenv:Header/>
 *  <soapenv:Body>
 *     <soap:QUERYDEVICESTATUS>
 *        <!--Optional:-->
 *        <TELLERID>111</TELLERID>
 *        <!--Optional:-->
 *        <TELLERIP>222</TELLERIP>
 *     </soap:QUERYDEVICESTATUS>
 *  </soapenv:Body>
 * </soapenv:Envelope>
 * 
 * 
 * @author zhigq
 *
 */
@WebService
public interface ValidateDevice {
	/**
	 * 查询
	 * @param tellerid
	 * @param ip
	 * @return
	 */
	@WebMethod(operationName="QUERYDEVICESTATUS")//修改方法名
	@WebResult(name="DEVICE_STATUS")//修改方法返回值得名字
	public boolean queryDeviceStatus(@WebParam(name="TELLERID")String tellerid,@WebParam(name="TELLERIP")String ip);

}
