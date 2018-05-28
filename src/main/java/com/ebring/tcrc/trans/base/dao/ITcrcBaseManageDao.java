package com.ebring.tcrc.trans.base.dao;

import java.util.List;
import java.util.Map;

import com.ebring.platform.common.page.RowLimit;


/**
 * 
 * TCR基础管理（自有功能）Dao
 * 
 * @author zhigq
 *
 */
public interface ITcrcBaseManageDao {

	/**
	 * 查询用户分页
	 * @param parameterMap
	 * @param rowLimit
	 * @return
	 */
	public List<Map> selectUserPage(Map parameterMap,RowLimit rowLimit);
	
	/**
	 * 查询用户不分页
	 * @param parameterMap
	 * @param rowLimit
	 * @return
	 */
	public List<Map> selectUserPage(Map parameterMap);
	
	/**
	 * 查询用户密码通过USER_ID查询
	 * @param parameterMap
	 * @return
	 */
	public String selectUserPwdByID(Map parameterMap);
	
	/**
	 * 修改用户密码
	 * @param parameterMap
	 * @return
	 */
	public int changePwdByID(Map parameterMap);
	
	/**
	 * 新增用户
	 * @param parameterMap
	 * @return
	 */
	public int insertUser(Map parameterMap);
	
	/**
	 * 查询一条用户信息
	 * @param parmeterMap
	 * @return
	 */
	public List<Map> selectUserDetail(Map parmeterMap);
	/**
	 * 查询一条用户名字
	 * @param parmeterMap
	 * @return
	 */
	public String selectUsername(String userid);
	/**
	 * 查询一条用户信息
	 * @param parmeterMap
	 * @return
	 */
	public List<Map> selectUserDetailInfo(Map parmeterMap);
	
	/**
	 * 修改用户信息
	 * @param parameterMap
	 * @return
	 */
	public int updateUser(Map parameterMap);
	
	/**
	 * 删除用户
	 * @param parameterMap
	 * @return
	 */
	public int deleteUser(Map parameterMap);
	
	
	
	/**
	 * 查询资源分页
	 * @param parameterMap
	 * @param rowLimit
	 * @return
	 */
	public List<Map> selectResourcePage(Map parameterMap,RowLimit rowLimit);
	
	/**
	 * 新增资源
	 * @param parameterMap
	 * @return
	 */
	public int insertResource(Map parameterMap);
	
	/**
	 * 查询一条资源信息
	 * @param parmeterMap
	 * @return
	 */
	public List<Map> selectResourceDetail(Map parmeterMap);
	
	/**
	 * 修改资源信息
	 * @param parameterMap
	 * @return
	 */
	public int updateResource(Map parameterMap);
	
	/**
	 * 删除资源
	 * @param parameterMap
	 * @return
	 */
	public int deleteResource(Map parameterMap);
	
	
	
	/**
	 * 查询设备类型分页
	 * @param parameterMap
	 * @param rowLimit
	 * @return
	 */
	public List<Map> selectTypePage(Map parameterMap,RowLimit rowLimit);
	
	

	/**
	 * 查询设备类型不分页
	 * @param parameterMap
	 * @param rowLimit
	 * @return
	 */
	public List<Map> selectTypePage(Map parameterMap);
	
	/**
	 * 新增设备类型
	 * @param parameterMap
	 * @return
	 */
	public int insertType(Map parameterMap);
	
	/**
	 * 查询一条设备类型
	 * @param parmeterMap
	 * @return
	 */
	public List<Map> selectTypeDetail(Map parmeterMap);
	
	/**
	 * 修改设备型号
	 * @param parameterMap
	 * @return
	 */
	public int updateType(Map parameterMap);
	
	/**
	 * 删除设备型号
	 * @param parameterMap
	 * @return
	 */
	public int deleteType(Map parameterMap);
	
	
	/**
	 * 查询设备信息分页
	 * @param parameterMap
	 * @param rowLimit
	 * @return
	 */
	public List<Map> selectDeviceinfoPage(Map parameterMap,RowLimit rowLimit);
	
	/**
	 * 新增设备信息
	 * @param parameterMap
	 * @return
	 */
	public int insertDeviceinfo(Map parameterMap);
	
	/**
	 * 查询一条设备信息
	 * @param parmeterMap
	 * @return
	 */
	public List<Map> selectDeviceinfoDetail(Map parmeterMap);
	
