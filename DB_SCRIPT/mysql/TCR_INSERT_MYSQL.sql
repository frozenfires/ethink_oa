
-- 初始化管理员数据
Insert into BASE_USER
   (USER_ID, USER_NAME, ORG_ID, TELEPHONE, MOBILEPHONE, 
    EMAIL, PASSWORD, LAST_LOGIN_DATE, STATUS, ACCOUNT_ID, 
    ROLE_ID, ORG_ADMIN)
 Values
   ('admin', 'admin', '1001', '13255556666', '029-33336666', 
    '424413', '21232f297a57a5a743894a0e4a801fc3', NULL, NULL, '002', 
    'admin', '1');


Insert into BASE_ROLE
   (ROLE_ID, ROLE_NAME, ROLE_DESC)
 Values
   ('admin', '管理员', '管理员');

insert into BASE_ORG(ORG_ID,ORG_NAME) VALUES('1001','默认机构');


-- 初始化角色资源
insert into BASE_ROLE_RESOURCE (ROLE_ID, MODULE_ID) values ('admin', 'F004');
insert into BASE_ROLE_RESOURCE (ROLE_ID, MODULE_ID) values ('admin', 'F009');
insert into BASE_ROLE_RESOURCE (ROLE_ID, MODULE_ID) values ('admin', 'C007');
insert into BASE_ROLE_RESOURCE (ROLE_ID, MODULE_ID) values ('admin', 'F013');
insert into BASE_ROLE_RESOURCE (ROLE_ID, MODULE_ID) values ('admin', 'assist_function');
insert into BASE_ROLE_RESOURCE (ROLE_ID, MODULE_ID) values ('admin', 'F001');
insert into BASE_ROLE_RESOURCE (ROLE_ID, MODULE_ID) values ('admin', 'F010');
insert into BASE_ROLE_RESOURCE (ROLE_ID, MODULE_ID) values ('admin', 'F006');
insert into BASE_ROLE_RESOURCE (ROLE_ID, MODULE_ID) values ('admin', 'F011');
insert into BASE_ROLE_RESOURCE (ROLE_ID, MODULE_ID) values ('admin', 'C001');
insert into BASE_ROLE_RESOURCE (ROLE_ID, MODULE_ID) values ('admin', 'base_manager');
insert into BASE_ROLE_RESOURCE (ROLE_ID, MODULE_ID) values ('admin', 'F008');

