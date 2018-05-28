package com.ebring.tcrc.common;

import java.util.ResourceBundle;

public class ConfigUtil {

	private static final ResourceBundle bundle = ResourceBundle.getBundle("config");
	
	public static String getPropertyValue(String propertyName){
		return bundle.getString(propertyName);
	}
	
}