	/**
	 * 查询一条设备信息通过设备IP查询
	 * @param parmeterMap
	 * @return
	 */
	public List<Map> selectDeviceinfoDetailByDeviceIp(Map parmeterMap);
	
	/**
	 * 修改设备信息
	 * @param parameterMap
	 * @return
	 */
	public int updateDeviceinfo(Map parameterMap);
	
	/**
	 * 删除设备信息
	 * @param parameterMap
	 * @return
	 */
	public int deleteDeviceinfo(Map parameterMap);
	
	/**
	 * 查询角色分页
	 * @param parameterMap
	 * @param rowLimit
	 * @return
	 */
	public List<Map> selectRolePage(Map parameterMap,RowLimit rowLimit);
	
	/**
	 * 新增角色
	 * @param parameterMap
	 * @return
	 */
	public int insertRole(Map parameterMap);
	
	/**
	 * 查询一条角色信息
	 * @param parmeterMap
	 * @return
	 */
	public List<Map> selectRoleDetail(Map parmeterMap);
	
	/**
	 * 修改角色信息
	 * @param parameterMap
	 * @return
	 */
	public int updateRole(Map parameterMap);
	
	/**
	 * 删除角色
	 * @param parameterMap
	 * @return
	 */
	public int deleteRole(Map parameterMap);
	
	/**
	 * 查询现金账户分页
	 * @param parameterMap
	 * @param rowLimit
	 * @return
	 */
	public List<Map> selectAccountPage(Map parameterMap,RowLimit rowLimit);
	
	/**
	 * 查询现金账户详情
	 * @param parameterMap
	 * @param rowLimit
	 * @return
	 */
	public List<Map> selectAccountInfo(Map parameterMap);
	
	/**
	 * 新增现金账户
	 * @param parameterMap
	 * @return
	 */
	public int insertAccount(Map parameterMap);
	
	/**
	 * 查询一条现金账户信息
	 * @param parmeterMap
	 * @return
	 */
	public List<Map> selectAccountDetail(Map parmeterMap);
	
	/**
	 * 修改现金账户信息
	 * @param parameterMap
	 * @return
	 */
	public int updateAccount(Map parameterMap);
	
	/**
	 * 删除现金账户
	 * @param parameterMap
	 * @return
	 */
	public int deleteAccount(Map parameterMap);
	
	
	/**
	 * 查询品牌分页
	 * @param parameterMap
	 * @param rowLimit
	 * @return
	 */
	public List<Map> selectBrandPage(Map parameterMap,RowLimit rowLimit);
	
	
	/**
	 * 查询品牌不分页
	 * @param parameterMap
	 * @param rowLimit
	 * @return
	 */
	public List<Map> selectBrandPage(Map parameterMap);
	
	/**
	 * 新增品牌
	 * @param parameterMap
	 * @return
	 */
	public int insertBrand(Map parameterMap);
	
	/**
	 * 查询一条品牌信息
	 * @param parmeterMap
	 * @return
	 */
	public List<Map> selectBrandDetail(Map parmeterMap);
	
	/**
	 * 修改品牌信息
	 * @param parameterMap
	 * @return
	 */
	public int updateBrand(Map parameterMap);
	
	/**
	 * 删除品牌
	 * @param parameterMap
	 * @return
	 */
	public int deleteBrand(Map parameterMap);
	
	/**
	 * 查询机构分页
	 * @param parameterMap
	 * @param rowLimit
	 * @return
	 */
	public List<Map> selectOrgPage(Map parameterMap,RowLimit rowLimit);
	
	/**
	 * 查询机构不分页
	 * @param parameterMap
	 * @param rowLimit
	 * @return
	 */
    public List<Map> selectAddressPage(Map parameterMap,RowLimit rowLimit);
	
	/**
	 * 查询区域不分页
	 * @param parameterMap
	 * @param rowLimit
	 * @return
	 */
	public List<Map> selectOrgPage(Map parameterMap);
	
	/**
	 * 新增机构
	 * @param parameterMap
	 * @return
	 */
	public int insertOrg(Map parameterMap);
	
	/**
	 * 新增区域
	 * @param parmeterMap
	 * @return
	 */
    public int insertAddressOrg(Map parameterMap);
	
	/**
	 * 查询一条客户信息
	 * @param parmeterMap
	 * @return
	 */
	public List<Map> selectOrgDetail(Map parmeterMap);
	
