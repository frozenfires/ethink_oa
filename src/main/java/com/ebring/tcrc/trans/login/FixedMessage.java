package com.ebring.tcrc.trans.login;


/**
 * 组织定长报文
 * @author zhigq
 *
 */
public class FixedMessage {
	
	
	
	/**
	 * leftOrRight L / R
	 * type  N,F,C
	 * length : 长度
	 * @param message
	 * @param appendMessage
	 * @param leftOrRight
	 * @param type
	 * @param length
	 * @return
	 */
	public static StringBuffer appendMessage(StringBuffer message,String appendMessage,String leftOrRight,String type,int length){
		if("N".equals(type)||"F".equals(type)){
			if(appendMessage.length()<=length){
				StringBuffer tempStr=new StringBuffer();
				for (int i = 0; i < (length-appendMessage.length()); i++) {
					tempStr.append("0");
				}
				message.append(tempStr).append(appendMessage);
			}
			
		}else if("C".equals(type)){
			
			if(appendMessage.length()<=length){
				StringBuffer tempStr=new StringBuffer(appendMessage);
				for (int i = 0; i < (length-appendMessage.length()); i++) {
					tempStr.append(" ");
				}
				message.append(tempStr);
			}
			
			
		}
		
		
		return message;
	}
	

	
	public static void main(String[] args){
		FixedMessage fix=new FixedMessage();
	
		System.out.println(fix.appendMessage(new StringBuffer("1234"), "125",
				"", "N", 5)+"1");;
				
				String abc="264   012003000000";
				
				System.out.println(abc.substring(12, 18));
				
				
		
	}
	
	
	

}
