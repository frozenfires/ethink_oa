package com.ebring.platform.common.service;

import java.util.Map;

import com.ebring.tcrc.common.Result;

/**
 * 服务接口
 * @author zhigq
 *
 */
public interface IService {
	
	public Result execute(Map<String, Object> parameterMap);

}