	/**
	 * 查询一条区域信息
	 * @param parmeterMap
	 * @return
	 */
	public List<Map> selectAddressDetail(Map parmeterMap);
	/**
	 * 查询机构树
	 * @param parmeterMap
	 * @return
	 */
	public List<Map> selectOrgTree(Map parmeterMap);
	
	/**
	 * 修改机构信息
	 * @param parameterMap
	 * @return
	 */
	public int updateOrg(Map parameterMap);
	
	/**
	 * 修改机构信息
	 * @param parameterMap
	 * @return
	 */
	public int upAddressOrg(Map parameterMap); 
	/**
	 * 删除机构
	 * @param parameterMap
	 * @return
	 */
	public int deleteOrg(Map parameterMap);
	/**
	 * 根据id查客户信息行记录
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectCuscountTByID(Map parameterMap);
	
	/**
	 * 删除区域
	 * @param parameterMap
	 * @return
	 */
	public int deleteAddress(Map parameterMap);
	/**
	 * 查询地域
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectDeviceArea(Map parameterMap);
	
	/**
	 * 根据iP查询现金帐户
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectAccountFromIP(Map parameterMap);
	
	/**
	 * 查询交易类型
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectTrantype(Map parameterMap);
	
	/**
	 * 更新用户的现金帐户信息
	 * @param parameterMap
	 * @return
	 */
	public int updateUserAccount(Map parameterMap);
	
	/**
	 * 更现金帐户对应的用户
	 * @param parameterMap
	 * @return
	 */
	public int updateAccountUser(Map parameterMap);
	
	/**
	 * 更新现金账户中对应的终端IP
	 * @param parameterMap
	 * @return
	 */
	public int updateAccountIp(Map parameterMap);
	
	/**
	 * 查询当前用户角色对权限范围
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectRoleAuth(Map parameterMap);
	
	/**
	 * 查询角色信息列表
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectRole(Map parameterMap);
	
	/**
	 * 查询资源树
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectResourceTree(Map parameterMap);
	
	/**
	 * 插入角色对应的资源
	 * @param parameterMap
	 * @return
	 */
	public int insertRoleResource(Map parameterMap);
	
	/**
	 * 删除角色对应的资源
	 * @param parameterMap
	 * @return
	 */
	public int deleteRoleResource(Map parameterMap);
	
	/**
	 * 查询已有角色对应的资源树查询
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectResourceTreeForRole(Map parameterMap);
	
	/**
	 * 查询当前用户菜单
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectUserMenu(Map parameterMap);
	
	
	/**
	 * 查询资源信息
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectDeviceinfo(Map parameterMap);
	
	/**
	 * 插入序列号
	 * @param parameterMap
	 * @return
	 */
	public int insertSeqNo(Map parameterMap);
	
	/**
	 * 删除序列号
	 * @param parameterMap
	 * @return
	 */
	public int deleteSeqNo(Map parameterMap);
	
	/**
	 * 修改序列号
	 * @param parameterMap
	 * @return
	 */
	public int updateSeqNo(Map parameterMap);
	
	/**
	 *查询序列号
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectSeqNo(Map parameterMap);
	
	/**
	 * 查询终端IP是否已绑定设备
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectDeviceinfoByTerminal(Map parameterMap);
	
	/**
	 * 查询终端IP2是否已绑定设备
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectDeviceinfoByTerminal2(Map parameterMap);
	
	/**
	 * 查询设备是否绑定双终端IP
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectIsTowTeller(Map parameterMap);
	
	/**
	 * 查询用户信息
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectUser(Map parameterMap);
	
	/**
	 * 解绑现金账户
	 * @param parameterMap
	 * @return
	 */
	public int unbindAccountUser(Map parameterMap); 
	
	/**
	 * 查询安装点类型不分页
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectFixTypePage(Map parameterMap);
	
	/**
	 * 查询设备型号不分页
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectDeviceModelPage(Map parameterMap);
	
	/**
	 * 查询服务商不分页
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectProviderPage(Map parameterMap);
	
	/**
	 * 插入系统使用时间数据
	 * @param parameterMap
	 * @return
	 */
	public int insertSystemUseTime(Map parameterMap);
	
	/**
	 * 查询系统使用时间设置数据
	 * @param parameterMap
	 * @param rowLimit
	 * @return
	 */
	public List<Map> findAllSystemUseTime(Map parameterMap,RowLimit rowLimit);
	
