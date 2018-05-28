package com.ebring.tcrc.trans.common.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.session.ExecutorType;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.log4j.Logger;
import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * 插入冠字号公共 服务
 * 客户端上送数据时json key 应该是CASHNODATA
 * 结构示例如下:
 * {
 *   "CASHNODATA":{
 *      "100":"[12123232,3434354]",
 *      "50":"[45455454,343434]"
 *    }
 * }
 *  
 * @author ZHIGQ
 * 
 */
public class InsertCashNoService implements IService {

	private static final Logger log = Logger.getLogger(InsertCashNoService.class);

	private SqlSessionFactory sqlSessionFactory;

	@SuppressWarnings("unchecked")
	@Override
	public Result execute(Map<String, Object> parameterMap) {
		if (log.isDebugEnabled()) {
			log.debug("InsertCashNoService 写冠字号服务..");
		}
		long start = System.currentTimeMillis();
		Result result = new Result();
		SqlSession sqlSession=null;
		
		try {
			 List<String> data = (List<String>) parameterMap.get("CASHNODATA");
			 if (data != null && data.size() > 0) {
				String tranlog_id = (String) parameterMap.get("TRANLOG_ID");
				String trancode = (String) parameterMap.get("TRANCODE");
				String device_id = (String) parameterMap.get("DEVICE_ID");
				String mainlog_id = (String) parameterMap.get("MAINLOG_ID");
				String logtime = (String) parameterMap.get("LOGTIME");
				String userIp = (String) parameterMap.get("USER_IP");
				
				ObjectMapper mapper = new ObjectMapper();

				//获取批量句柄
				sqlSession = this.sqlSessionFactory.openSession(ExecutorType.BATCH, false);

				for (String json : data) {
					if (StringUtils.isNotEmpty(json)) {
						Map<String, Object> cashNoData = mapper.readValue(json, Map.class);
						for (String cashType : cashNoData.keySet()) {
							List<String> cashList = (List<String>) cashNoData.get(cashType);
							for (String cashNo : cashList) {
								Map<String, String> rowMap = new HashMap<String, String>();
								rowMap.put("TRANLOG_ID", tranlog_id);
								rowMap.put("SNO", cashNo);
								rowMap.put("AMTTYPE", cashType);
								rowMap.put("TRANCODE", trancode);
								rowMap.put("DEVICE_ID", device_id);
								rowMap.put("CCY", "CNY");
								rowMap.put("CLIENTID", userIp);
								rowMap.put("MAINLOG_ID", mainlog_id);
								rowMap.put("LOGTIME", logtime);
								rowMap.put("USER_IP", userIp);
								sqlSession.insert("insertCashNo", rowMap);
							}
						}
					}
				}
				sqlSession.commit(true);
				result.setSuccess(true);
			} else {
				result.setMessage("冠字号为空！");
				result.setSuccess(false);
			}
		} catch (Exception e) {
			if(sqlSession!=null){
				sqlSession.rollback();
			}
			log.error(Util.getStackTrace(e));
			result.setSuccess(false);
			result.setMessage("写冠字号错误.");
		}finally{
			 if(sqlSession!=null){
			    sqlSession.close();
			 }
		}

		if (log.isDebugEnabled()) {
			log.debug("InsertCashNoService 用时:"+ (System.currentTimeMillis() - start));
		}
		
		return result;
	}


	public SqlSessionFactory getSqlSessionFactory() {
		return sqlSessionFactory;
	}

	public void setSqlSessionFactory(SqlSessionFactory sqlSessionFactory) {
		this.sqlSessionFactory = sqlSessionFactory;
	}

}
