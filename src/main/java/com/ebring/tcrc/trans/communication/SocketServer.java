package com.ebring.tcrc.trans.communication;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Map;

import org.apache.log4j.Logger;

public class SocketServer implements Runnable{
	
  private	GetDeviceInfoService   getDeviceInfoService;
  private int port;
	
	public SocketServer(int port,GetDeviceInfoService   getDeviceInfoService){
		this.port=port;
		this.getDeviceInfoService = getDeviceInfoService;
	 }

	
	@Override
	public void run() {
		
		   try
		      {
		        ServerSocket sv = new ServerSocket(this.port);

		        while (true)
		        {
		          Socket socket = sv.accept();
		          try
		          {
		        	  Handler handler=new Handler(socket,getDeviceInfoService);
		        	  handler.start();
		          }
		          catch (Exception e) {
		            socket.setSoLinger(true, 0);
		            
		            try
		            {
		              socket.close();
		            }
		            catch (Exception e1)
		            {
		              
		            }
		          }
		         }
		      }
		      catch (IOException e)
		      {
		        e.printStackTrace();
		      }
			
		
		
	}



}


class Handler extends Thread
{
  private Socket socket;
  private InputStream in;
  private PrintWriter out;
  private	GetDeviceInfoService   getDeviceInfoService;
  
  private static final Logger log = Logger.getLogger(Handler.class);
  
  public Handler(Socket socketp,GetDeviceInfoService   getDeviceInfoService)
  {
    this.socket = socketp;
    this.getDeviceInfoService=getDeviceInfoService;
  }

  public void run()
  {
	  
    try
    {
     
      this.in = this.socket.getInputStream();
      byte[] buff_len = new byte[4];
      this.in.read(buff_len);
      int len = Integer.parseInt(new String(buff_len));
      byte[] buff = new byte[len];
      int read;
      for (int remained = len; remained != 0; remained -= read)
      {
        read = this.in.read(buff, len - remained, remained);
        if ((read != -1) || (remained == 0))
          continue;
      
      }
      
      XML2Map xml2Map=new XML2Map();
      Map transMap=xml2Map.xml2Map(buff);
      
        if(log.isDebugEnabled()){
        	log.debug("接收到的数据为 : " + new String(buff, "UTF-8") + "!");
        	log.debug("转换为Map:"+transMap);
        }
        
        
        String response=getResponse(transMap);
        
        out = new PrintWriter(socket.getOutputStream());
        out.println(response);
        // 刷新输出流,使Client马上收到该字符串
        out.flush();
        
        if(log.isDebugEnabled()){
        	log.debug("响应 : " + response);
        }

    }
    catch (IOException e)
    {
      e.printStackTrace();
    }
    finally
    {
    	
    	if(out!=null){
    		out.close();
    	}
    	
      if (this.in != null)
        try
        {
          this.in.close();
        }
        catch (IOException e) {
          e.printStackTrace();
        }
      try
      {
        this.socket.close();
      }
      catch (IOException e) {
        e.printStackTrace();
      }
    }
    
  }
  
  
  private String getResponse(Map req){
	  StringBuffer response=new StringBuffer("");
	  response.append("<?xml version=\"1.0\" encoding=\"utf-8\"?>")
	  .append("<SERVICE><SUCCESS>true</SUCCESS>")
	  .append("<DEVICE_STATUS>");
	  
	  String ip=(String)req.get("TELLERIP");

	  boolean status = getDeviceInfoService.getDeviceFormIP(ip);
	  
	  if(status){
		  response.append("true");
	  }else{
		  response.append("false");
	  }
	  response.append("</DEVICE_STATUS>").append("</SERVICE>");
	  
	  log.debug(response.length());
	  
	  StringBuffer result = new StringBuffer();
	  
	  int len = response.length();
	  
	  if (len < 999) {
		  result.append("0").append(len);
	  } else {
		  result.append(len);
	  }
	  result.append(response.toString());
	  
	  return result.toString();
  }
  
 
}


