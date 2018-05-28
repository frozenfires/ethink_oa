package com.ebring.tcrc.trans.common.service;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.annotation.Resource;
import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.session.ExecutorType;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.log4j.Logger;
import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.ConfigUtil;
import com.ebring.tcrc.common.DataEnum;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;

/**
 * 数据文件解析并同步插入数据库
 * @author Liujian
 *
 */
@Resource
public class InsertDataByFileParseService implements IService {

	private static final Logger logger = Logger.getLogger(InsertDataByFileParseService.class);
	
	private SqlSessionFactory sqlSessionFactory;
	
	public void executeJob() {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("dataType", "all");
		this.execute(map);
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public Result execute(Map<String, Object> parameterMap) {
		
		logger.debug("数据文件解析服务被调用...");
		Result result = new Result();
		
		final String dataType = (String) parameterMap.get("dataType");
		
		FileInputStream fis = null;
		InputStreamReader isr = null;
		BufferedReader br = null;
		
		String dataFileDir = ConfigUtil.getPropertyValue("dataFileDir"); // 获取数据文件存放目录
		String logFileDir = ConfigUtil.getPropertyValue("logFileDir");; // 获取日志文件存放目录
		
		logger.info(logFileDir);
		
		File dataFile = new File(dataFileDir);
		
		if (fileLastModifiedCompare(dataFile)) {
			String message = "<h3>数据文件时间较早</h3><h3>请检查是否放入了新的数据文件.";
			writeLog("error.log", logFileDir, message);
			result.setSuccess(false);
			result.setMessage(message);
		} else {
			if (dataFile != null && dataFile.exists() && dataFile.isDirectory()) { // 判断文件目录合法性
				String[] files = dataFile.list(new FilenameFilter() { // 根据前台回传的同步类型对数据文件进行过滤，如果为空则返回全部的数据文件
					@Override
					public boolean accept(File dir, String name) {
						if ("user".equals(dataType)) {
							return name.contains("USERINFO");
						} else if ("org".equals(dataType)) {
							return name.contains("BRANCHINFO");
						} else {
							return name.endsWith("dat");
						}
					}
				});
				
				// 获取批量句柄
				SqlSession sqlSession = sqlSession = this.sqlSessionFactory.openSession(ExecutorType.BATCH, false);
				// 查询数据库中用户的ID集合
				List<String> userIdList = sqlSession.selectList("selectUserAll");
				// 查询数据库中机构的ID集合
				List<String> orgIdList = sqlSession.selectList("selectOrgAll");
				
				try {
					if (files.length > 0) { // 如果数据文件存在
						
						List insertUserList = new ArrayList(); // 待插入的用户集合
						List updateUserList = new ArrayList(); // 待更新的用户集合
						List deleteUserList = new ArrayList(); // 待删除的用户集合
						List insertOrgList = new ArrayList(); // 待插入的机构集合
						List updateOrgList = new ArrayList(); // 待更新的机构集合
						List deleteOrgList = new ArrayList(); // 待删除的机构集合
						
						for (String fileName : files) { // 对数据文件进行遍历处理
							String filePath = dataFile + File.separator + fileName; // 获取数据文件存放的绝对路径
							File file = new File(filePath);
							if (file.exists()) { // 判断数据文件是否存在
								//判断数据文件日期
								file.lastModified();
								fis = new FileInputStream(file);
								isr = new InputStreamReader(fis, "UTF-8");
								br = new BufferedReader(isr);
								String line = "";
								fileName = filePath.substring(filePath.lastIndexOf(File.separator) + 1); // 获取到文件名称(带后缀)
								fileName = fileName.substring(0, fileName.lastIndexOf(".")); // 去掉文件名后缀
								while((line = br.readLine()) != null) { // 每次读取数据文件一行数据
									if (StringUtils.isNotEmpty(filePath) && StringUtils.isNotEmpty(line)) { // 判断数据文件路径和读取的数据不为空
										String[] cols = line.split("\\$\\$", -1); // 对每行数据以"$$"进行分割
										switch (DataEnum.ToTableEnum(fileName)) { // 判断数据文件类型
										case USERINFO: // 用户数据
											if (cols.length == 10) { // 用户数据共10列
												Map<String, Object> rowMap = new HashMap<String, Object>();
												rowMap.put("ORG_ID_P", cols[0]); // 柜员机构
												rowMap.put("USER_ID_P", cols[1]); //　用户ID登陆号
												rowMap.put("USER_NAME_P", cols[2]); // 柜员名称
												rowMap.put("ORG_ADMIN_P", "D".equals(cols[3]) ? 1 : 0); // 柜员级别
												rowMap.put("STATUS", cols[5]); // 柜员状态
												rowMap.put("PASSWORD", "e10adc3949ba59abbe56e057f20f883e"); // 柜员密码
												rowMap.put("ROLE_ID", "user"); // 柜员角色
												if (userIdList.contains(cols[1])) { // 判断数据库是否包含数据文件的用户ID，有的话存入待更新集合，没有的话存入待插入集合
													updateUserList.add(rowMap);
												} else {
													insertUserList.add(rowMap);
												}
											}
											break;
										case BRANCHINFO: // 机构数据
											if (cols.length == 8) {
												Map<String, Object> rowMap = new HashMap<String, Object>();
												rowMap.put("ORGG_ID", cols[0]); // 机构号
												rowMap.put("ORGG_NAME", cols[1]); // 机构名
												rowMap.put("ORG_ADDRESS", cols[2]); // 机构地址
												rowMap.put("ORG_TYPE", cols[3]); // 行所级别:(0:总行机构 1:支行网点)
												rowMap.put("PARENT_ORG_ID", cols[4]); // 所属分行机构号
//										    rowMap.put("PARENT_ORG_NAME", cols[5]); // 所属分行名称
												rowMap.put("ORG_CONTACTS", cols[6]); // 负责人手机
												rowMap.put("ORG_PHONE", cols[7]); // 负责人电话
												if (orgIdList.contains(cols[0])) { // 判断数据库是否包含数据文件的机构ID，有的话存入待更新集合，没有的话存入待插入集合
													updateOrgList.add(rowMap);
												} else {
													insertOrgList.add(rowMap);
												}
											}
											break;
										default:
											break;
										}
									}
								}
								
								if (updateUserList.size() > 0) {
									List<String> updateUserIdList = new ArrayList<String>(); // 待更新用户ID集合
									for (Iterator iter = updateUserList.iterator(); iter.hasNext();) { // 迭代待更新用户，构建待更新用户ID集合
										Map map = (Map) iter.next();
										String id = (String) map.get("USER_ID_P");
										updateUserIdList.add(id);
									}
									for (String id : userIdList) { // 迭代数据库用户ID集合，判断待更新用户ID集合是否包含有数据库用户ID，不包含的话认为是待删除用户
										if (!updateUserIdList.contains(id)) {
											Map rowMap = new HashMap();
											rowMap.put("USER_ID_P", id);
											deleteUserList.add(rowMap);
										}
									}
								}
								
								if (updateOrgList.size() < 0) { // 待更新机构ID集合
									List<String> updateOrgIdList = new ArrayList<String>();
									for (Iterator iter = updateOrgList.iterator(); iter.hasNext();) {
										Map map = (Map) iter.next();
										String id = (String) map.get("ORGG_ID");
										updateOrgIdList.add(id);
									}
									for (String id : orgIdList) { // 迭代数据库机构ID集合，判断待更新机构ID集合是否包含有数据库机构ID，不包含的话认为是待删除机构
										if (!updateOrgIdList.contains(id)) {
											Map rowMap = new HashMap();
											rowMap.put("ORGG_ID", id);
											deleteOrgList.add(rowMap);
										}
									}
								}
							} else {
								result.setSuccess(false);
								String message = "数据文件不存在: " + file.getAbsolutePath();
								result.setMessage(message);
								writeLog("error.log", logFileDir, message);
							}
						}
						
						if (insertUserList.size() > 0) {
							for (Iterator iter = insertUserList.iterator(); iter.hasNext();) {
								sqlSession.insert("insertUser", iter.next());
							}
						}
						if (updateUserList.size() > 0) {
							for (Iterator iter = insertUserList.iterator(); iter.hasNext();) {
								sqlSession.insert("updateUser", iter.next());
							}
						}
						if (deleteUserList.size() > 0) {
							for (Iterator iter = deleteUserList.iterator(); iter.hasNext();) {
								sqlSession.insert("deleteUser", iter.next());
							}
						}
						if (insertOrgList.size() > 0) {
							for (Iterator iter = insertOrgList.iterator(); iter.hasNext();) {
								sqlSession.insert("insertOrg", iter.next());
							}
						}
						if (updateOrgList.size() > 0) {
							for (Iterator iter = updateOrgList.iterator(); iter.hasNext();) {
								sqlSession.insert("updateOrg", iter.next());
							}
						}
						if (deleteOrgList.size() > 0) {
							for (Iterator iter = deleteOrgList.iterator(); iter.hasNext();) {
								sqlSession.insert("deleteOrg", iter.next());
							}
						}
						sqlSession.commit(true);
						result.setSuccess(true);
						StringBuffer message = new StringBuffer("同步数据成功:\r\n\t插入用户[");
						message.append(insertUserList.size()).append("]条，").append("更新用户[")
						.append(updateUserList.size()).append("]条，").append("删除用户[")
						.append(deleteUserList.size()).append("]条，").append("\r\n\t插入机构[")
						.append(insertOrgList.size()).append("]条，").append("更新机构[")
						.append(updateOrgList.size()).append("]条，").append("删除机构[")
						.append(deleteOrgList.size()).append("]条。");
						writeLog("info.log", logFileDir, message.toString());
						logger.info(message.toString());
					} else {
						result.setSuccess(false);
						result.setMessage("未找到数据文件: " + dataFile.getAbsolutePath());
						writeLog("error.log", logFileDir, "未找到数据文件.");
					}
				} catch (Exception e) {
					if(sqlSession != null){
						sqlSession.rollback();
						result.setSuccess(false);
						result.setMessage("数据同步失败.");
						writeLog("error.log", logFileDir, "数据同步失败.");
					}
					logger.error(Util.getStackTrace(e));
				} finally {
					try {
						if (sqlSession != null) {
							sqlSession.close();
						}
						if (br != null) {
							br.close();
						}
						if (isr != null) {
							isr.close();
						}
						if (fis != null) {
							fis.close();
						}
					} catch (Exception e2) {
						logger.error(Util.getStackTrace(e2));
					}
				}
			} else {
				result.setSuccess(false);
				result.setMessage("未找到数据文件目录: " + dataFile.getAbsolutePath());
				writeLog("error.log", logFileDir, "未找到数据文件目录.");
			}
		}
		return result;
	}
	
	/**
	 * 
	 * @param fileName      文件名
	 * @param logFileDir    日志文件存放的绝对路径
	 */
	public void writeLog(String fileName, String logFileDir, String message) {
		FileOutputStream out = null;
		OutputStreamWriter osw = null;
		BufferedWriter bw = null;
		try {
			out = new FileOutputStream(logFileDir + File.separator + new File(fileName), true);
			osw = new OutputStreamWriter(out);
			bw = new BufferedWriter(osw);
			out.write((new Date().toString() + ": " + message + "\r\n").getBytes());
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				bw.close();
				osw.close();
				out.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	/**
	 * 文件最后修改时间比较器，和当前时间进行比较判断数据文件是否是一天前放入的
	 * @param Timestamp
	 */
	public boolean fileLastModifiedCompare(File file) {
		return new Date().getTime() - file.lastModified() > 60 * 60 * 24 * 1000 ? true : false;
	}
	
	public SqlSessionFactory getSqlSessionFactory() {
		return sqlSessionFactory;
	}

	public void setSqlSessionFactory(SqlSessionFactory sqlSessionFactory) {
		this.sqlSessionFactory = sqlSessionFactory;
	}
	
}