	/**
	 * 删除时间设置中的选定行数据
	 * @param parameterMap
	 * @return
	 */
	public int deleteRows(Map parameterMap);
	

	
	/**
	 * 查询网点号
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectOrgid2(Map parameterMap);
	
	/**
	 * 查询网点设备号
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectDeviceid(Map parameterMap);
	
	/**
	 * 通过网点号查询设备号
	 * @param parameterMap
	 * @return
	 */
	public List<Map> findByORG_ID(Map parameterMap);
	
	
	/**
	 * 后屏管理通项目中过网点号查询设备号名称
	 * @param parameterMap
	 * @return
	 */
	public List<Map> findByORG_NAME2(Map parameterMap);
	
	/**
	 * 使用时间设置模块数据修改
	 */
	public int updateUseTimeDate(Map parameterMap);
	
	/**
	 * 验证使用时间设置模块是否增加提交重复数据
	 */
	public List<Map> InspectionSaveDateSubmit(Map parameterMap);
	
	/**
	 * 查询BASE_RESOURCE表是否需要增加时间设置验证
	 */
	public String selectBaseSourceIsY(Map parameterMap);
	
	/**
	 * 根据网点号和设备号查询
	 */
	public List<Map> SelectBaseSystemUseTimeByORG_IDAndDEVICE_ID(Map parameterMap);
	
	/**
	 * 根据网点号查询
	 */
	public List<Map> SelectBaseSystemUseTimeByORG_IDA(Map parameterMap);
	
	/**
	 * 当网点号和设备号都为空时查询时间验证
	 */
	public List<Map> SelectBaseSystemUseTimeByempty();
	
	/**
	 * 插入用户交接交易数据
	 * @param parameterMap
	 * @return
	 */
	public int insertUserHandoverLog(Map parameterMap);
	
	/**
	 * 查询交接查询数据
	 */
	public List<Map> findAllUserhandover_log(Map parameterMap,RowLimit rowLimit);
	
	/**
	 * 查询交接查询中的网点号
	 */
	public List<Map> selecHanderOvertid(Map parameterMap);
	
	/**
	 * 通过交接查询表中的网点号查询设备号
	 * @param parameterMap
	 * @return
	 */
	public List<Map> findByHandOver_ID(Map parameterMap);
	
	/**
	 * 通过传入的网点号和设备号查出BASE_SYSTEM_USE_TIME表中的USE_TIME字段的数据
	 */
	public List<Map> selectUSE_TIME(Map parameterMap);
	
	/**
	 * 通过传入的主键列uuid和网点号、设备号查出BASE_SYSTEM_USE_TIME表中的不包含本uuid的USE_TIME字段的数据
	 */
	public List<Map> updateSelectUSE_TIME(Map parameterMap);
	
	/**
	 * 后屏管理查询网点号
	 * @param parameterMap
	 * @return
	 */
	public List<Map> findMechanismNumber();
	
	/**
	 * 后屏管理数据查询
	 * @param parameterMap
	 * @return
	 */
	public List<Map> ElectronicLog(Map parameterMap,RowLimit rowLimit);
	
	/**
	 * 后屏管理根据网点号查询设备号
	 * @param parameterMap
	 * @return
	 */
	public List<Map> findDevice(Map parameterMap);
	
	/**
	 * 插入电子日志信息
	 * @param parameterMap
	 * @return
	 */
	public int InsertStatement(Map parameterMap);
	
	/**
	 * 获得前屏传入的机构号和设备号，插入专门的表中
	 * @param parameterMap
	 * @return
	 */
	public int InsertOrgAndDevice(Map parameterMap);
	
	/**
	 * 获得前屏传入的机构号和设备号，插入专门的表中
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectOrgAndDeviceFromSELF_ELOG();
	
	/**
	 * 查询专门存放前屏传入电子日志服务的网点号、设备号表(SELF_DEVICE)
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectSELF_DEVICE();
	
	
	/**
	 * 查询区域信息列表
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectAddress(Map parameterMap);
	

	/**
	 * 查询一条代理商信息
	 * @param parmeterMap
	 * @return
	 */
	public List<Map> selectAgentDetail(Map parmeterMap);
	/**
	 * 查询代理商信息
	 * @param parmeterMap
	 * @return
	 */
	public List<Map> selectAgent(Map parmeterMap);
	/**
	 * 修改代理商信息
	 * @param parameterMap
	 * @return
	 */
	public int updateAgent(Map parameterMap);
	
