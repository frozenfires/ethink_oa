package com.ebring.tcrc.trans.excel;

import org.apache.log4j.Logger;
import java.io.InputStream;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import com.ebring.tcrc.trans.excel.meta.ReportCons;
import com.ebring.tcrc.trans.excel.meta.ReportMetaData;
import com.ebring.tcrc.trans.excel.meta.SheetMetaData;

/**
 * 报表配置文件解析
 * @author Liujian
 *
 */
public class XMLConfigParser {
	/**
	 * Logger for this class
	 */
	private static final Logger logger = Logger.getLogger(XMLConfigParser.class);

	/**
	 * 解析报表属性
	 * @param input
	 * @return
	 */
	public static Map<String, ReportMetaData> parse(InputStream input) {
		Map<String, ReportMetaData> reportMetaDataMap = null;
		try {
			SAXReader reader = new SAXReader();
			Document doc = reader.read(input);
			Element root = doc.getRootElement();
			List<Element> reports = root.elements(ReportCons.REPORT);
			for (Element report : reports) {
				ReportMetaData reportMetaData = new ReportMetaData();
				reportMetaData.setReportId(report.attributeValue(ReportCons.REPORTID));
				reportMetaData.setReportName(report.attributeValue(ReportCons.REPORTNAME));
				reportMetaData.setTemplateFileName(report.attributeValue(ReportCons.TEMPLATEFILENAME));
				reportMetaData.setSheetMetaDatas(parseSheetData(report));
				if (reportMetaDataMap == null) {
					reportMetaDataMap = new LinkedHashMap<String, ReportMetaData>();
				}
				reportMetaDataMap.put(reportMetaData.getReportId(), reportMetaData);
			}
		} catch (DocumentException e) {
			e.printStackTrace();
		} 
		return reportMetaDataMap;
	}
	
	/**
	 * 解析报表Sheet属性
	 * @return
	 */
	public static Map<String, SheetMetaData> parseSheetData(Element reportElement){
		Map<String, SheetMetaData> sheetDatas = null;
		try {
			List<Element> sheets = reportElement.elements(ReportCons.SHEET);
			for (Element sheet : sheets) {
				SheetMetaData sheetMetaData = new SheetMetaData();
				sheetMetaData.setSheetName(sheet.attributeValue(ReportCons.SHEETNAME));
				sheetMetaData.setColumnMetaDataMap(parseColumnData(sheet));
				if (sheetDatas == null) {
					sheetDatas = new HashMap<String, SheetMetaData>();
				}
				sheetDatas.put(sheetMetaData.getSheetName(), sheetMetaData);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return sheetDatas;
	}
	
	/**
	 * 解析Cloumns属性
	 * @param sheetEelement
	 * @return
	 */
	public static Map<String, String> parseColumnData(Element sheetElement){
		Map<String, String> columnDatas = null;
		try {
			List<Element> columns = sheetElement.elements(ReportCons.COLUMN);
			for (Element column : columns) {
				if (columnDatas == null) {
					columnDatas = new LinkedHashMap<String, String>();
				}
				columnDatas.put(column.attributeValue(ReportCons.DBCOLUMN), 
						column.attributeValue(ReportCons.EXCELCOLUMN));
			}
		} catch (Exception e) {
			e.printStackTrace();
		} 
		return columnDatas;
	}
	
}
