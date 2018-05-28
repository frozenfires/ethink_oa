package com.ebring.tcrc.trans.common.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.apache.log4j.PatternLayout;

import com.ebring.platform.common.service.IService;
import com.ebring.platform.log.EthinkAppender;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;

public class LogWriteService implements IService {
	private static final Logger log = Logger.getLogger(LogWriteService.class);
	
	private static Map<String, Logger> appenderMap = new HashMap<String, Logger>();
	
	@Override
	public  Result execute(Map<String, Object> params) {
		return new Result();
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Result execute1(Map<String, Object> params) {
		Result result = new Result();
		
		String user_ip = (String) params.get("USER_IP");
		Object logInfo = params.get("logInfo");
		if(logInfo instanceof List){
			List list = (List) logInfo;
			for(int i=0; i<list.size(); i++){
				try{
					Map<String, String> logmap = (Map<String, String>) list.get(i);
					pringLog(user_ip, logmap.get("level"), logmap.get("msgdata"));
				}catch(Exception e){
					log.error("", e);
				}
			}
		}
		else if(logInfo instanceof String){
			//日志级别
			String level = (String) params.get("level");
			pringLog(user_ip, level, (String) logInfo);
		}
		
		result.setSuccess(true);
		return result;
	}
	
	/**
	 * 保存客户端日志
	 * */
	private void pringLog(String user_ip, String level, String logInfo) {

			String logType;
			//日志类别 elog:电子日志/log:普通日志
			if( level.equals("elog")){
				logType = "elog";
				level = "info";
			}else{
				logType =  "log";
			}
			
			//appender名称
			String loggerName =  user_ip + logType;
			
			if(!appenderMap.containsKey(loggerName)){
				Logger log = createLogger(loggerName, logType);
				appenderMap.put(loggerName, log);
			}
			
			Logger log = appenderMap.get(loggerName);
			log.log(Level.toLevel(level), logInfo);
			
//			if(level.equals("elog")){
//				createElog(user_ip, elogPath, logInfo, ebackupPath, level, logLevel);
//			}else if(level.equals("info")||level.equals("debug")||level.equals("error")){
//				createLog(user_ip, logPath, logInfo, backupPath, level, logLevel);
//			}
					
			//getLoggerByName(user_ip, logInfo);
	}
	
	/**
	 * 创建制定logger对象。
	 * @param loggerName
	 * @return
	 */
	private Logger createLogger(String loggerName, String logType) {

		Logger logger = Logger.getLogger(loggerName);
		EthinkAppender appenderTemplete = (EthinkAppender) Logger
				.getRootLogger().getAppender("client");
		
		String basePath = appenderTemplete.getFilePath();
		String linuxFile = appenderTemplete.getLinuxFile();
//		System.out.println("linuxFile=="+linuxFile);
		Boolean boo = linuxFile.contains("user.home");
//		System.out.println("boo====="+boo);
		Boolean isWindow = Util.isWindow();
		Boolean isLinux = Util.isLinux();
		String path = "";
		String backFile = "";
		if(isWindow == true){
			path = logType.equals("elog") ? basePath + "/elog/" : basePath + "/log/";
			backFile =  logType.equals("elog") ? basePath + "/elog.zip" : basePath + "/log.zip";			
		}else if(isLinux == true){
			if(boo){
				linuxFile = linuxFile.replace("{user.home}", System.getProperty("user.home"));
			}
			path = logType.equals("elog") ? linuxFile + "/elog/" : linuxFile + "/log/";
			backFile =  logType.equals("elog") ? linuxFile + "/elog.zip" : linuxFile + "/log.zip";	
		}

		// 生成新的Appender
		EthinkAppender appender = new EthinkAppender();
		appender.setName(loggerName);
		appender.activeAppender();
		appender.setBackupFile(backFile);
		appender.setBackupMaxSize(String.valueOf(appenderTemplete.getBackupMaxSize()));

		PatternLayout layout = new PatternLayout();
		// log的输出形式
		layout.setConversionPattern(((PatternLayout) appenderTemplete
				.getLayout()).getConversionPattern());
		appender.setLayout(layout);

		// log输出路径
		appender.setFile(path + loggerName + ".log");
		// log的文字码  
		appender.setEncoding("UTF-8");  
		
		// 适用当前配置
		appender.activateOptions();

		// 清空Appender
		logger.removeAllAppenders();
		// 设置是否继承父Logger
		logger.setAdditivity(false);
		// 将新的Appender加到Logger中
		logger.addAppender(appender);
		logger.setLevel(Level.DEBUG);

		return logger;
	}

//	private void ssss(){
//		EthinkAppender appender = (EthinkAppender) Logger.getRootLogger().getAppender("client");
//		
////		Logger.getRootLogger().removeAppender("client");
////		System.out.println(appender.getFile());
////		System.out.println(appender.getDatePattern());
////		System.out.println(appender.getLogPath());
//		// 浏览器日志路径
//		String logPath = appender.getLogPath();
//		// 电子日志路径
//		String elogPath = appender.getElogPath();
//		// 浏览器日志备份路径
//		String backupPath = appender.getBackupPath();
//		// 电子日志备份路径
//		String ebackupPath = appender.getEbackupPath();
//		// 日志级别
//		Level logLevel = appender.getLogLevel();
//		
//	}
	
	
	/**
	 * 浏览器完整日志
	 * */
//	public Logger createLog(String user_ip, String path, String logInfo, String backupPath, String level, Level logLevel ) {
//		//一个ip地址只创建一个appender
////		if(!array.contains(user_ip)){
////			appender = new EthinkAppender();
////		}
//		
//		//创建logger,如果已有则返回现有logger
//		Logger logger = Logger.getLogger(user_ip); 
//        // 清空Appender
//        logger.removeAllAppenders();  
//        // 设定Logger级别  
//        //System.out.println("level===="+level);
//        logger.setLevel(logLevel);  
//        // 设置是否继承父Logger
//        logger.setAdditivity(true);  
//        
//        // 生成新的Appender  
//        EthinkAppender appender = new EthinkAppender();  
//        
//        // log的输出形式  
//        String conversionPattern = "[%d] %p - %m%n";  
//        layout.setConversionPattern(conversionPattern);  
//        appender.setLayout(layout);  
//        // log输出路径  
//    	appender.setFile(path + user_ip + ".log");
////    	appender.setBackupFile("./ethinklogs/client.zip");        	
//    	appender.setBackupFile(backupPath);        	
//        // log的文字码  
//        appender.setEncoding("UTF-8");  
//        // true:在已存在log文件后面追加 false:新log覆盖以前的log  
//        appender.setAppend(true);  
//        // 适用当前配置  
//        appender.activateOptions();  
//        // 将新的Appender加到Logger中  
//        logger.addAppender(appender);
//        if(level.equals("info"))logger.info(logInfo);
//        if(level.equals("debug"))logger.debug(logInfo);	
//        if(level.equals("error"))logger.error(logInfo);
//        return logger;  
//    }  
	
	/**
	 * 电子日志
	 * */
//	public Logger createElog(String user_ip, String path, String logInfo, String ebackupPath, String level, Level logLevel) {
//		//一个ip地址只创建一个appender
////		if(!array.contains(user_ip)){
////			appender = new EthinkAppender();
////		}
//		//创建logger,如果已有则返回现有logger
//		Logger logger = Logger.getLogger(user_ip); 
//        // 清空Appender
//        logger.removeAllAppenders();  
//        // 设定Logger级别  
//        //System.out.println("level===="+level);
//        logger.setLevel(logLevel);  
//        // 设置是否继承父Logger
//        logger.setAdditivity(true);  
//        // 生成新的Appender  
//        EthinkAppender appender = new EthinkAppender();  
//        
//        // log的输出形式  
//        String conversionPattern = "[%d] - %m%n";  
//        layout.setConversionPattern(conversionPattern);  
//        appender.setLayout(layout);  
//        // log输出路径  
//    	appender.setFile(path + user_ip + ".log");
////        appender.setBackupFile("./ethinklogs/elog/client.zip");
//        appender.setBackupFile(ebackupPath);
//        // log的文字码  
//        appender.setEncoding("UTF-8");  
//        // true:在已存在log文件后面追加 false:新log覆盖以前的log  
//        appender.setAppend(true);  
//        // 适用当前配置  
//        appender.activateOptions();  
//        // 将新的Appender加到Logger中  
//        logger.addAppender(appender);
//        logger.info(logInfo);
//        
//        return logger;  
//    }  
}
