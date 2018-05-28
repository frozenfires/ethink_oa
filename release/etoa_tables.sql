USE `etoa`;

/*Table structure for table `base_badaccount_book` */

DROP TABLE IF EXISTS `base_badaccount_book`;

CREATE TABLE `base_badaccount_book` (
  `TRANLOG_ID` varchar(30) DEFAULT NULL,
  `TYPE` int(11) DEFAULT NULL,
  `DEVICE_ID` varchar(10) DEFAULT NULL,
  `FINISH_TIME` datetime DEFAULT NULL,
  `ORG_ID` varchar(30) DEFAULT NULL,
  `ERROR_USER_ID` varchar(15) DEFAULT NULL,
  `DISPOSE_USER_ID` varchar(15) DEFAULT NULL,
  `CCY` varchar(20) DEFAULT NULL,
  `AMT` varchar(50) DEFAULT NULL,
  `BADACCOUNT_DESC` varchar(200) DEFAULT NULL,
  `ACCOUNT_ID` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `base_cash_account` */

DROP TABLE IF EXISTS `base_cash_account`;

CREATE TABLE `base_cash_account` (
  `ACCOUNT_ID` varchar(25) NOT NULL,
  `ACCOUNT_DESC` varchar(100) DEFAULT NULL,
  `DEVICE_ID` varchar(10) DEFAULT NULL,
  `TELLER_BOX` varchar(1) DEFAULT NULL,
  `DEVICE_BALANCE` varchar(15) DEFAULT '0',
  `BOX_BALANCE` varchar(15) DEFAULT '0',
  `USER_ID` varchar(15) DEFAULT NULL,
  `ORGID` varchar(15) DEFAULT NULL,
  `TERMINAL_IP` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`ACCOUNT_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `base_device_area` */

DROP TABLE IF EXISTS `base_device_area`;

CREATE TABLE `base_device_area` (
  `AREA_ID` varchar(10) DEFAULT NULL,
  `AREA_NAME` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `base_device_brand` */

DROP TABLE IF EXISTS `base_device_brand`;

CREATE TABLE `base_device_brand` (
  `BRAND_ID` varchar(10) NOT NULL,
  `BRAND_NAME` varchar(30) DEFAULT NULL,
  `ENG_NAME` varchar(30) DEFAULT NULL,
  `TELEPHONE` varchar(15) DEFAULT NULL,
  `MOBILEPHONE` varchar(15) DEFAULT NULL,
  `EMAIL` varchar(40) DEFAULT NULL,
  `CONTRACT_NO` varchar(40) DEFAULT NULL,
  `CONTACTS` varchar(15) DEFAULT NULL,
  `UPDATE_TIME` datetime DEFAULT NULL,
  PRIMARY KEY (`BRAND_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `base_device_fix_type` */

DROP TABLE IF EXISTS `base_device_fix_type`;

CREATE TABLE `base_device_fix_type` (
  `FIX_TYPE` varchar(10) DEFAULT NULL,
  `FIX_NAME` varchar(30) DEFAULT NULL,
  `START_TIME` datetime DEFAULT NULL,
  `END_TIME` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `base_device_info` */

DROP TABLE IF EXISTS `base_device_info`;

CREATE TABLE `base_device_info` (
  `DEVICE_ID` varchar(10) NOT NULL,
  `DEVICE_NAME` varchar(30) DEFAULT NULL,
  `DEVICE_IP` varchar(20) DEFAULT NULL,
  `DEVICE_ADMIN` varchar(15) DEFAULT NULL,
  `DEVICE_AREA_ID` varchar(10) DEFAULT NULL,
  `FIX_TYPE` varchar(10) DEFAULT NULL,
  `BRAND_ID` varchar(10) DEFAULT NULL,
  `DEVICE_TYPE` varchar(10) DEFAULT NULL,
  `DEVICE_MODEL_ID` varchar(10) DEFAULT NULL,
  `DEVICE_PROVIDER_ID` varchar(10) DEFAULT NULL,
  `DEVICE_STATUS` varchar(1) DEFAULT NULL,
  `DEVICE_ADDRESS` varchar(50) DEFAULT NULL,
  `COMMENTS` varchar(100) DEFAULT NULL,
  `DEVICE_BALANCE` varchar(15) DEFAULT NULL,
  `TERMINAL_IP` varchar(20) DEFAULT NULL,
  `TERMINAL_IP2` varchar(20) DEFAULT NULL,
  `ORG_ID` varchar(15) DEFAULT NULL,
  `UPDATE_DATE` datetime DEFAULT NULL,
  PRIMARY KEY (`DEVICE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `base_device_model` */

DROP TABLE IF EXISTS `base_device_model`;

CREATE TABLE `base_device_model` (
  `DEVICE_BRAND` varchar(15) DEFAULT NULL,
  `DEVICE_TYPE` varchar(10) DEFAULT NULL,
  `DEVICE_MODEL` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `base_device_provider` */

DROP TABLE IF EXISTS `base_device_provider`;

CREATE TABLE `base_device_provider` (
  `PROVIDER_ID` varchar(15) DEFAULT NULL,
  `PROVIDER_NAME` varchar(30) DEFAULT NULL,
  `CONTACTS` varchar(15) DEFAULT NULL,
  `TELEPHONE` varchar(15) DEFAULT NULL,
  `MOBILEPHONE` varchar(15) DEFAULT NULL,
  `EMAIL` varchar(40) DEFAULT NULL,
  `CONTRACT_NO` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `base_device_type` */

DROP TABLE IF EXISTS `base_device_type`;

CREATE TABLE `base_device_type` (
  `TYPE_ID` varchar(10) NOT NULL,
  `TYPE_NAME` varchar(30) DEFAULT NULL,
  `UPDATE_DATE` datetime DEFAULT NULL,
  PRIMARY KEY (`TYPE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `base_org` */

DROP TABLE IF EXISTS `base_org`;

CREATE TABLE `base_org` (
  `ORG_ID` varchar(30) NOT NULL,
  `ORG_NAME` varchar(100) DEFAULT NULL,
  `ORG_STATUS` varchar(1) DEFAULT NULL,
  `ORG_TYPE` varchar(20) DEFAULT NULL,
  `PARENT_ORG_ID` varchar(30) DEFAULT NULL,
  `ORG_ADDRESS` varchar(100) DEFAULT NULL,
  `ORG_PHONE` varchar(15) DEFAULT NULL,
  `ORG_CONTACTS` varchar(20) DEFAULT NULL,
  `UPDATE_DATE` datetime DEFAULT NULL,
  PRIMARY KEY (`ORG_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `base_resource` */

DROP TABLE IF EXISTS `base_resource`;

CREATE TABLE `base_resource` (
  `MODULE_ID` varchar(20) NOT NULL,
  `MODULE_NAME` varchar(30) DEFAULT NULL,
  `PARENT_MODULE_ID` varchar(20) DEFAULT NULL,
  `MODULE_ORDER` int(11) DEFAULT NULL,
  `MODULE_STATUS` varchar(10) DEFAULT NULL,
  `MODULE_LEVEL` int(11) DEFAULT NULL,
  `MODULE_URL` varchar(100) DEFAULT NULL,
  `MODULE_AUTH` varchar(50) DEFAULT NULL,
  `UPDATE_DATE` datetime DEFAULT NULL,
  `IS_USE_TIME` varchar(1) DEFAULT NULL,
  PRIMARY KEY (`MODULE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `base_role` */

DROP TABLE IF EXISTS `base_role`;

CREATE TABLE `base_role` (
  `ROLE_ID` varchar(15) NOT NULL,
  `ROLE_NAME` varchar(30) DEFAULT NULL,
  `ROLE_DESC` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ROLE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `base_role_resource` */

DROP TABLE IF EXISTS `base_role_resource`;

CREATE TABLE `base_role_resource` (
  `ROLE_ID` varchar(15) DEFAULT NULL,
  `MODULE_ID` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `base_role_user` */

DROP TABLE IF EXISTS `base_role_user`;

CREATE TABLE `base_role_user` (
  `ROLE_ID` varchar(15) DEFAULT NULL,
  `USER_ID` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `base_seqno` */

DROP TABLE IF EXISTS `base_seqno`;

CREATE TABLE `base_seqno` (
  `SEQNO_DATE` varchar(10) NOT NULL DEFAULT '',
  `SEQNO` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`SEQNO_DATE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `base_system_use_time` */

DROP TABLE IF EXISTS `base_system_use_time`;

CREATE TABLE `base_system_use_time` (
  `ID` varchar(32) NOT NULL DEFAULT '',
  `ORG_ID` varchar(10) DEFAULT NULL,
  `DEVICE_NUM` varchar(10) DEFAULT NULL,
  `USE_TIME` varchar(20) DEFAULT NULL,
  `TIME_QUANTUM` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `base_user` */

DROP TABLE IF EXISTS `base_user`;

CREATE TABLE `base_user` (
  `USER_ID` varchar(15) NOT NULL COMMENT '用户ID登录名',
  `USER_NAME` varchar(20) DEFAULT NULL COMMENT '用户姓名',
  `MOBILEPHONE` varchar(15) DEFAULT NULL COMMENT '手机号码',
  `EMAIL` varchar(30) DEFAULT NULL COMMENT '电子邮件地址',
  `PASSWORD` varchar(35) DEFAULT NULL COMMENT '登录密码',
  `LAST_LOGIN_DATE` datetime DEFAULT NULL,
  `ROLE_ID` varchar(30) DEFAULT NULL COMMENT '角色',
  `UPDATE_TIME` datetime DEFAULT NULL,
  `FREEZE_USER` varchar(5) DEFAULT NULL COMMENT '是否',
  `ADDRESS_ID` int(4) DEFAULT NULL COMMENT '所属区域ID',
  `org_id` varchar(10) DEFAULT NULL,
  `account_id` varchar(10) DEFAULT NULL,
  `org_admin` varchar(10) DEFAULT NULL,
  `nation` varchar(10) DEFAULT NULL COMMENT '民族',
  `sex` varchar(10) DEFAULT NULL COMMENT '性别',
  `marriaged` varchar(10) DEFAULT NULL COMMENT '婚姻状况',
  `politics` varchar(10) DEFAULT NULL COMMENT '政治面貌',
  `education` varchar(10) DEFAULT NULL COMMENT '学历',
  `driver` varchar(10) DEFAULT NULL COMMENT '驾驶证类型',
  `birthday` datetime DEFAULT NULL COMMENT '生日',
  `school` varchar(10) DEFAULT NULL COMMENT '毕业院校',
  `major` varchar(10) DEFAULT NULL COMMENT '专业',
  `worktime` datetime DEFAULT NULL COMMENT '参加工作时间',
  `address` varchar(50) DEFAULT NULL COMMENT '家庭住址',
  `contractnum` varchar(30) DEFAULT NULL COMMENT '合同编号',
  `aptitude` varchar(20) DEFAULT NULL COMMENT '资质',
  `homephone` varchar(20) DEFAULT NULL COMMENT '家庭电话',
  `officephone` varchar(20) DEFAULT NULL COMMENT '办公电话',
  `urgentphone` varchar(20) DEFAULT NULL COMMENT '紧急电话',
  `idnumber` varchar(20) DEFAULT NULL COMMENT '身份证号码',
  `jointime` datetime DEFAULT NULL COMMENT '加入公司时间',
  `telephone` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`USER_ID`),
  KEY `fk_useraddr` (`ADDRESS_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `base_userhandover_log` */

DROP TABLE IF EXISTS `base_userhandover_log`;

CREATE TABLE `base_userhandover_log` (
  `ID` varchar(32) NOT NULL,
  `ORG_ID` varchar(10) DEFAULT NULL,
  `DEVICE_ID` varchar(10) DEFAULT NULL,
  `CURRENTUSER` varchar(15) DEFAULT NULL,
  `CURRENTDATE` datetime DEFAULT NULL,
  `DEVICE_AMT` varchar(10) DEFAULT NULL,
  `TAILBOX_AMT` varchar(10) DEFAULT NULL,
  `RECEIVE_USER` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `oa_accept_type` */

DROP TABLE IF EXISTS `oa_accept_type`;

CREATE TABLE `oa_accept_type` (
  `ID` varchar(10) NOT NULL,
  `ACCEPT_TYPE_VAL` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `oa_accessory` */

DROP TABLE IF EXISTS `oa_accessory`;

CREATE TABLE `oa_accessory` (
  `ACCESSORY_ID` varchar(60) NOT NULL,
  `COMMON_ID` varchar(60) DEFAULT NULL,
  `ACCESSORY_TYPE` varchar(10) DEFAULT NULL,
  `ACCESSORY_SIZE` varchar(10) DEFAULT NULL,
  `ACCESSORY_NAME` varchar(100) DEFAULT NULL,
  `ACCESSORY_LOC` varchar(100) DEFAULT NULL,
  `UPLOAD_TIME` datetime DEFAULT NULL,
  `REMARK1` varchar(30) DEFAULT NULL,
  `REMARK2` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`ACCESSORY_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `oa_address` */

DROP TABLE IF EXISTS `oa_address`;

CREATE TABLE `oa_address` (
  `ADDRESS_ID` int(4) NOT NULL AUTO_INCREMENT,
  `ADDRESS_NAME` varchar(10) DEFAULT NULL,
  `ADDRESS_UPNAME` varchar(10) DEFAULT NULL,
  `ADDRESS_UPID` varchar(20) DEFAULT NULL,
  `REMARK1` varchar(30) DEFAULT NULL,
  `REMARK2` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`ADDRESS_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8;

/*Table structure for table `oa_agent` */

DROP TABLE IF EXISTS `oa_agent`;

CREATE TABLE `oa_agent` (
  `AGENT_ID` varchar(10) NOT NULL,
  `AGENT_NAME` varchar(255) DEFAULT NULL,
  `AGENT_ADDRESS` varchar(255) DEFAULT NULL,
  `LINKMAN` varchar(10) DEFAULT NULL,
  `EMAIL` varchar(20) DEFAULT NULL,
  `TEL` varchar(20) DEFAULT NULL,
  `REMARK1` varchar(30) DEFAULT NULL,
  `REMARK2` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`AGENT_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `oa_customer_info` */

DROP TABLE IF EXISTS `oa_customer_info`;

CREATE TABLE `oa_customer_info` (
  `CUSTOMER_TYPE` varchar(30) DEFAULT NULL COMMENT '签售类别',
  `ORG_ID_P` varchar(30) NOT NULL COMMENT '网点编号',
  `ORG_NAME` varchar(100) NOT NULL COMMENT '网点名称',
  `ORG_TYPE` varchar(20) DEFAULT NULL COMMENT '机构级别',
  `PARENT_ORG_ID` varchar(30) DEFAULT NULL COMMENT '上级机构编号',
  `ORG_ADDRESS` varchar(100) DEFAULT NULL COMMENT '网点地址',
  `ORG_PHONE` varchar(15) DEFAULT NULL COMMENT '网点电话',
  `UPDATE_DATE` datetime DEFAULT NULL COMMENT '信息修改时间',
  `AREA_ID` varchar(30) DEFAULT NULL COMMENT '区域编号',
  `LINKMAN` varchar(30) DEFAULT NULL COMMENT '联系人',
  `EMAIL` varchar(30) DEFAULT '' COMMENT '邮箱号码',
  `REMARK1` varchar(30) DEFAULT NULL COMMENT '备注一',
  `REMARK2` varchar(30) DEFAULT NULL COMMENT '备注2',
  `AGENT_ID` varchar(30) DEFAULT NULL COMMENT '代理商编号',
  PRIMARY KEY (`ORG_ID_P`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `oa_device` */

DROP TABLE IF EXISTS `oa_device`;

CREATE TABLE `oa_device` (
  `ID` varchar(100) NOT NULL,
  `DEVICE_ID` varchar(20) DEFAULT NULL,
  `DEVICE_TYPE` varchar(2) DEFAULT NULL,
  `DEVICE_NAME` varchar(100) DEFAULT NULL,
  `DEVICE_MODEL` varchar(2) DEFAULT NULL,
  `HOST_NUM` varchar(30) DEFAULT '',
  `TCR_NUM` varchar(30) DEFAULT NULL,
  `MANAGER_NAME` varchar(10) DEFAULT NULL,
  `MANAGER_TEL` varchar(20) DEFAULT NULL,
  `ARRIVE_TIME` datetime DEFAULT NULL,
  `SETUP_TIME` datetime DEFAULT NULL,
  `SETUP_BRANCH_ID` varchar(30) DEFAULT NULL,
  `SETUP_BRANCH_ID_PRESENT` varchar(255) DEFAULT NULL,
  `SETUP_MAN` varchar(10) DEFAULT NULL,
  `SETUP_MAN_TEL` varchar(15) DEFAULT NULL,
  `SETUP_TYPE` varchar(2) DEFAULT NULL,
  `ACCPET_TIME` datetime DEFAULT NULL,
  `START_TIME` datetime DEFAULT NULL,
  `OUTOF_TIME` datetime DEFAULT NULL,
  `EXP_TIME` varchar(10) DEFAULT NULL,
  `SERVICER` varchar(30) DEFAULT NULL,
  `REPAIR_STATUS` varchar(2) DEFAULT NULL,
  `OUT_OF_SIGN` varchar(2) DEFAULT NULL,
  `LICENSE_TIME` datetime DEFAULT NULL,
  `REMARK1` varchar(30) DEFAULT NULL,
  `REMARK2` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `外键1` (`SETUP_BRANCH_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `oa_device_model` */

DROP TABLE IF EXISTS `oa_device_model`;

CREATE TABLE `oa_device_model` (
  `ID` int(4) NOT NULL AUTO_INCREMENT,
  `DEVICE_MODEL_NAME` varchar(60) DEFAULT NULL,
  `REMARK` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

/*Table structure for table `oa_device_type` */

DROP TABLE IF EXISTS `oa_device_type`;

CREATE TABLE `oa_device_type` (
  `ID` int(4) NOT NULL AUTO_INCREMENT,
  `DEVICE_TYPE_NAME` varchar(60) DEFAULT NULL,
  `REMARK` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Table structure for table `oa_exp_time` */

DROP TABLE IF EXISTS `oa_exp_time`;

CREATE TABLE `oa_exp_time` (
  `ID` int(4) NOT NULL AUTO_INCREMENT,
  `OA_EXP_TIME_NAME` varchar(60) DEFAULT NULL,
  `REMARK` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Table structure for table `oa_fault_reason` */

DROP TABLE IF EXISTS `oa_fault_reason`;

CREATE TABLE `oa_fault_reason` (
  `ID` varchar(10) NOT NULL,
  `CHINESE` varchar(30) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `oa_fault_type` */

DROP TABLE IF EXISTS `oa_fault_type`;

CREATE TABLE `oa_fault_type` (
  `ID` varchar(10) NOT NULL,
  `CHINESE` varchar(30) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `oa_setup_type` */

DROP TABLE IF EXISTS `oa_setup_type`;

CREATE TABLE `oa_setup_type` (
  `ID` int(4) NOT NULL AUTO_INCREMENT,
  `SETUP_TYPE_NAME` varchar(60) DEFAULT NULL,
  `REMARK` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Table structure for table `oa_workapp` */

DROP TABLE IF EXISTS `oa_workapp`;

CREATE TABLE `oa_workapp` (
  `ID` varchar(36) NOT NULL DEFAULT '' COMMENT '工单号',
  `WORK_TYPE` varchar(500) DEFAULT NULL COMMENT '工单类型',
  `WORK_URGENT` varchar(500) DEFAULT NULL COMMENT '工单紧急度',
  `WORK_STATUS` varchar(500) DEFAULT NULL COMMENT '工单状态',
  `WORK_DEPARTMENT` varchar(500) DEFAULT NULL COMMENT '申请人所属部门',
  `WORK_APPTIME` datetime DEFAULT NULL COMMENT '提出申请时间',
  `WORK_APPMARK` varchar(500) DEFAULT NULL COMMENT '申请备注',
  `WORK_DEV_NO` varchar(500) DEFAULT NULL COMMENT '设备编号（设备详细信息由此关联）',
  `WORK_CUS_NO` varchar(500) DEFAULT NULL COMMENT '客户信息（服务客户详细信息由此关联）',
  `WORK_APPEND` varchar(500) DEFAULT NULL COMMENT '其他附加信息，待确定',
  `WORK_FLOW_ID` varchar(500) DEFAULT NULL COMMENT '工作流ID',
  `WORK_CREATER_ID` varchar(500) DEFAULT NULL COMMENT '创建人ID',
  `WORK_LASTDEAL_ID` varchar(500) DEFAULT NULL COMMENT '最后处理人ID',
  `WORK_LASTDEAL_ID_ALL` varchar(500) DEFAULT NULL COMMENT '所有处理人',
  `WORK_CHECKPERSON_ID` varchar(500) DEFAULT NULL COMMENT '审批人ID',
  `WORK_APPROVER_ID` varchar(500) DEFAULT NULL COMMENT '审验人ID',
  `WORK_INSTALL_DEVTYPE` varchar(500) DEFAULT NULL COMMENT '安装设备类型',
  `WORK_INSTALL_MODEL` varchar(500) DEFAULT NULL COMMENT '设备型号',
  `WORK_REPAIR_TIME` datetime DEFAULT NULL COMMENT '故障发生时间',
  `WORK_REPAIR_TYPE` varchar(1000) DEFAULT NULL COMMENT '故障类型',
  `WORK_REPAIR_DESCRIBE` varchar(1000) DEFAULT NULL COMMENT '故障描述',
  `WORK_PARTOL_TYPE` varchar(1000) DEFAULT NULL COMMENT '巡检说明',
  `WORK_MOVEDEV_NAME` varchar(1000) DEFAULT NULL COMMENT '移机，客户名称',
  `WORK_MOVEDEV_ADDRESS` varchar(1000) DEFAULT NULL COMMENT '移机客户地址',
  `WORK_MOVEDEV_CONTACTS` varchar(1000) DEFAULT NULL COMMENT '移机联系人',
  `WORK_MOVEDEV_PHONE` varchar(1000) DEFAULT NULL COMMENT '移机联系方式',
  `WORK_ACCEPT_TIME` datetime DEFAULT NULL COMMENT '验收日期',
  `WORK_ACCEPT_TYPE` varchar(1000) DEFAULT NULL COMMENT '验收类型',
  `WORK_LASTMODIFYTIME` datetime DEFAULT NULL COMMENT '最后一次修改时间',
  `WORK_TRAIN_INFO` varchar(1000) DEFAULT NULL COMMENT '培训内容',
  `WORK_TRAIN_TIME` datetime DEFAULT NULL COMMENT '培训时间',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='工单信息表';

/*Table structure for table `oa_workapp_deal` */

DROP TABLE IF EXISTS `oa_workapp_deal`;

CREATE TABLE `oa_workapp_deal` (
  `ID` varchar(60) NOT NULL COMMENT '主键ID',
  `WORKAPP_ID` varchar(60) DEFAULT NULL COMMENT '工单表主键ID',
  `DEAL_MAN_ID` varchar(30) DEFAULT NULL COMMENT '处理人的ID',
  `DEAL_STATUS` varchar(2) DEFAULT NULL COMMENT '处理状态：处理中，处理完',
  `START_TIME` datetime DEFAULT NULL COMMENT '开始时间',
  `END_TIME` datetime DEFAULT NULL COMMENT '完成时间',
  `DEAL_DES` varchar(200) DEFAULT NULL COMMENT '处理描述',
  `DEVICE_TYPE` varchar(10) DEFAULT NULL COMMENT '设备类型',
  `DEVICE_MODEL` varchar(100) DEFAULT NULL COMMENT '设备型号',
  `DEVICE_ID` varchar(30) DEFAULT NULL COMMENT '设备编号',
  `DEVICE_NAME` varchar(255) DEFAULT NULL COMMENT '设备名称',
  `HOST_NUM` varchar(100) DEFAULT NULL COMMENT '主机序列号',
  `TCR_NUM` varchar(100) DEFAULT NULL COMMENT 'TCR序列号',
  `DEVICE_IP` varchar(100) DEFAULT NULL COMMENT '设备IP',
  `SUBNET_MASK` varchar(100) DEFAULT NULL COMMENT '子网掩码',
  `GATEWAY` varchar(100) DEFAULT NULL COMMENT '网关',
  `MAC` varchar(100) DEFAULT NULL COMMENT 'mac地址',
  `SETUP_TYPE` varchar(100) DEFAULT NULL COMMENT '安装点类型',
  `CHECK_TYPE` varchar(10) DEFAULT '' COMMENT '验收类型：硬件验收、功能验收、全部验收',
  `CHECK_RESULT` varchar(10) DEFAULT NULL COMMENT '验收结果：通过、不通过',
  `TRANING_CONT` varchar(200) DEFAULT NULL COMMENT '培训内容',
  `FAUILT_TYPE` varchar(100) DEFAULT NULL COMMENT '故障类别',
  `FAUILT_REASON` varchar(100) DEFAULT NULL COMMENT '故障原因',
  `REMARK1` varchar(100) DEFAULT NULL,
  `REMARK2` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `oa_worksaccepttype` */

DROP TABLE IF EXISTS `oa_worksaccepttype`;

CREATE TABLE `oa_worksaccepttype` (
  `ID` int(255) NOT NULL AUTO_INCREMENT,
  `ACCEPT_TYPE` varchar(255) DEFAULT NULL,
  `REMARK` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Table structure for table `oa_workstatus` */

DROP TABLE IF EXISTS `oa_workstatus`;

CREATE TABLE `oa_workstatus` (
  `ID` int(225) NOT NULL AUTO_INCREMENT,
  `WORK_STATUS` varchar(225) DEFAULT NULL,
  `REMARK` varchar(225) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

/*Table structure for table `oa_workstype` */

DROP TABLE IF EXISTS `oa_workstype`;

CREATE TABLE `oa_workstype` (
  `ID` int(255) NOT NULL AUTO_INCREMENT,
  `WORK_TYPE` varchar(255) DEFAULT NULL,
  `REMARK` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

/*Table structure for table `oa_worksurgent` */

DROP TABLE IF EXISTS `oa_worksurgent`;

CREATE TABLE `oa_worksurgent` (
  `ID` int(255) NOT NULL AUTO_INCREMENT,
  `WORK_URGENT` varchar(255) DEFAULT NULL,
  `REMARK` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;