	/**
	 * 删除代理商
	 * @param parameterMap
	 * @return
	 */
	public int deleteAgent(Map parameterMap);
	
	/**
	 * 新增代理商
	 * @param parameterMap
	 * @return
	 */
	public int insertAgent(Map parameterMap);
	
	/**
	 * 查询代理商分页
	 * @param parameterMap
	 * @param rowLimit
	 * @return
	 */
	public List<Map> selectAgentPage(Map parameterMap,RowLimit rowLimit);
	
	/**
	 * 查询代理商不分页
	 * @param parameterMap
	 * @param rowLimit
	 * @return
	 */
	public List<Map> selectAgentPage(Map parameterMap);
	
	/**
	 * 通过客户表的代理商关联字段查询对应的客户记录
	 * @param parameterMap
	 * @param rowLimit
	 * @return
	 */
	public List<Map> selecCusByAgentID(Map parameterMap);
	
	/**
	 * 查询设备信息资源树
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectBranchTree(Map parameterMap);
	
	/**
	 * 区域信息资源树
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectAddressTree(Map parameterMap);
	
	/**
	 * 新增设备
	 * @param parameterMap
	 * @return
	 */
	public int insertDev(Map parameterMap);
	
	/**
	 * 修改设备信息
	 * @param parameterMap
	 * @return
	 */
	public int updateDev(Map parameterMap);
	
	/**
	 * 删除设备信息
	 * @param parameterMap
	 * @return
	 */
	public int deleteDev(Map parameterMap);
	
	/**
	 * 查询一条设备信息
	 * @param parmeterMap
	 * @return
	 */
	public List<Map> selectDevDetail(Map parmeterMap);
	
	/**
	 * 根据网点编号查设备记录行数
	 * @param parmeterMap
	 * @return
	 */
	public List<Map> selectDevCountByid(Map parmeterMap);
	
	/**
	 * 查询设备信息分页
	 * @param parameterMap
	 * @param rowLimit
	 * @return
	 */
	public List<Map> selectDevPage(Map parameterMap,RowLimit rowLimit);
	
	public List<Map> selectAllDev(Map parameterMap);
	
	/**
	 * 通过ID查询网点名称
	 * @param 
	 * @return
	 */
	public List<Map> selectCusNameById(Map parameterMap);
	
	
	/**
	 * 查询设备类型信息列表
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectDecice_type(Map parameterMap);
	/**
	 * 查询设备型号信息列表
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectDecice_model(Map parameterMap);
	/**
	 * 查询设备安装类型信息列表
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectSetup_type(Map parameterMap);
	/**
	 * 查询设备质保期信息列表
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectExp_time(Map parameterMap);

	/**
	 * 新增工单信息
	 * @param parameterMap
	 * @return
	 */
	public int insertAppWork(Map parameterMap);

    /**
     * 更新工作流
     * @param parameterMap
     * @return
     */

    public int updateAppwork(Map parameterMap);

    /**
     * 根据当前用户查询用户信息
     * @param parameterMap
     * @return
     */
    public List<Map> QueryUserInfo(Map parameterMap);


    /**
     * 查询相关设备信息
     * @param parameterMap
     * @return
     */
    public List<Map> QueryDevInfo(Map parameterMap);

    /**
     * 查询可审批者
     * @param parameterMap
     * @return
     */
    public List<Map> QueryApprover(Map parameterMap);

	/**
	 * 查询相关客户信息
	 * @param parameterMap
	 * @return
	 */
	public List<Map> QueryCusInfo(Map parameterMap,RowLimit rowLimit);
	
	/**
	 * 查询所有客户信息，把相关信息置顶
	 * @param parameterMap
	 * @return
	 */
	public List<Map> QueryALLCusInfo(Map parameterMap,RowLimit rowLimit);

    /**
     * 查询工单详细信息
     * @param parameterMap
     * @return
     */
    public List<Map> QueryWorksInfo(Map parameterMap,RowLimit rowLimit);

 

    /**
	 * 工单信息查询
	 * @param workapp_idlist
	 * @param rowLimit selectWorkOrder QueryUserInfo
	 * @return
	 */
	public List<Map> selectWorkOrder(Map<String, Object> map, RowLimit rowLimit);
	/**
	 * 所有工单查询
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectAllWork(Map parameterMap,RowLimit rowLimit);
	/**
	 * 某一个工单详情查询
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectOneWorkDeail(Map parameterMap);
	/**
	 * 工单审批
	 * @param parameterMap
	 * @return
	 */
	public Object updateAssignment(Map parameterMap);
	
