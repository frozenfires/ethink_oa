package com.ebring.platform.common.page;

import org.apache.ibatis.session.RowBounds;

public class RowLimit extends RowBounds {

	
	public RowLimit(int offset,int limit){
		super(offset,limit);
	}
	
}