-- BASE_RESOURCE数据
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('F012', '密码修改', 'base_manager', null, 'hide', null, '/views/F012/F012.html', null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('F013', '密码重置', 'base_manager', null, '1', null, '/views/F013/F013.html', null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('system', '系统管理', 'ROOT', 17, 'hide', 1, null, null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('compelReturn', '强制签退', 'system', null, 'hide', 2, null, null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('C008_Tcr', '暂存交易处理-机器出钞', null, null, 'hide', null, null, null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('T1002', '取款', 'cash_deal', null, '1', null, '/views/1002/1002.html', 'device', null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('F001', '用户管理', 'base_manager', null, '1', null, '/views/F001/F001.html', null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('F002', '资源管理', 'base_manager', null, '0', null, '/views/F002/F002.html', null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('F005', '设备类型管理', 'base_manager', null, '0', null, '/views/F005/F005.html', null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('F006', '设备管理', 'base_manager', null, '1', null, '/views/F006/F006.html', null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('F004', '角色管理', 'base_manager', null, '1', null, '/views/F004/F004.html', null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('Exception', '出钞不足', null, null, 'hide', null, '/views/Exception/Exception.html', 'device', null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('F008', '机构管理', 'base_manager', null, '1', null, '/views/F008/F008.html', null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('Reset_out', '取款类交易确认', null, null, 'hide', null, '/views/C002/Reset_out.html', 'device', null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('Reset_in', '存款类交易确认', null, null, 'hide', null, '/views/C002/Reset_in.html', 'device', null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('F003', '设备品牌管理', 'base_manager', null, '0', null, '/views/F003/F003.html', null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('cash_deal', '现金交易', null, 3, '1', 1, null, null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('cash_manager', '现金管理', null, 5, '1', 1, null, null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('cash_allocate', '现金调拨', null, 9, '1', 1, null, null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('assist_function', '辅助功能', null, 15, '1', 1, null, null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('base_manager', '自有功能', null, 25, '1', 1, null, null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('T1004', '存款', 'cash_deal', null, '1', null, '/views/1004/1004.html', 'device', null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('T1004_1', '缓存存款', 'cash_deal', null, '1', null, '/views/1004_1/1004_1.html', 'device', null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('T1006_1', '自动加钞', 'cash_manager', null, '1', null, '/views/1006_1/1006_1.html', 'device', null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('T1006_2', '人工加卸钞', 'cash_manager', null, '1', null, '/views/1006_2/1006_2.html', 'device', null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('T1007_1', '自动卸钞', 'cash_manager', null, '1', null, '/views/1007_1/1007_1.html', 'device', null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('T1008', '故障钞币处理', 'assist_function', null, '1', null, '/views/1008/1008.html', 'device', null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('C001', '冠字号查询', 'assist_function', null, '1', null, '/views/C001/C001.html', null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('C002', '故障清除', 'assist_function', null, '1', null, '/views/C002/C002.html', null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('C003', '设备余额', 'assist_function', null, 'hide', null, '/views/C003/C003.html', 'device', null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('C004', '自动点钞', 'assist_function', null, '1', null, '/views/C004/C004.html', 'device', null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('C005', '自动清分', 'assist_function', null, '1', null, '/views/C005/C005.html', 'device', null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('C007', '流水查询', 'assist_function', null, '1', null, '/views/C007/C007.html', null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('C008', '暂存交易处理', 'assist_function', null, '1', null, '/views/C008/C008.html', null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('C008_OUT', '暂存交易处理', null, null, 'hide', null, '/views/C008_OUT/C008_OUT.html', 'device', null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('Cash_Exchange', '现金兑换', 'assist_function', null, '1', null, '/views/Cash_Exchange/Cash_Exchange.html', 'device', null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('BoxToDevice', '现金调拨至设备', 'cash_allocate', null, '1', null, '/views/Cash_Transfers/BoxToDevice.html', 'device', null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('DeviceToBox', '现金调拨至尾箱', 'cash_allocate', null, '1', null, '/views/Cash_Transfers/DeviceToBox.html', 'device', null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('CashPay', '现金缴费', null, null, '0', null, '/views/CashPay/CashPay.html', 'device', null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('OtherPay', '其它面额代付', null, null, 'hide', null, '/views/OtherPay/OtherPay.html', 'device', null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('SpecialPay', '手工支付', null, null, 'hide', null, '/views/SpecialPay/SpecialPay.html', null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('F010', '长短款处理', 'base_manager', null, '0', null, '/views/F010/F010.html', null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('F011', '现金账户余额查询', 'base_manager', null, '0', null, '/views/F011/F011.html', null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('CashExchangeOut', '现金兑出', null, null, 'hide', null, null, null, null);
insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('Cash_ExchangeIn', '现金兑入', null, null, 'hide', null, null, null, null);

-- 以下资源普通银行不需要
-- insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('cashouttes', '性能测试取款', 'base_manager', null, '0', null, '/views/TEST/cashout.html', null, null);
-- insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('I001', '柜面直接存款', null, null, 'hide', null, null, 'device', null);
-- insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('I002', '柜面缓存存款', null, null, 'hide', null, null, null, null);
-- insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('I003', '柜面存款找零', null, null, 'hide', null, null, 'device', null);
-- insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('I004', '柜面取款', null, null, 'hide', null, null, 'device', null);
-- insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('demo', 'demo', null, null, 'hide', null, '/views/demo/demo.html', null, null);
-- insert into BASE_RESOURCE (MODULE_ID, MODULE_NAME, PARENT_MODULE_ID, MODULE_ORDER, MODULE_STATUS, MODULE_LEVEL, MODULE_URL, MODULE_AUTH, UPDATE_DATE) values ('F009', '数据同步', 'base_manager', null, '1', null, '/views/F009/F009.html', null, null);

-- 设备品牌等初始化参数
-- 所在区域
insert into BASE_DEVICE_AREA (AREA_ID, AREA_NAME) values ('000', '西安市高新区');
-- 设备品牌
insert into BASE_DEVICE_BRAND (BRAND_ID, BRAND_NAME, ENG_NAME, TELEPHONE, MOBILEPHONE, EMAIL, CONTRACT_NO, CONTACTS, UPDATE_TIME) values ('glory', '光荣', '3', '029-xxxxxxxx', '138xxxxxxxx', 'g@xxx.com', null, '3', TIMESTAMP '2014-06-23 14:08:13');
-- 安置点类型
insert into BASE_DEVICE_FIX_TYPE (FIX_TYPE, FIX_NAME, START_TIME, END_TIME) values ('000', '网点', null, null);
-- 型号
insert into BASE_DEVICE_MODEL (DEVICE_BRAND, DEVICE_TYPE, DEVICE_MODEL) values ('glory', '000', 'RBG100');
-- 服务商
insert into BASE_DEVICE_PROVIDER (PROVIDER_ID, PROVIDER_NAME, CONTACTS, TELEPHONE, MOBILEPHONE, EMAIL, CONTRACT_NO) values ('ethink', '银信博荣', null, null, null, null, null);
-- 设备类型
insert into BASE_DEVICE_TYPE (TYPE_ID, TYPE_NAME, UPDATE_DATE) values ('tcr', '现金循环机', TIMESTAMP '2014-06-23 14:08:44');

COMMIT;