	/**
	 * 工单审验
	 * @param parameterMap
	 * @return
	 */
	public Object updateVerify(Map parameterMap);
	/**
	 * 工单审验驳回
	 * @param parameterMap
	 * @return
	 */
	public Object updateNotVerify(Map parameterMap);
	

	/**
	 * 工单处理
	 * @param parameterMap
	 * @return
	 */
	public Object updateWorkDeal(Map parameterMap);
	

	/**
	 * 工单处理中
	 * @param parameterMap
	 * @return
	 */
	public Object updateWorkDeal_in(Map parameterMap);
	
	/**
	 * 填写工单处理意见
	 * @param parameterMap
	 * @return
	 */
	public int intMessage_deal(Map parameterMap);
	/**
	 * 添加工单处理信息时的文件信息
	 * @param parameterMap
	 * @return
	 */
	public int insert_Accessory(Map parameterMap);


	/**
	 *
	 * @param parameterMap
	 * @return
	 */
	public List<Map> QueryWorkappInfo(Map parameterMap);

    /**
     * 更新工单信息
     * @param parameterMap
     * @return
     */
    public int updateworks(Map parameterMap);
    
    /**
	 * 查询可分派人员信息
	 * @param parameterMap
	 * @return
	 */
	public List<Map> selectDelWorker(Map parameterMap,RowLimit rowLimit);


	 /**
     * 查询可审验者
     * @param parameterMap
     * @return
     */
    public List<Map> QueryVerify(Map parameterMap);


	/**
	 *
	 * @param parameterMap
	 * @return
	 */
	public List<Map> QueryAccessoryInfo(Map parameterMap);


    /**
     * 查询工单类型信息列表
     * @param parameterMap
     * @return
     */
    public List<Map> selectworks_type(Map parameterMap);

    /**
     * 查询工单紧急程度信息列表
     * @param parameterMap
     * @return
     */
    public List<Map> selectworks_urgent(Map parameterMap);
    
    /**
     * 查询工单状态信息列表
     * @param parameterMap
     * @return
     */
    public List<Map> selectworks_status(Map parameterMap);

      /**
     * 查询验收类型信息列表
     * @param parameterMap
     * @return
     */
    public List<Map> selectworks_accepttype(Map parameterMap);


    /**
     * 删除相关附件信息
     * @param parameterMap
     * @return
     */
    public int deleteAccessory(Map parameterMap);
    
    
    
    /**
     * 查询收件方邮件地址
     * @param parameterMap
     * @return
     */
    public List<Map> selectMailPath(Map parameterMap);
    
    
    /**
     * 查询所有用户信息
     * @param
     * @return
     */
    public List<Map> selectAllUserInfo(Map parameterMap);
    
    /**
     * 查询所有工单信息
     * @param
     * @return
     */
    public List<Map> selectAllWorkInfo(Map parameterMap);
    
    /**
     * 查询工单历史记录详细情况
     * @param
     * @return
     */
    public List<Map> selectWorkHistoryDetails(Map parameterMap);
    
    /**
     * 查询故障类型信息列表
     * @param parameterMap
     * @return
     */
    public List<Map> selectFaultType(Map parameterMap);
    
    
    /**
     * 查询故障原因信息列表
     * @param parameterMap
     * @return
     */
    public List<Map> selectFaultReason(Map parameterMap);

    /**
     * 查询验收类型息列表
     * @param parameterMap
     * @return
     */
    public List<Map> selectACCEPT(Map parameterMap);
   
    /**
     * 查询设备信息
     * @param parameterMap
     * @return
     */
    public List<Map> selectDevice(Map parameterMap);
    
    
    /**
     * 通过网点id查询网点name 
     * @param parameterMap
     * @return
     */
    public List<Map> selectBranchPath(Map parameterMap);

    /**
     * 获取过保邮件接收人邮箱
     * @param parameterMap
     * @return
     */
	public List<Map> selectOverInsuranceMail(Map<String, String> parame_ID);
	
	/**
     * 获取邮件内容
     * @param parameterMap
     * @return
     */
	public List<Map> mailContent(Map<String, String> parameterMap);
    
}
