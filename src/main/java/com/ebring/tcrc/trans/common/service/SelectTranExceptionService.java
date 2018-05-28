package com.ebring.tcrc.trans.common.service;

import java.io.Reader;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseFunctionDao;
import com.google.common.io.CharStreams;

/**
 * 查询异常流水信息
 * @author zhigq
 *
 */
public class SelectTranExceptionService implements IService {

	private static final Logger log = Logger.getLogger(SelectTranExceptionService.class);
	
	private ITcrcBaseFunctionDao tcrcBaseFunctionDao;
	
	private String SCREEN="SCREEN";
	

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public Result execute(Map parameterMap) {
		if(log.isDebugEnabled()){
			log.debug("SelectTranExceptionService ");
		}
		
		Result result=new Result();
		try{
			
	     List<Map> list= tcrcBaseFunctionDao.selectTranException(parameterMap);
	     if(log.isDebugEnabled()){
				log.debug("SelectTranExceptionService list result:"+list);
			}
	     if(list.size()>0){
	    	 for (int i = 0; i < list.size(); i++) {
	    		 Map rowMap=list.get(i);
	    		 Object screenObj=rowMap.get(SCREEN);
	    		 if(screenObj==null){
	    			 // no-op
	    			 log.debug("SCREEN为空，无法获取屏幕截图");
	    		 }
	    		 else if(screenObj instanceof java.sql.Blob){
	    			java.sql.Blob screenBlob=(java.sql.Blob)screenObj;
	    			byte[] screenData= screenBlob.getBytes(1l, (int)screenBlob.length());
	    			String screenStr=new String(screenData);
	    			rowMap.put(SCREEN, screenStr);
	    		 }
	    		 else if(screenObj instanceof java.sql.Clob){
	    			java.sql.Clob clob=(java.sql.Clob)screenObj;
	    			Reader reader = clob.getCharacterStream();
	    			rowMap.put(SCREEN, CharStreams.toString(reader));
	    		 }
	    		 else if(screenObj!=null && screenObj instanceof String){
	    			 rowMap.put(SCREEN, screenObj);
	    		 }
	    		 else{
	    			 log.error("无法处理的数据类型" + screenObj.toString());
	    		 }
				
			  }
	     }
	    result.setContent(list);
		result.setSuccess(true);
		}catch(Exception e){
			log.error(Util.getStackTrace(e));
			result.setSuccess(false);
			result.setMessage("查询号异常流水日志失败.");	
		}
		
		return result;
	}
	
	
	
	public ITcrcBaseFunctionDao getTcrcBaseFunctionDao() {
		return tcrcBaseFunctionDao;
	}
	public void setTcrcBaseFunctionDao(ITcrcBaseFunctionDao tcrcBaseFunctionDao) {
		this.tcrcBaseFunctionDao = tcrcBaseFunctionDao;
	}

	
}
