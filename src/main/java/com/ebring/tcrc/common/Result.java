package com.ebring.tcrc.common;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Result {

  private boolean success;
  private Object content;
  private String message="";
	
   public Result(){
	   
   }
  
	public Result(boolean success){
		this.success=success;
	}
	
	public void setContent(Object content){
		this.content=content;
	}
	
	public Object getResult(){
		if(content instanceof Map){
			 Map contentP=(Map)content;
			 contentP.put(Global.SUCCESS, success);
			 contentP.put(Global.MESSAGE, message);
			 return contentP;
		}else{
			Map result=new HashMap();
			result.put(Global.SUCCESS, success);
			result.put(Global.MESSAGE, message);
			result.put(Global.DATA, content);
			return result;
		}

	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public Object getContent() {
		return content;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	
}
