package com.ebring.tcrc.trans.communication;

import org.apache.log4j.Logger;



public class TCPServer {
	
	private static final Logger log = Logger.getLogger(TCPServer.class);
	private String port;
	
	private GetDeviceInfoService getDeviceInfoService;
	
	
	public void init(){
		
		 Thread thread = new Thread(new SocketServer(Integer.parseInt(port),getDeviceInfoService), "TCPServer thread");
		 thread.start();
		 log.info("TCPServer init..port:"+port);
	}

	public void setPort(String port) {
		this.port = port;
	}

	public void setGetDeviceInfoService(GetDeviceInfoService getDeviceInfoService) {
		this.getDeviceInfoService = getDeviceInfoService;
	}
	 
	
	
	 

}




