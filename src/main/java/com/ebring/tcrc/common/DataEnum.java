package com.ebring.tcrc.common;

public enum DataEnum {
	
	BRANCHINFO, USERINFO, CARDBININFO, OTHER;
	
	public static DataEnum ToTableEnum(String tableName) {
		try {
			return valueOf(tableName);
		} catch (Exception e) {
			System.out.println(Util.getStackTrace(e));
		}
		return OTHER;
	}
}
