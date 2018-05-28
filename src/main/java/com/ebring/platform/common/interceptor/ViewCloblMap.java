/**
 * Ethink 2015 copyright
 * 
 */
package com.ebring.platform.common.interceptor;

import java.io.Reader;
import java.sql.Clob;
import java.util.HashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.io.CharStreams;


/**
 *
 * 描述:
 * @author wangjing.dc@qq.com
 */
public class ViewCloblMap extends HashMap<Object, Object>{
	
	private static final Logger log = LoggerFactory.getLogger(ViewCloblMap.class);

	private static final long serialVersionUID = 1L;
	
	

	/* (non-Javadoc)
	 * @see java.util.HashMap#put(java.lang.Object, java.lang.Object)
	 */
	@Override
	public Object put(Object key, Object value) {
		if(value instanceof Clob){
			value = this.mapClob((Clob) value);
		}
		
		return super.put(key, value);
	}

	/* (non-Javadoc)
	 * @see java.util.HashMap#get(java.lang.Object)
	 */
	@Override
	public Object get(Object key) {
		Object value = super.get(key);
		if(value instanceof Clob){
			return mapClob((Clob)value);
		}else{
			return value;
		}
	}

	private Object mapClob(Clob clob) {
		try {
			Reader reader = clob.getCharacterStream();
			return CharStreams.toString(reader);
		} catch (Exception e) {
			log.error("数据类型转换失败", e);
			return "error";
		}
	}
	
	
}
