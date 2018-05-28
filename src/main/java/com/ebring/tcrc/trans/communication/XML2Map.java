package com.ebring.tcrc.trans.communication;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.log4j.Logger;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;


/**
 * xml 解析成Map 解析XML 使用 dom4j
 * 
 * @author zhigq
 * 
 */
public class XML2Map {
	
	private static final Logger log = Logger.getLogger(XML2Map.class);

	public Map xml2Map(byte[] content) {
		Map contentMap = new HashMap();
		SAXReader saxReader = new SAXReader();
		InputStream in = new ByteArrayInputStream(content);
		Document document = null;
		try {
			document = saxReader.read(in);
			Element rootElt = document.getRootElement();
			Iterator iter = rootElt.elementIterator();
			while (iter.hasNext()) {
				Element recordEle = (Element) iter.next();
                contentMap.put(recordEle.getName(), recordEle.getText());
				if(log.isDebugEnabled()){
					log.debug(recordEle.getName() + ":"+ recordEle.getText());
				}
			 }
		} catch (DocumentException e) {
			e.printStackTrace();
		 }
		return contentMap;

	}

}
