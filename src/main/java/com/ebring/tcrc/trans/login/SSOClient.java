package com.ebring.tcrc.trans.login;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.Socket;

import org.apache.log4j.Logger;


public class SSOClient {
	
	private static final Logger log = Logger.getLogger(SSOClient.class);

	 private Socket socket = null;   

     public String sendMessage(String message,String ip,int port) {   
    	 String msg = null;   
    	 String responseMessage=null;
         try {                       
             socket = new Socket(ip, port);   
             // 发送关闭命令   
             OutputStream socketOut = socket.getOutputStream();   
             socketOut.write(message.getBytes());   
             // 接收服务器的反馈   
             BufferedReader br = new BufferedReader(   
                     new InputStreamReader(socket.getInputStream()));   
            
             while ((msg = br.readLine()) != null)  {
            	  responseMessage=msg;
             } 
             
         } catch (IOException e) {                       
             e.printStackTrace();   
         }   
         if(log.isDebugEnabled()){
        	 log.debug("返回报文："+responseMessage);
         }
         return responseMessage;
     }  
     
     
     public StringBuffer getHeader(){
    	 StringBuffer header=new StringBuffer();
    	 header=FixedMessage.appendMessage(header, "012003", "L", "C", 6);//交易码
    	 header=FixedMessage.appendMessage(header, "L", "L", "C", 3);//交易发起渠道
    	 header=FixedMessage.appendMessage(header, "20140523", "L", "C", 8);//交易发起方日期
    	 header=FixedMessage.appendMessage(header, "093005", "L", "C", 6);//交易发起方时间
    	 header=FixedMessage.appendMessage(header, "", "L", "C", 20);//交易发起方流水号
    	 header=FixedMessage.appendMessage(header, "0", "R", "N", 12);//请求文件记录数
    	 header=FixedMessage.appendMessage(header, "", "L", "C", 128);//请求文件名称
    	 
    	 
    	 return header;
     }
    
     
     public StringBuffer getBody(String user_id,String token,String systemid){
    	 
    	 StringBuffer body=new StringBuffer();
    	 body=FixedMessage.appendMessage(body, user_id, "L", "C", 7);//用户ID
    	 body=FixedMessage.appendMessage(body, token, "L", "C", 20);//令牌
    	 body=FixedMessage.appendMessage(body, systemid, "L", "C", 1);//业务系统代码
    	 
    	 return body;
     }
     
     
 	public static void main(String[] args){
		SSOClient client=new SSOClient();
		StringBuffer head=client.getHeader();
		StringBuffer message=head.append(client.getBody("0900665", "5E77C3FA735BD3BD792A", "L"));
		int messageLength=message.length();
		StringBuffer messageLengthStr=FixedMessage.appendMessage(new StringBuffer(), String.valueOf(messageLength), "R", "N", 6);//报文长度
	    StringBuffer allMessage=messageLengthStr.append(message);
		
	    System.out.println("send:"+allMessage);
		
		client.sendMessage(allMessage.toString(), "200.100.49.62", 14888);
		
	}
     

}
