CREATE TABLE act_evt_log (LOG_NR_ bigint NOT NULL AUTO_INCREMENT, TYPE_ varchar(64) COLLATE utf8_bin, PROC_DEF_ID_ varchar(64) COLLATE utf8_bin, PROC_INST_ID_ varchar(64) COLLATE utf8_bin, EXECUTION_ID_ varchar(64) COLLATE utf8_bin, TASK_ID_ varchar(64) COLLATE utf8_bin, TIME_STAMP_ timestamp DEFAULT 'CURRENT_TIMESTAMP(3)' ON UPDATE CURRENT_TIMESTAMP, USER_ID_ varchar(255) COLLATE utf8_bin, DATA_ longblob, LOCK_OWNER_ varchar(255) COLLATE utf8_bin, LOCK_TIME_ timestamp NULL, IS_PROCESSED_ tinyint DEFAULT '0', PRIMARY KEY (LOG_NR_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE act_ge_bytearray (ID_ varchar(64) COLLATE utf8_bin NOT NULL, REV_ int, NAME_ varchar(255) COLLATE utf8_bin, DEPLOYMENT_ID_ varchar(64) COLLATE utf8_bin, BYTES_ longblob, GENERATED_ tinyint, PRIMARY KEY (ID_), INDEX ACT_FK_BYTEARR_DEPL (DEPLOYMENT_ID_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE act_ge_property (NAME_ varchar(64) COLLATE utf8_bin NOT NULL, VALUE_ varchar(300) COLLATE utf8_bin, REV_ int, PRIMARY KEY (NAME_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE act_hi_actinst (ID_ varchar(64) COLLATE utf8_bin NOT NULL, PROC_DEF_ID_ varchar(64) COLLATE utf8_bin NOT NULL, PROC_INST_ID_ varchar(64) COLLATE utf8_bin NOT NULL, EXECUTION_ID_ varchar(64) COLLATE utf8_bin NOT NULL, ACT_ID_ varchar(255) COLLATE utf8_bin NOT NULL, TASK_ID_ varchar(64) COLLATE utf8_bin, CALL_PROC_INST_ID_ varchar(64) COLLATE utf8_bin, ACT_NAME_ varchar(255) COLLATE utf8_bin, ACT_TYPE_ varchar(255) COLLATE utf8_bin NOT NULL, ASSIGNEE_ varchar(255) COLLATE utf8_bin, START_TIME_ datetime NOT NULL, END_TIME_ datetime, DURATION_ bigint, TENANT_ID_ varchar(255) COLLATE utf8_bin, PRIMARY KEY (ID_), INDEX ACT_IDX_HI_ACT_INST_START (START_TIME_), INDEX ACT_IDX_HI_ACT_INST_END (END_TIME_), INDEX ACT_IDX_HI_ACT_INST_PROCINST (PROC_INST_ID_, ACT_ID_), INDEX ACT_IDX_HI_ACT_INST_EXEC (EXECUTION_ID_, ACT_ID_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE act_hi_attachment (ID_ varchar(64) COLLATE utf8_bin NOT NULL, REV_ int, USER_ID_ varchar(255) COLLATE utf8_bin, NAME_ varchar(255) COLLATE utf8_bin, DESCRIPTION_ varchar(4000) COLLATE utf8_bin, TYPE_ varchar(255) COLLATE utf8_bin, TASK_ID_ varchar(64) COLLATE utf8_bin, PROC_INST_ID_ varchar(64) COLLATE utf8_bin, URL_ varchar(4000) COLLATE utf8_bin, CONTENT_ID_ varchar(64) COLLATE utf8_bin, TIME_ datetime, PRIMARY KEY (ID_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE act_hi_comment (ID_ varchar(64) COLLATE utf8_bin NOT NULL, TYPE_ varchar(255) COLLATE utf8_bin, TIME_ datetime NOT NULL, USER_ID_ varchar(255) COLLATE utf8_bin, TASK_ID_ varchar(64) COLLATE utf8_bin, PROC_INST_ID_ varchar(64) COLLATE utf8_bin, ACTION_ varchar(255) COLLATE utf8_bin, MESSAGE_ varchar(4000) COLLATE utf8_bin, FULL_MSG_ longblob, PRIMARY KEY (ID_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE act_hi_detail (ID_ varchar(64) COLLATE utf8_bin NOT NULL, TYPE_ varchar(255) COLLATE utf8_bin NOT NULL, PROC_INST_ID_ varchar(64) COLLATE utf8_bin, EXECUTION_ID_ varchar(64) COLLATE utf8_bin, TASK_ID_ varchar(64) COLLATE utf8_bin, ACT_INST_ID_ varchar(64) COLLATE utf8_bin, NAME_ varchar(255) COLLATE utf8_bin NOT NULL, VAR_TYPE_ varchar(255) COLLATE utf8_bin, REV_ int, TIME_ datetime NOT NULL, BYTEARRAY_ID_ varchar(64) COLLATE utf8_bin, DOUBLE_ double, LONG_ bigint, TEXT_ varchar(4000) COLLATE utf8_bin, TEXT2_ varchar(4000) COLLATE utf8_bin, PRIMARY KEY (ID_), INDEX ACT_IDX_HI_DETAIL_PROC_INST (PROC_INST_ID_), INDEX ACT_IDX_HI_DETAIL_ACT_INST (ACT_INST_ID_), INDEX ACT_IDX_HI_DETAIL_TIME (TIME_), INDEX ACT_IDX_HI_DETAIL_NAME (NAME_), INDEX ACT_IDX_HI_DETAIL_TASK_ID (TASK_ID_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE act_hi_identitylink (ID_ varchar(64) COLLATE utf8_bin NOT NULL, GROUP_ID_ varchar(255) COLLATE utf8_bin, TYPE_ varchar(255) COLLATE utf8_bin, USER_ID_ varchar(255) COLLATE utf8_bin, TASK_ID_ varchar(64) COLLATE utf8_bin, PROC_INST_ID_ varchar(64) COLLATE utf8_bin, PRIMARY KEY (ID_), INDEX ACT_IDX_HI_IDENT_LNK_USER (USER_ID_), INDEX ACT_IDX_HI_IDENT_LNK_TASK (TASK_ID_), INDEX ACT_IDX_HI_IDENT_LNK_PROCINST (PROC_INST_ID_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE act_hi_procinst (ID_ varchar(64) COLLATE utf8_bin NOT NULL, PROC_INST_ID_ varchar(64) COLLATE utf8_bin NOT NULL, BUSINESS_KEY_ varchar(255) COLLATE utf8_bin, PROC_DEF_ID_ varchar(64) COLLATE utf8_bin NOT NULL, START_TIME_ datetime NOT NULL, END_TIME_ datetime, DURATION_ bigint, START_USER_ID_ varchar(255) COLLATE utf8_bin, START_ACT_ID_ varchar(255) COLLATE utf8_bin, END_ACT_ID_ varchar(255) COLLATE utf8_bin, SUPER_PROCESS_INSTANCE_ID_ varchar(64) COLLATE utf8_bin, DELETE_REASON_ varchar(4000) COLLATE utf8_bin, TENANT_ID_ varchar(255) COLLATE utf8_bin, NAME_ varchar(255) COLLATE utf8_bin, PRIMARY KEY (ID_), CONSTRAINT PROC_INST_ID_ UNIQUE (PROC_INST_ID_), INDEX ACT_IDX_HI_PRO_INST_END (END_TIME_), INDEX ACT_IDX_HI_PRO_I_BUSKEY (BUSINESS_KEY_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE act_hi_taskinst (ID_ varchar(64) COLLATE utf8_bin NOT NULL, PROC_DEF_ID_ varchar(64) COLLATE utf8_bin, TASK_DEF_KEY_ varchar(255) COLLATE utf8_bin, PROC_INST_ID_ varchar(64) COLLATE utf8_bin, EXECUTION_ID_ varchar(64) COLLATE utf8_bin, NAME_ varchar(255) COLLATE utf8_bin, PARENT_TASK_ID_ varchar(64) COLLATE utf8_bin, DESCRIPTION_ varchar(4000) COLLATE utf8_bin, OWNER_ varchar(255) COLLATE utf8_bin, ASSIGNEE_ varchar(255) COLLATE utf8_bin, START_TIME_ datetime NOT NULL, CLAIM_TIME_ datetime, END_TIME_ datetime, DURATION_ bigint, DELETE_REASON_ varchar(4000) COLLATE utf8_bin, PRIORITY_ int, DUE_DATE_ datetime, FORM_KEY_ varchar(255) COLLATE utf8_bin, CATEGORY_ varchar(255) COLLATE utf8_bin, TENANT_ID_ varchar(255) COLLATE utf8_bin, PRIMARY KEY (ID_), INDEX ACT_IDX_HI_TASK_INST_PROCINST (PROC_INST_ID_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE act_hi_varinst (ID_ varchar(64) COLLATE utf8_bin NOT NULL, PROC_INST_ID_ varchar(64) COLLATE utf8_bin, EXECUTION_ID_ varchar(64) COLLATE utf8_bin, TASK_ID_ varchar(64) COLLATE utf8_bin, NAME_ varchar(255) COLLATE utf8_bin NOT NULL, VAR_TYPE_ varchar(100) COLLATE utf8_bin, REV_ int, BYTEARRAY_ID_ varchar(64) COLLATE utf8_bin, DOUBLE_ double, LONG_ bigint, TEXT_ varchar(4000) COLLATE utf8_bin, TEXT2_ varchar(4000) COLLATE utf8_bin, CREATE_TIME_ datetime, LAST_UPDATED_TIME_ datetime, PRIMARY KEY (ID_), INDEX ACT_IDX_HI_PROCVAR_PROC_INST (PROC_INST_ID_), INDEX ACT_IDX_HI_PROCVAR_NAME_TYPE (NAME_, VAR_TYPE_), INDEX ACT_IDX_HI_PROCVAR_TASK_ID (TASK_ID_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE act_id_group (ID_ varchar(64) COLLATE utf8_bin NOT NULL, REV_ int, NAME_ varchar(255) COLLATE utf8_bin, TYPE_ varchar(255) COLLATE utf8_bin, PRIMARY KEY (ID_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE act_id_info (ID_ varchar(64) COLLATE utf8_bin NOT NULL, REV_ int, USER_ID_ varchar(64) COLLATE utf8_bin, TYPE_ varchar(64) COLLATE utf8_bin, KEY_ varchar(255) COLLATE utf8_bin, VALUE_ varchar(255) COLLATE utf8_bin, PASSWORD_ longblob, PARENT_ID_ varchar(255) COLLATE utf8_bin, PRIMARY KEY (ID_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE act_id_membership (USER_ID_ varchar(64) COLLATE utf8_bin NOT NULL, GROUP_ID_ varchar(64) COLLATE utf8_bin NOT NULL, PRIMARY KEY (USER_ID_, GROUP_ID_), INDEX ACT_FK_MEMB_GROUP (GROUP_ID_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE act_id_user (ID_ varchar(64) COLLATE utf8_bin NOT NULL, REV_ int, FIRST_ varchar(255) COLLATE utf8_bin, LAST_ varchar(255) COLLATE utf8_bin, EMAIL_ varchar(255) COLLATE utf8_bin, PWD_ varchar(255) COLLATE utf8_bin, PICTURE_ID_ varchar(64) COLLATE utf8_bin, PRIMARY KEY (ID_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE act_procdef_info (ID_ varchar(64) COLLATE utf8_bin NOT NULL, PROC_DEF_ID_ varchar(64) COLLATE utf8_bin NOT NULL, REV_ int, INFO_JSON_ID_ varchar(64) COLLATE utf8_bin, PRIMARY KEY (ID_), CONSTRAINT ACT_UNIQ_INFO_PROCDEF UNIQUE (PROC_DEF_ID_), INDEX ACT_IDX_INFO_PROCDEF (PROC_DEF_ID_), INDEX ACT_FK_INFO_JSON_BA (INFO_JSON_ID_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE act_re_deployment (ID_ varchar(64) COLLATE utf8_bin NOT NULL, NAME_ varchar(255) COLLATE utf8_bin, CATEGORY_ varchar(255) COLLATE utf8_bin, TENANT_ID_ varchar(255) COLLATE utf8_bin, DEPLOY_TIME_ timestamp NULL, PRIMARY KEY (ID_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE act_re_model (ID_ varchar(64) COLLATE utf8_bin NOT NULL, REV_ int, NAME_ varchar(255) COLLATE utf8_bin, KEY_ varchar(255) COLLATE utf8_bin, CATEGORY_ varchar(255) COLLATE utf8_bin, CREATE_TIME_ timestamp NULL, LAST_UPDATE_TIME_ timestamp NULL, VERSION_ int, META_INFO_ varchar(4000) COLLATE utf8_bin, DEPLOYMENT_ID_ varchar(64) COLLATE utf8_bin, EDITOR_SOURCE_VALUE_ID_ varchar(64) COLLATE utf8_bin, EDITOR_SOURCE_EXTRA_VALUE_ID_ varchar(64) COLLATE utf8_bin, TENANT_ID_ varchar(255) COLLATE utf8_bin, PRIMARY KEY (ID_), INDEX ACT_FK_MODEL_SOURCE (EDITOR_SOURCE_VALUE_ID_), INDEX ACT_FK_MODEL_SOURCE_EXTRA (EDITOR_SOURCE_EXTRA_VALUE_ID_), INDEX ACT_FK_MODEL_DEPLOYMENT (DEPLOYMENT_ID_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE act_re_procdef (ID_ varchar(64) COLLATE utf8_bin NOT NULL, REV_ int, CATEGORY_ varchar(255) COLLATE utf8_bin, NAME_ varchar(255) COLLATE utf8_bin, KEY_ varchar(255) COLLATE utf8_bin NOT NULL, VERSION_ int NOT NULL, DEPLOYMENT_ID_ varchar(64) COLLATE utf8_bin, RESOURCE_NAME_ varchar(4000) COLLATE utf8_bin, DGRM_RESOURCE_NAME_ varchar(4000) COLLATE utf8_bin, DESCRIPTION_ varchar(4000) COLLATE utf8_bin, HAS_START_FORM_KEY_ tinyint, HAS_GRAPHICAL_NOTATION_ tinyint, SUSPENSION_STATE_ int, TENANT_ID_ varchar(255) COLLATE utf8_bin, PRIMARY KEY (ID_), CONSTRAINT ACT_UNIQ_PROCDEF UNIQUE (KEY_, VERSION_, TENANT_ID_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE act_ru_event_subscr (ID_ varchar(64) COLLATE utf8_bin NOT NULL, REV_ int, EVENT_TYPE_ varchar(255) COLLATE utf8_bin NOT NULL, EVENT_NAME_ varchar(255) COLLATE utf8_bin, EXECUTION_ID_ varchar(64) COLLATE utf8_bin, PROC_INST_ID_ varchar(64) COLLATE utf8_bin, ACTIVITY_ID_ varchar(64) COLLATE utf8_bin, CONFIGURATION_ varchar(255) COLLATE utf8_bin, CREATED_ timestamp DEFAULT 'CURRENT_TIMESTAMP(3)', PROC_DEF_ID_ varchar(64) COLLATE utf8_bin, TENANT_ID_ varchar(255) COLLATE utf8_bin, PRIMARY KEY (ID_), INDEX ACT_IDX_EVENT_SUBSCR_CONFIG_ (CONFIGURATION_), INDEX ACT_FK_EVENT_EXEC (EXECUTION_ID_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE act_ru_execution (ID_ varchar(64) COLLATE utf8_bin NOT NULL, REV_ int, PROC_INST_ID_ varchar(64) COLLATE utf8_bin, BUSINESS_KEY_ varchar(255) COLLATE utf8_bin, PARENT_ID_ varchar(64) COLLATE utf8_bin, PROC_DEF_ID_ varchar(64) COLLATE utf8_bin, SUPER_EXEC_ varchar(64) COLLATE utf8_bin, ACT_ID_ varchar(255) COLLATE utf8_bin, IS_ACTIVE_ tinyint, IS_CONCURRENT_ tinyint, IS_SCOPE_ tinyint, IS_EVENT_SCOPE_ tinyint, SUSPENSION_STATE_ int, CACHED_ENT_STATE_ int, TENANT_ID_ varchar(255) COLLATE utf8_bin, NAME_ varchar(255) COLLATE utf8_bin, LOCK_TIME_ timestamp NULL, PRIMARY KEY (ID_), INDEX ACT_IDX_EXEC_BUSKEY (BUSINESS_KEY_), INDEX ACT_FK_EXE_PROCINST (PROC_INST_ID_), INDEX ACT_FK_EXE_PARENT (PARENT_ID_), INDEX ACT_FK_EXE_SUPER (SUPER_EXEC_), INDEX ACT_FK_EXE_PROCDEF (PROC_DEF_ID_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE act_ru_identitylink (ID_ varchar(64) COLLATE utf8_bin NOT NULL, REV_ int, GROUP_ID_ varchar(255) COLLATE utf8_bin, TYPE_ varchar(255) COLLATE utf8_bin, USER_ID_ varchar(255) COLLATE utf8_bin, TASK_ID_ varchar(64) COLLATE utf8_bin, PROC_INST_ID_ varchar(64) COLLATE utf8_bin, PROC_DEF_ID_ varchar(64) COLLATE utf8_bin, PRIMARY KEY (ID_), INDEX ACT_IDX_IDENT_LNK_USER (USER_ID_), INDEX ACT_IDX_IDENT_LNK_GROUP (GROUP_ID_), INDEX ACT_IDX_ATHRZ_PROCEDEF (PROC_DEF_ID_), INDEX ACT_FK_TSKASS_TASK (TASK_ID_), INDEX ACT_FK_IDL_PROCINST (PROC_INST_ID_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE act_ru_job (ID_ varchar(64) COLLATE utf8_bin NOT NULL, REV_ int, TYPE_ varchar(255) COLLATE utf8_bin NOT NULL, LOCK_EXP_TIME_ timestamp NULL, LOCK_OWNER_ varchar(255) COLLATE utf8_bin, EXCLUSIVE_ tinyint(1), EXECUTION_ID_ varchar(64) COLLATE utf8_bin, PROCESS_INSTANCE_ID_ varchar(64) COLLATE utf8_bin, PROC_DEF_ID_ varchar(64) COLLATE utf8_bin, RETRIES_ int, EXCEPTION_STACK_ID_ varchar(64) COLLATE utf8_bin, EXCEPTION_MSG_ varchar(4000) COLLATE utf8_bin, DUEDATE_ timestamp NULL, REPEAT_ varchar(255) COLLATE utf8_bin, HANDLER_TYPE_ varchar(255) COLLATE utf8_bin, HANDLER_CFG_ varchar(4000) COLLATE utf8_bin, TENANT_ID_ varchar(255) COLLATE utf8_bin, PRIMARY KEY (ID_), INDEX ACT_FK_JOB_EXCEPTION (EXCEPTION_STACK_ID_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE act_ru_task (ID_ varchar(64) COLLATE utf8_bin NOT NULL, REV_ int, EXECUTION_ID_ varchar(64) COLLATE utf8_bin, PROC_INST_ID_ varchar(64) COLLATE utf8_bin, PROC_DEF_ID_ varchar(64) COLLATE utf8_bin, NAME_ varchar(255) COLLATE utf8_bin, PARENT_TASK_ID_ varchar(64) COLLATE utf8_bin, DESCRIPTION_ varchar(4000) COLLATE utf8_bin, TASK_DEF_KEY_ varchar(255) COLLATE utf8_bin, OWNER_ varchar(255) COLLATE utf8_bin, ASSIGNEE_ varchar(255) COLLATE utf8_bin, DELEGATION_ varchar(64) COLLATE utf8_bin, PRIORITY_ int, CREATE_TIME_ timestamp NULL, DUE_DATE_ datetime, CATEGORY_ varchar(255) COLLATE utf8_bin, SUSPENSION_STATE_ int, TENANT_ID_ varchar(255) COLLATE utf8_bin, FORM_KEY_ varchar(255) COLLATE utf8_bin, PRIMARY KEY (ID_), INDEX ACT_IDX_TASK_CREATE (CREATE_TIME_), INDEX ACT_FK_TASK_EXE (EXECUTION_ID_), INDEX ACT_FK_TASK_PROCINST (PROC_INST_ID_), INDEX ACT_FK_TASK_PROCDEF (PROC_DEF_ID_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE act_ru_variable (ID_ varchar(64) COLLATE utf8_bin NOT NULL, REV_ int, TYPE_ varchar(255) COLLATE utf8_bin NOT NULL, NAME_ varchar(255) COLLATE utf8_bin NOT NULL, EXECUTION_ID_ varchar(64) COLLATE utf8_bin, PROC_INST_ID_ varchar(64) COLLATE utf8_bin, TASK_ID_ varchar(64) COLLATE utf8_bin, BYTEARRAY_ID_ varchar(64) COLLATE utf8_bin, DOUBLE_ double, LONG_ bigint, TEXT_ varchar(4000) COLLATE utf8_bin, TEXT2_ varchar(4000) COLLATE utf8_bin, PRIMARY KEY (ID_), INDEX ACT_IDX_VARIABLE_TASK_ID (TASK_ID_), INDEX ACT_FK_VAR_EXE (EXECUTION_ID_), INDEX ACT_FK_VAR_PROCINST (PROC_INST_ID_), INDEX ACT_FK_VAR_BYTEARRAY (BYTEARRAY_ID_)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE act_ge_bytearray ADD CONSTRAINT ACT_FK_BYTEARR_DEPL FOREIGN KEY (DEPLOYMENT_ID_) REFERENCES act_re_deployment (ID_);
ALTER TABLE act_id_membership ADD CONSTRAINT ACT_FK_MEMB_GROUP FOREIGN KEY (GROUP_ID_) REFERENCES act_id_group (ID_) ;
ALTER TABLE act_id_membership ADD CONSTRAINT ACT_FK_MEMB_USER FOREIGN KEY (USER_ID_) REFERENCES act_id_user (ID_);
ALTER TABLE act_procdef_info ADD CONSTRAINT ACT_FK_INFO_JSON_BA FOREIGN KEY (INFO_JSON_ID_) REFERENCES act_ge_bytearray (ID_) ;
ALTER TABLE act_procdef_info ADD CONSTRAINT ACT_FK_INFO_PROCDEF FOREIGN KEY (PROC_DEF_ID_) REFERENCES act_re_procdef (ID_);
ALTER TABLE act_re_model ADD CONSTRAINT ACT_FK_MODEL_DEPLOYMENT FOREIGN KEY (DEPLOYMENT_ID_) REFERENCES act_re_deployment (ID_) ;
ALTER TABLE act_re_model ADD CONSTRAINT ACT_FK_MODEL_SOURCE FOREIGN KEY (EDITOR_SOURCE_VALUE_ID_) REFERENCES act_ge_bytearray (ID_) ;
ALTER TABLE act_re_model ADD CONSTRAINT ACT_FK_MODEL_SOURCE_EXTRA FOREIGN KEY (EDITOR_SOURCE_EXTRA_VALUE_ID_) REFERENCES act_ge_bytearray (ID_);
ALTER TABLE act_ru_event_subscr ADD CONSTRAINT ACT_FK_EVENT_EXEC FOREIGN KEY (EXECUTION_ID_) REFERENCES act_ru_execution (ID_);
ALTER TABLE act_ru_execution ADD CONSTRAINT ACT_FK_EXE_PARENT FOREIGN KEY (PARENT_ID_) REFERENCES act_ru_execution (ID_) ;
ALTER TABLE act_ru_execution ADD CONSTRAINT ACT_FK_EXE_PROCDEF FOREIGN KEY (PROC_DEF_ID_) REFERENCES act_re_procdef (ID_) ;
ALTER TABLE act_ru_execution ADD CONSTRAINT ACT_FK_EXE_PROCINST FOREIGN KEY (PROC_INST_ID_) REFERENCES act_ru_execution (ID_) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE act_ru_execution ADD CONSTRAINT ACT_FK_EXE_SUPER FOREIGN KEY (SUPER_EXEC_) REFERENCES act_ru_execution (ID_);
ALTER TABLE act_ru_identitylink ADD CONSTRAINT ACT_FK_ATHRZ_PROCEDEF FOREIGN KEY (PROC_DEF_ID_) REFERENCES act_re_procdef (ID_) ;
ALTER TABLE act_ru_identitylink ADD CONSTRAINT ACT_FK_IDL_PROCINST FOREIGN KEY (PROC_INST_ID_) REFERENCES act_ru_execution (ID_) ;
ALTER TABLE act_ru_identitylink ADD CONSTRAINT ACT_FK_TSKASS_TASK FOREIGN KEY (TASK_ID_) REFERENCES act_ru_task (ID_);
ALTER TABLE act_ru_job ADD CONSTRAINT ACT_FK_JOB_EXCEPTION FOREIGN KEY (EXCEPTION_STACK_ID_) REFERENCES act_ge_bytearray (ID_);
ALTER TABLE act_ru_task ADD CONSTRAINT ACT_FK_TASK_EXE FOREIGN KEY (EXECUTION_ID_) REFERENCES act_ru_execution (ID_) ;
ALTER TABLE act_ru_task ADD CONSTRAINT ACT_FK_TASK_PROCDEF FOREIGN KEY (PROC_DEF_ID_) REFERENCES act_re_procdef (ID_) ;
ALTER TABLE act_ru_task ADD CONSTRAINT ACT_FK_TASK_PROCINST FOREIGN KEY (PROC_INST_ID_) REFERENCES act_ru_execution (ID_);
ALTER TABLE act_ru_variable ADD CONSTRAINT ACT_FK_VAR_BYTEARRAY FOREIGN KEY (BYTEARRAY_ID_) REFERENCES act_ge_bytearray (ID_) ;
ALTER TABLE act_ru_variable ADD CONSTRAINT ACT_FK_VAR_EXE FOREIGN KEY (EXECUTION_ID_) REFERENCES act_ru_execution (ID_) ;
ALTER TABLE act_ru_variable ADD CONSTRAINT ACT_FK_VAR_PROCINST FOREIGN KEY (PROC_INST_ID_) REFERENCES act_ru_execution (ID_);