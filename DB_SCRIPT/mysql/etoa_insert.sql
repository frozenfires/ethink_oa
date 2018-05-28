
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


insert  into `oa_worksurgent`(`ID`,`WORK_URGENT`,`REMARK`) values (1,'紧急',NULL),(2,'重大',NULL),(3,'一般',NULL);
insert  into `oa_workstype`(`ID`,`WORK_TYPE`,`REMARK`) values (1,'勘察',NULL),(2,'安装',NULL),(3,'验收',NULL),(4,'培训',NULL),(5,'维修',NULL),(6,'巡检',NULL),(7,'移机',NULL),(8,'撤机',NULL);
insert  into `oa_worksaccepttype`(`ID`,`ACCEPT_TYPE`,`REMARK`) values (1,'全部验收',NULL),(2,'功能验收',NULL),(3,'硬件验收',NULL);
insert  into `oa_setup_type`(`ID`,`SETUP_TYPE_NAME`,`REMARK`) values (1,'在行大堂',NULL),(2,'在行穿墙',''),(3,'离行穿墙',NULL);
insert  into `oa_exp_time`(`ID`,`OA_EXP_TIME_NAME`,`REMARK`) values (1,'一年',NULL),(2,'两年',NULL),(3,'三年',NULL),(4,'四年',NULL);
insert  into `oa_accept_type`(`ID`,`ACCEPT_TYPE_VAL`) values ('1','硬件验收'),('2','功能验收'),('3','全部验收');
insert  into `oa_address`(`ADDRESS_ID`,`ADDRESS_NAME`,`ADDRESS_UPNAME`,`ADDRESS_UPID`,`REMARK1`,`REMARK2`) values (15,'总公司','无','',NULL,NULL),(21,'服务部','总公司','15',NULL,NULL);
insert  into `oa_device_model`(`ID`,`DEVICE_MODEL_NAME`,`REMARK`) values (1,'stm-200',NULL),(2,'stm-220',NULL),(3,'stm-100',NULL),(4,'stm-210',NULL),(5,'ETH-1000',NULL),(6,'B-400',NULL),(7,'STM-400',NULL),(8,'ETH-2000',NULL),(9,'其他',NULL);
insert  into `oa_device_type`(`ID`,`DEVICE_TYPE_NAME`,`REMARK`) values (1,'分体式',NULL),(2,'一体式',NULL),(3,'桌面式',NULL);
insert  into `oa_fault_reason`(`ID`,`CHINESE`) values ('1','设备卡钞'),('2','设备长款'),('3','设备短款'),('4','连接异常'),('5','无法复位'),('6','硬件磨损'),('7','操作违规'),('8','其他原因');
insert  into `oa_fault_type`(`ID`,`CHINESE`) values ('1','硬件故障'),('2','软件异常'),('3','核心异常'),('4','网络异常'),('5','账务异常'),('6','人为故障'),('7','其他故障');
insert  into `oa_workstatus`(`ID`,`WORK_STATUS`,`REMARK`) values (2,'待审批',NULL),(3,'已驳回',NULL),(4,'已否决',NULL),(5,'已挂起',NULL),(6,'待处理',NULL),(7,'处理中',NULL),(8,'完成待审验',NULL),(10,'已结束',NULL);



-- BASE_RESOURCE数据

insert  into `base_resource`(`MODULE_ID`,`MODULE_NAME`,`PARENT_MODULE_ID`,`MODULE_ORDER`,`MODULE_STATUS`,`MODULE_LEVEL`,`MODULE_URL`,`MODULE_AUTH`,`UPDATE_DATE`,`IS_USE_TIME`) values 
		('agent','代理商管理','base_manager',NULL,'1',NULL,'/oa/agent/AgentInfo.html',NULL,NULL,NULL),
		('app_deal','工单处理','app_manager',NULL,'1',NULL,'/oa/appWork_deal/appWork_deal.html',NULL,NULL,NULL),
		('app_deal2','工单处理','app_manager',NULL,'hide',NULL,'/oa/appWork_deal/appWork_detail.html',NULL,NULL,NULL),
		('app_manager','工单管理',NULL,25,'1',1,NULL,NULL,NULL,NULL),
		('assignment','工单审批','app_manager',NULL,'1',NULL,'/oa/assignment/assignment.html',NULL,NULL,NULL),
		('base_manager','自有功能',NULL,25,'1',1,NULL,NULL,NULL,NULL),
		('dev','设备管理','base_manager',NULL,'1',NULL,'/oa/dev/DevInfo.html',NULL,NULL,NULL),
		('F001','用户管理','base_manager',NULL,'1',NULL,'/platform/F001/F001.html',NULL,NULL,NULL),
		('F002','资源管理','base_manager',NULL,'0',NULL,'/platform/F002/F002.html',NULL,NULL,NULL),
		('F003','设备品牌管理','base_manager',NULL,'0',NULL,'/platform/F003/F003.html',NULL,NULL,NULL),
		('F004','角色管理','base_manager',NULL,'1',NULL,'/platform/F004/F004.html',NULL,NULL,NULL),
		('F005','设备类型管理','base_manager',NULL,'0',NULL,'/platform/F005/F005.html',NULL,NULL,NULL),
		('F010','长短款处理','base_manager',NULL,'0',NULL,'/platform/F010/F010.html',NULL,NULL,NULL),
		('F011','现金账户余额查询','base_manager',NULL,'0',NULL,'/platform/F011/F011.html',NULL,NULL,NULL),
		('F0111','客户信息管理','base_manager',NULL,'1',NULL,'/oa/F0111/F0111.html',NULL,NULL,NULL),
		('F012','密码修改','base_manager',NULL,'1',NULL,'/platform/F012/F012.html',NULL,NULL,NULL),
		('F013','密码重置','base_manager',NULL,'1',NULL,'/platform/F013/F013.html',NULL,NULL,NULL),
		('F020','区域管理','base_manager',NULL,'1',NULL,'/oa/address/addressinfo.html',NULL,NULL,NULL),
		('queryAllWork','工单查询','app_manager',NULL,'1',NULL,'/oa/queryAllWork/queryAllworks.html',NULL,NULL,NULL),
		('queryworks','工单申请','app_manager',NULL,'1',NULL,'/oa/queryworks/queryworks.html',NULL,NULL,NULL),
		('system','系统管理','ROOT',17,'hide',1,NULL,NULL,NULL,NULL),
		('verify','工单审验','app_manager',NULL,'1',NULL,'/oa/verify/verifyinfo.html',NULL,NULL,NULL);

COMMIT;