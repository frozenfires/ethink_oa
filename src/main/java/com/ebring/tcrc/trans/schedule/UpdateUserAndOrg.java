package com.ebring.tcrc.trans.schedule;

import org.apache.log4j.Logger;

import com.ebring.platform.common.schedule.IJob;

public class UpdateUserAndOrg implements IJob{

	private static final Logger log = Logger.getLogger(UpdateUserAndOrg.class);

	
	@Override
	public void executeJob() {
		  if(log.isDebugEnabled()){
	    	  log.debug("UpdateUserAndOrg executeJob..");
	      }
		
	}

	 

}
