package com.ebring.tcrc.trans.schedule;

import com.ebring.platform.common.license.TCREntry;
import com.ebring.platform.common.schedule.IJob;

/**
 * 每天进行license验证
 * @author Hippo_Bai
 *
 */
public class ValidateLicense implements IJob {

	@Override
	public void executeJob() {

	 TCREntry.re_validate();


	}

	

}
