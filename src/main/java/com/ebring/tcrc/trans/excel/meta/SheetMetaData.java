package com.ebring.tcrc.trans.excel.meta;

import java.util.Map;

public class SheetMetaData {

	private String sheetName;
	private Map<String, String> columnMetaDataMap;

	public String getSheetName() {
		return sheetName;
	}

	public void setSheetName(String sheetName) {
		this.sheetName = sheetName;
	}

	public Map<String, String> getColumnMetaDataMap() {
		return columnMetaDataMap;
	}

	public void setColumnMetaDataMap(Map<String, String> columnMetaDataMap) {
		this.columnMetaDataMap = columnMetaDataMap;
	}

}
