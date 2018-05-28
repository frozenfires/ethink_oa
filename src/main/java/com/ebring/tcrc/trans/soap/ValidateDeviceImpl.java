package com.ebring.tcrc.trans.soap;

import javax.jws.WebMethod;
import javax.jws.WebResult;
import javax.jws.WebService;

import org.apache.log4j.Logger;

import com.ebring.tcrc.trans.communication.GetDeviceInfoService;


@WebService(endpointInterface = "com.ebring.tcrc.trans.soap.ValidateDevice")
public class ValidateDeviceImpl implements ValidateDevice {

	private static final Logger log = Logger.getLogger(ValidateDeviceImpl.class);
	
	private GetDeviceInfoService deviceInfoService;
	
	@Override
//	@WebMethod(operationName="queryDeviceStatus")//修改方法名
//	@WebResult(name="deviceStatus")//修改方法返回值得名字
	public boolean queryDeviceStatus(String tellerid, String ip) {
		   if(log.isDebugEnabled()){
			   log.debug("ValidateDeviceImpl tellerid:"+tellerid+",ip:"+ip);
		   } 
		

		return deviceInfoService.getDeviceFormIP(ip);
	}

	public GetDeviceInfoService getDeviceInfoService() {
		return deviceInfoService;
	}

	public void setDeviceInfoService(GetDeviceInfoService deviceInfoService) {
		this.deviceInfoService = deviceInfoService;
	}

	
	
	
	

}
