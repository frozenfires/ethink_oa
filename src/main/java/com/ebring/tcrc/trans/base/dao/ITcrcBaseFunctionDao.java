package com.ebring.tcrc.trans.base.dao;

import java.util.List;
import java.util.Map;

import com.ebring.platform.common.page.RowLimit;

/**
 * TCR 基础交易功能DAO接口
 * 
 * @author zhigq
 *
 */
public interface ITcrcBaseFunctionDao {
	
	/**
	 * 查询冠字号
	 * @param param
	 * @param rowLimit
	 * @return
	 */
	public List<Map> selectCashNumber(Map param,RowLimit rowLimit);
	
	/**
	 * 查询交易流水日志信息
	 * @param param
	 * @param rowLimit
	 * @return
	 */
	public List<Map> selectTransLog(Map param,RowLimit rowLimit);
	
	/**
	 * 查询交易流水日志信息
	 * @param param
	 * @param rowLimit
	 * @return
	 */
	public List<Map> selectTransLogNoPage(Map param);
	
	/**
	 * 查询帐户查询
	 * @param param
	 * @return
	 */
	public List<Map> queryAccount(Map param);
	
	/**
	 * 查询帐户详情
	 * @param param
	 * @return
	 */
	public List<Map> selectAmt(Map param,RowLimit rowLimit);
	
	/**
	 * 写交易流水日志
	 * @param param
	 * @return
	 */
    public int insertTransLog(Map param);
    
    /**
     * 修改流水日志 
     * @param param
     * @return
     */
    public int updateTransLog(Map param);
    
    /**
     * 根据Tranlog_id 查询一条日志信息
     * @param param
     * @return
     */
    public List<Map> selectTranLogForID(Map param);
    
    /**
     * 更新帐户余额
     * @param param
     * @return
     */
    public int updateAccountCashBalance(Map param);
    
    /**
     * 写帐户登记簿
     * @param param
     * @return
     */
    public int insertAccountBook(Map param);
    
    /**
     * 查询账户余额
     * @param param
     * @return
     */
    public List<Map> selectAccountCashBalance(Map param);
    
    /**
     * 写冠字号
     * @param param
     * @return
     */
    public int insertCashNo(Map param);
    
    /**
     * 写设备进出钞信息
     * @param param
     * @return
     */
    public int insertDeviceCashInfo(Map param);
    
    /**
     * 写异常日志
     * @param param
     * @return
     */
    public int insertTranException(Map param);
    
    /**
     * 查询异常日志
     * @param param
     * @return
     */
    public List<Map>  selectTranException(Map param);
    
    /**
     * 写交易暂存信息
     * @param param
     * @return
     */
    public int insertTempTranInfo(Map param);
    
    /**
     *  修改交易暂存信息
     * @param param
     * @return
     */
    public int updateTempTranInfo(Map param);
    
    /**
     *  查询交易暂存信息
     * @param param
     * @return
     */
    public List<Map> selectTempTranInfo(Map param);
    
    /**
     * 查询counter信息
     * @param param
     * @return
     */
    public List<Map> selectCounter(Map param);
    
    /**
     * 查询设备计数器信息
     * @param param
     * @return
     */
    public List<Map> selectCounterNoPage(Map param);
    
    /**
     * 查询最后一条流水信息
     * @param param
     * @return
     */
    public List<Map> selectLastTranlog(Map param);
    
    /**
     * 插入长短款
     * @param param
     * @return
     */
    public int insertBadaccount(Map param);
    
    /**
     * 查询一条流水信息
     * @param param
     * @return
     */
    public List<Map> selectTranLogFromTranID(Map param);
    
    /**
     * 删除冠字号记录
     * @param param
     * @return
     */
    public int deleteCashNo(Map param);
    
    /**
     * 日志记录
     * @param param
     * @return
     */
    public int deleteTranLog(Map param);
    
    /**
     * 查询终端IP2
     * @param param
     * @return
     */
    public List<Map> selectTerminalByDeviceId(Map param);
    
    /**
     * 流水查询 打印需要不分页
     * @param param
     * @return
     */

	public List<Map> selectTransLogNotPage(Map param);
	
	/**
	 * 插入凭证类型数据
	 * @param param
	 * @return
	 */
	public int insertVoucher(Map param);
	
	/**
	 * 更新凭证类型数据
	 * @param param
	 * @return
	 */
	public int updateVoucher(Map param);

    /**
     * 查询凭证类型
     */
    public List<Map> selectVoucher(Map param);

    /**
     * 查询凭证类型图片
     */
    public List<Map> selectVoucherPic(Map param);

    /**
     * 删除凭证类型
     */
    public int deleteVoucher(Map param);
    
    /**
     * 删除凭证类型分配信息
     */
	public int deletetVoucherAlloc(Map param);
	
	/**
	 * 添加凭证类型分配信息
	 */
	public int insertVoucherAlloc(Map param);
	
    /**
     *  查询网点分配表信息
     */
    public List<Map> selectOrg_Vou(Map param);
}
