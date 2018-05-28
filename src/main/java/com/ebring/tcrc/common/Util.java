package com.ebring.tcrc.common;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

public class Util {

	/** 
	 * 获取异常的堆栈信息 
	 *  
	 * @param t 
	 * @return 
	 */  
	public static String getStackTrace(Throwable t)  
	{  
	    StringWriter sw = new StringWriter();  
	    PrintWriter pw = new PrintWriter(sw);  
	  
	    try  
	    {  
	        t.printStackTrace(pw);  
	        return sw.toString();  
	    }  
	    finally  
	    {  
	        pw.close();  
	    }  
	} 
	
	/**
	 * 从params中获取头信息集合。
	 * params
	 */
	public static Map<String, Object> getHeadParams(Map params){
		String commons = "USER_ID," //服务
		   +"USER_NAME,"//DAO
		   +"ORG_ID,"//sql标识
		   +"ORG_NAME,"//是否分页
		   +"DEVICE_ID,"//是否分页
		   +"ACCOUNT_ID,"//成功状态
		   +"LOGTIME";//返回信息
				
		Map<String, Object> commParams = new HashMap<String, Object>();
		Iterator keys = params.keySet().iterator();
		
		while(keys.hasNext()){
			String key = (String) keys.next();
			if(commons.indexOf(key) > -1){
				commParams.put(key, params.get(key));
			}
		}
		
		return commParams;
	}

	/**
	 * 获取客户端IP
	 * @param request
	 * @return
	 */
	 public static String getClientIP(HttpServletRequest request) {  
	        String ip = request.getHeader("x-forwarded-for");  
	        if (ip == null || ip.length() == 0 || ip.equalsIgnoreCase("unknown")) {  
	            ip = request.getHeader("Proxy-Client-IP");  
	        }  
	        if (ip == null || ip.length() == 0 || ip.equalsIgnoreCase("unknown")) {  
	            ip = request.getHeader("WL-Proxy-Client-IP");  
	        }  
	        if (ip == null || ip.length() == 0 || ip.equalsIgnoreCase("unknown")) {  
	            ip = request.getRemoteAddr();  
	        }  
	        return ip;  
	    }  
	
 	/*
     * 将当前日期加减n天数。 如传入整型-5 意为将当前日期减去5天的日期 如传入整型5 意为将当前日期加上5天后的日期 返回字串 例(19990203)
     */
    public static String dateAdd(int days) {
        // 日期处理模块 (将日期加上某些天或减去天数)返回字符串
        Calendar canlendar = Calendar.getInstance(); // java.util包
        canlendar.add(Calendar.DATE, days); // 日期减 如果不够减会将月变动
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        return format.format(canlendar.getTime());
    }
    
    /**
     * 
     * @return 当前系统是否为windows系统
     */
    public static boolean isWindow(){
    	return System.getProperty("os.name").toLowerCase().startsWith("windows");
    }
    
    /**
     * 
     * @return 当前系统是否为linux系统
     */
    public static boolean isLinux(){
    	return System.getProperty("os.name").toLowerCase().startsWith("linux");
    }
    
    /**
	 * 获取全球唯一32位uuid 
	 * @return
	 */
	public static String getUUID(){
		UUID uuid = UUID.randomUUID();
		return uuid.toString().replaceAll("-", "");
	}
    
}
