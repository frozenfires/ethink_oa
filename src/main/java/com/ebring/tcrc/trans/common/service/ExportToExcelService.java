package com.ebring.tcrc.trans.common.service;

import org.apache.log4j.Logger;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.ClassPathResource;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.FileUtil;
import com.ebring.tcrc.common.GlobalTcrc;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.trans.excel.XMLConfigParser;
import com.ebring.tcrc.trans.excel.meta.ReportMetaData;
import com.google.common.io.Files;

/**
 * 导出到Excel
 * @author Liujian
 *
 */
public class ExportToExcelService implements IService {
	/**
	 * Logger for this class
	 */
	private static final Logger log = Logger.getLogger(ExportToExcelService.class);
	
	private CommonQueryService commonQueryService;
	private String downLoadPath = "/download";
	private String downLoadRealPath;

	@Override
	public Result execute(Map<String, Object> parameterMap) {
		Result result = new Result();
		int TOTAL = (Integer) parameterMap.get("TOTAL");
		String reportId = (String) parameterMap.get("reportId");
		String reportName = "";
		List<String> keys = new ArrayList<String>();
		File toFile = null;
		downLoadRealPath = (String) parameterMap.get(GlobalTcrc.PARAM_REALPATH);
		downLoadRealPath += downLoadPath;
		log.debug("sysTempDir : " + downLoadRealPath);
		
		try{
			clearDownloadPath();
		}catch(Exception e){
			log.error("清除临时文件出错", e);
		}
		
		try {
			Map<String, ReportMetaData> reports = XMLConfigParser
					.parse(new ClassPathResource("template/report.xml")
							.getInputStream());
			log.debug("reports : " + reports.size());
			if (!reports.isEmpty()) {
				ReportMetaData reportMetaData = reports.get(reportId);
				Map<String, String> columnMetaDataMap = reportMetaData
						.getSheetMetaDatas().get("Sheet1")
						.getColumnMetaDataMap();
				StringBuffer headerTr = new StringBuffer("<tr>");
				for (Map.Entry<String, String> entry : columnMetaDataMap
						.entrySet()) {
					log.debug("key : " + entry.getKey() + ", value : "
							+ entry.getValue());
					keys.add(entry.getKey());
					headerTr.append(String.format(
							"<td class='xl27' x:str>%s</td>\r\n",
							entry.getValue()));
				}
				headerTr.append("</tr>\r\n");
				SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmSS");
				reportName = reportMetaData.getReportName()
						+ format.format(new Date()) + ".xls"; // 生成临时文件名称
				
				File tempDir = new File(downLoadRealPath);
				if (!tempDir.exists()) {
					log.debug("tempDir is not exists !!!");
					tempDir.mkdir();
				}
				toFile = new File(tempDir + File.separator + reportName);
				log.debug("toFile.FilePath : " + toFile.getAbsolutePath());
				Files.copy(new ClassPathResource("template/template.xls")
						.getFile(), toFile);
				FileUtil.write(toFile, true, headerTr.toString(), "UTF-8");
			}
		} catch (IOException e) {
			log.error("error : ", e);
		}
		
		for (int i = 0; i < TOTAL / 5000 + 1; i++) {
			parameterMap.put("iDisplayStart", 5000 * i);
			parameterMap.put("iDisplayLength", i == TOTAL / 5000 ? TOTAL % 5000 : 5000);
			Result rel = commonQueryService.execute(parameterMap);
			if (rel != null && rel.getContent() != null && rel.getContent() instanceof Map) {
				Map content = (Map) rel.getContent();
				List<Map> list = (List) content.get("aaData");
				StringBuffer html = appendHtml(keys, list);
				FileUtil.write(toFile, true, html.append(i == TOTAL / 5000 ? "</table>\r\n</body>\r\n</html>" : "").toString(), "UTF-8");
			}
		}
		result.setSuccess(true);
		result.setMessage("导出Excel成功！");
		Map<String, String> reportMap = new HashMap<String, String>();
		
		String reportFilePath = this.downLoadPath +  File.separator + reportName;
		reportMap.put("reportName", reportFilePath);
		result.setContent(reportMap);
		return result;
	}
	
	/**
	 * 删除过时的临时文件
	 */
	private void clearDownloadPath() {
		File downFile = new File(this.downLoadRealPath);
		File[] files = downFile.listFiles();
		for(int i=0; i<files.length; i++){
			File tmpFile = files[i];
			long lastTime = System.currentTimeMillis() - tmpFile.lastModified();
			long lastHour = lastTime/1000/60/60;
			// 如果临时文件已经超过指定时间，则删掉
			if(lastHour > 36){
				log.debug(tmpFile.getName() + "已经过去"+lastHour+"小时了，过于久远，已清除。");
				tmpFile.delete();
//				org.aspectj.util.FileUtil.deleteContents(file);
			}
		}
	}

	/**
	 * 拼接HTML字符串
	 * @param keys
	 * @param list
	 * @return
	 */
	private StringBuffer appendHtml(List<String> keys,
			List<Map> list) {
		StringBuffer html = new StringBuffer();
		for (Map rows : list) {
			StringBuffer tr = new StringBuffer("<tr>");
			for (String key : keys) {
				tr.append(String.format("<td class='xl25' x:str>%s</td>\r\n", rows.get(key) == null ? "" : rows.get(key)));
			}
			html.append(tr.append("</tr>\r\n"));
		}
		return html;
	}
	
	public CommonQueryService getCommonQueryService() {
		return commonQueryService;
	}
	
	public void setCommonQueryService(CommonQueryService commonQueryService) {
		this.commonQueryService = commonQueryService;
	}
	
}
