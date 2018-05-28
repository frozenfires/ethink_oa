package com.ebring.platform.admin;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.servlet.ServletContext;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.WebApplicationContext;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.ConfigUtil;
import com.ebring.tcrc.common.FileUtil;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseFunctionDao;

/**
 * 导出日志文件
 * @author Liujian
 *
 */
public class ExportSysLogService implements IService {
	/**
	 * Logger for this class
	 */
	private static final Logger logger = Logger.getLogger(ExportSysLogService.class);

	private ITcrcBaseFunctionDao tcrcBaseFunctionDao;
	
	@Override
	public Result execute(Map<String, Object> parameterMap) {
		logger.debug("导出日志文件开始...");
		Result result = new Result();
		String logName = "";
		StringBuffer buffer = new StringBuffer();
		try {
			Integer days = Integer.parseInt(ConfigUtil.getPropertyValue("exportLogDays"));
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
			parameterMap.put("startTime",  Util.dateAdd(-days));
			parameterMap.put("endTime", format.format(new Date()));
			SimpleDateFormat dateformat = new SimpleDateFormat("yyyyMMddhhmmss");
			logName = "流水记录" + dateformat.format(new Date()) + ".sql"; // 生成临时文件名称
			String sysTempDir = System.getProperty("java.io.tmpdir");
			logger.debug("sysTempDir : " + sysTempDir);
			File tempDir = new File(sysTempDir + "TEMP");
			if (!tempDir.exists()) {
				logger.debug("tempDir is not exists !!!");
				tempDir.mkdir();
			}
			File tranlogFile = new File(tempDir + File.separator + logName);
			List<Map> tranlogList = tcrcBaseFunctionDao.selectTransLogNoPage(parameterMap); // 流水记录
			List<Map> counterList = tcrcBaseFunctionDao.selectCounterNoPage(parameterMap);
			FileUtil.write(tranlogFile, false, appendSQL(buffer, "FIN_TRAN_LOG", tranlogList), "UTF-8");
			
			buffer.setLength(0); // 清空buffer
			
			logName = "计数器信息" + dateformat.format(new Date()) + ".sql";
			File counterFile = new File(tempDir + File.separator + logName);
			FileUtil.write(counterFile, false, appendSQL(buffer , "FIN_DEVICE_COUNTER_BOOK", counterList), "UTF-8");
			
			String osName = System.getProperty("os.name").toLowerCase();
			
	        if (osName.startsWith("windows")) {
	        	Properties prop = new Properties();
	        	Resource resource = new ClassPathResource("log4j.properties");
	        	prop.load(resource.getInputStream());
	        	String logFile = prop.getProperty("log4j.appender.file.File");
	        	logger.debug("logFile : " + logFile);
//				Files.copy(new File(logFile), new File(tempDir + File.separator + logFile.substring(logFile.lastIndexOf("/") + 1)));
				
			} else if (osName.startsWith("linux")) {
				WebApplicationContext webApplicationContext = ContextLoader.getCurrentWebApplicationContext();    
				ServletContext servletContext = webApplicationContext.getServletContext();
				String serverInfo = servletContext.getServerInfo();
				logger.debug("serverInfo : " + serverInfo);
				String path = servletContext.getRealPath("/");
				logger.info("path : " + path);
				if (serverInfo.startsWith("Apache")) {
					path = path.substring(0, path.indexOf("webapps")) + "logs";
				}
				FileUtils.copyDirectory(new File(path), new File(tempDir + File.separator + "logs"));
			} else {
				
			}
	        
			logName = "系统日志" + dateformat.format(new Date()) + ".zip";
			FileUtil.createZip(tempDir.getAbsolutePath(), tempDir.getPath() + File.separator + logName);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		result.setSuccess(true);
		result.setMessage("导出日志文件成功！");
		Map<String, String> logMap = new HashMap<String, String>();
		logMap.put("reportName", logName);
		result.setContent(logMap);
		return result;
	}

	/**
	 * 拼接SQL语句
	 * @param buffer
	 * @param dmlBuffer
	 * @param valBuffer
	 * @param tranlogList
	 * @return
	 */
	private String appendSQL(StringBuffer buffer, String tableName, List<Map> DataList) {
		for (Map map : DataList) {
			int i = 1;
			StringBuffer dmlBuffer = new StringBuffer("INSERT INTO ");
			dmlBuffer.append(tableName).append(" (");
			StringBuffer valBuffer = new StringBuffer(") VALUES(");
			for (Object key : map.keySet()) {
				dmlBuffer.append(key);
				if ("INSERT_TIME".equals(key) || "FINISH_TIME".equals(key) || "UPDATE_TIME".equals(key) || "LOGTIME".equals(key)) {
					valBuffer.append("to_date('").append(map.get(key)).append("','yyyy-mm-dd hh24:mi:ss')");
				} else {
					valBuffer.append("'").append(map.get(key)).append("'");
				}
				if (i < map.size()) {
					dmlBuffer.append(",");
					valBuffer.append(",");
				}
				i++;
			}
			buffer.append(dmlBuffer).append(valBuffer.append(");")).append("\n\r");
		}
		return buffer.toString();
	}

	public ITcrcBaseFunctionDao getTcrcBaseFunctionDao() {
		return tcrcBaseFunctionDao;
	}

	public void setTcrcBaseFunctionDao(ITcrcBaseFunctionDao tcrcBaseFunctionDao) {
		this.tcrcBaseFunctionDao = tcrcBaseFunctionDao;
	}
	
}
