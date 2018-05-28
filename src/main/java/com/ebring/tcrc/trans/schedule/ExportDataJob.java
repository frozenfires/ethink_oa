package com.ebring.tcrc.trans.schedule;

import org.apache.log4j.Logger;

import com.ebring.platform.common.schedule.IJob;

/**
 * 导出数据
 * @author zhigq
 *
 */
public class ExportDataJob implements IJob {

	private static final Logger log = Logger.getLogger(ExportDataJob.class);

	
	@Override
	public void executeJob() {
      if(log.isDebugEnabled()){
    	  log.debug("ExportDataJob executeJob..");
      }
		 

		

	}

	

}
