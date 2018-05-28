package com.ebring.tcrc.trans.excel.meta;

import java.util.Map;

/**
 * 报表元数据
 * 
 * @author Liujian
 * 
 */
public class ReportMetaData {

	private String reportId;// 报表Id
	private String reportName;// 报名名称
	private String templateFileName;// 模版文件名
	private Map<String, SheetMetaData> sheetMetaDatas;// sheet属性集合<sheetName,sheetMetadata>

	public String getReportId() {
		return reportId;
	}

	public void setReportId(String reportId) {
		this.reportId = reportId;
	}

	public String getReportName() {
		return reportName;
	}

	public void setReportName(String reportName) {
		this.reportName = reportName;
	}

	public String getTemplateFileName() {
		return templateFileName;
	}

	public void setTemplateFileName(String templateFileName) {
		this.templateFileName = templateFileName;
	}

	public Map<String, SheetMetaData> getSheetMetaDatas() {
		return sheetMetaDatas;
	}

	public void setSheetMetaDatas(Map<String, SheetMetaData> sheetMetaDatas) {
		this.sheetMetaDatas = sheetMetaDatas;
	}

}
