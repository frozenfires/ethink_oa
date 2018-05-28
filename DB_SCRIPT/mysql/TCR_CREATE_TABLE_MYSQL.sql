CREATE DATABASE TCRC CHARACTER SET utf8 COLLATE utf8_general_ci;
CREATE TABLE BASE_BADACCOUNT_BOOK ( TRANLOG_ID VARCHAR(30), TYPE INTEGER, DEVICE_ID VARCHAR(10), FINISH_TIME DATETIME, ORG_ID VARCHAR(30), ERROR_USER_ID VARCHAR(15), DISPOSE_USER_ID VARCHAR(15), CCY VARCHAR(20), AMT VARCHAR(50), BADACCOUNT_DESC VARCHAR(200), ACCOUNT_ID VARCHAR(25) );
CREATE TABLE BASE_CASH_ACCOUNT ( ACCOUNT_ID VARCHAR(25) NOT NULL, ACCOUNT_DESC VARCHAR(100), DEVICE_ID VARCHAR(10), TELLER_BOX VARCHAR(1), DEVICE_BALANCE VARCHAR(15) DEFAULT '0', BOX_BALANCE VARCHAR(15) DEFAULT '0', USER_ID VARCHAR(15), ORGID VARCHAR(15), TERMINAL_IP VARCHAR(15), PRIMARY KEY (ACCOUNT_ID) );
CREATE TABLE BASE_DEVICE_AREA ( AREA_ID VARCHAR(10), AREA_NAME VARCHAR(30) );
CREATE TABLE BASE_DEVICE_BRAND ( BRAND_ID VARCHAR(10) NOT NULL, BRAND_NAME VARCHAR(30), ENG_NAME VARCHAR(30), TELEPHONE VARCHAR(15), MOBILEPHONE VARCHAR(15), EMAIL VARCHAR(40), CONTRACT_NO VARCHAR(40), CONTACTS VARCHAR(15), UPDATE_TIME DATETIME, CONSTRAINT BASE_DEVICE_BRAND_PK PRIMARY KEY (BRAND_ID) );
CREATE TABLE BASE_DEVICE_FIX_TYPE ( FIX_TYPE VARCHAR(10), FIX_NAME VARCHAR(30), START_TIME DATETIME, END_TIME DATETIME );
CREATE TABLE BASE_DEVICE_INFO ( DEVICE_ID VARCHAR(10) NOT NULL, DEVICE_NAME VARCHAR(30), DEVICE_IP VARCHAR(20), DEVICE_ADMIN VARCHAR(15), DEVICE_AREA_ID VARCHAR(10), FIX_TYPE VARCHAR(10), BRAND_ID VARCHAR(10), DEVICE_TYPE VARCHAR(10), DEVICE_MODEL_ID VARCHAR(10), DEVICE_PROVIDER_ID VARCHAR(10), DEVICE_STATUS VARCHAR(1), DEVICE_ADDRESS VARCHAR(50), COMMENTS VARCHAR(100), DEVICE_BALANCE VARCHAR(15), TERMINAL_IP VARCHAR(20), TERMINAL_IP2 VARCHAR(20), ORG_ID VARCHAR(15), UPDATE_DATE DATETIME, PRIMARY KEY (DEVICE_ID) );
CREATE TABLE BASE_DEVICE_MODEL ( DEVICE_BRAND VARCHAR(15), DEVICE_TYPE VARCHAR(10), DEVICE_MODEL VARCHAR(20) );
CREATE TABLE BASE_DEVICE_PROVIDER ( PROVIDER_ID VARCHAR(15), PROVIDER_NAME VARCHAR(30), CONTACTS VARCHAR(15), TELEPHONE VARCHAR(15), MOBILEPHONE VARCHAR(15), EMAIL VARCHAR(40), CONTRACT_NO VARCHAR(40) );
CREATE TABLE BASE_DEVICE_TYPE ( TYPE_ID VARCHAR(10) NOT NULL, TYPE_NAME VARCHAR(30), UPDATE_DATE DATETIME, CONSTRAINT BASE_DEVICE_TYPE_PK PRIMARY KEY (TYPE_ID) );
CREATE TABLE BASE_ORG ( ORG_ID VARCHAR(30) NOT NULL, ORG_NAME VARCHAR(100), ORG_STATUS VARCHAR(1), ORG_TYPE VARCHAR(20), PARENT_ORG_ID VARCHAR(30), ORG_ADDRESS VARCHAR(100), ORG_PHONE VARCHAR(15), ORG_CONTACTS VARCHAR(20), UPDATE_DATE DATETIME, PRIMARY KEY (ORG_ID) );
CREATE TABLE BASE_RESOURCE ( MODULE_ID VARCHAR(20) NOT NULL, MODULE_NAME VARCHAR(30), PARENT_MODULE_ID VARCHAR(20), MODULE_ORDER INTEGER, MODULE_STATUS VARCHAR(10), MODULE_LEVEL INTEGER, MODULE_URL VARCHAR(100), MODULE_AUTH VARCHAR(50), UPDATE_DATE DATETIME,IS_USE_TIME VARCHAR(1), PRIMARY KEY (MODULE_ID) );
CREATE TABLE BASE_ROLE ( ROLE_ID VARCHAR(15) NOT NULL, ROLE_NAME VARCHAR(30), ROLE_DESC VARCHAR(100), PRIMARY KEY (ROLE_ID) );
CREATE TABLE BASE_ROLE_RESOURCE ( ROLE_ID VARCHAR(15), MODULE_ID VARCHAR(20) );
CREATE TABLE BASE_ROLE_USER ( ROLE_ID VARCHAR(15), USER_ID VARCHAR(15) );
CREATE TABLE BASE_SEQNO ( SEQNO_DATE VARCHAR(10), SEQNO VARCHAR(10) );
CREATE TABLE BASE_USER ( USER_ID VARCHAR(15) NOT NULL, USER_NAME VARCHAR(20), ORG_ID VARCHAR(15), TELEPHONE VARCHAR(15), MOBILEPHONE VARCHAR(15), EMAIL VARCHAR(30), PASSWORD VARCHAR(35), LAST_LOGIN_DATE DATETIME, STATUS VARCHAR(1), ACCOUNT_ID VARCHAR(20), ROLE_ID VARCHAR(30), UPDATE_TIME DATETIME, ORG_ADMIN VARCHAR(1), FREEZE_USER VARCHAR(5), PRIMARY KEY (USER_ID) );
CREATE TABLE FIN_ACCOUNT_BOOK ( TRANLOG_ID VARCHAR(30), USER_ID VARCHAR(15), TRANCODE VARCHAR(15), LOGTIME DATETIME, DEVICE_ID VARCHAR(15), ACCOUNT_ID VARCHAR(15), TCRAMT INT, BOXAMT INT, FACEVALUE1 VARCHAR(10) DEFAULT '0', FACEVALUE5 VARCHAR(10) DEFAULT '0', FACEVALUE10 VARCHAR(10) DEFAULT '0', FACEVALUE20 VARCHAR(10) DEFAULT '0', FACEVALUE50 VARCHAR(10) DEFAULT '0', FACEVALUE100 VARCHAR(10) DEFAULT '0', ACC_DEVICE_BALANCE VARCHAR(15) DEFAULT '0', BOX_BALANCE VARCHAR(15) DEFAULT '0', DEVICE_BALANCE VARCHAR(15) DEFAULT '0', ORG_ID VARCHAR(15) DEFAULT '0' );
CREATE TABLE FIN_CASHBOX_BOOK ( TELLERID VARCHAR(20), TRANCODE VARCHAR(4), OPERTYPE VARCHAR(1), BRANCHID VARCHAR(8), TERMID VARCHAR(10), TSPDATE VARCHAR(8), TSPTIME VARCHAR(6), CURRENCYTYPE VARCHAR(3), PREAMT INT(17), BOXTRANAMT INT(17), TCRTRANAMT INT(17), TRANAMT INT(17), AFTAMT INT(17), DETAIL VARCHAR(200), ATMID VARCHAR(16), CLIENTTRACENUM VARCHAR(20), BOXTRANAMT1 INT(17), TCRTRANAMT1 INT(17), ACCNO VARCHAR(30) );
CREATE TABLE FIN_CASHNO ( TRANLOG_ID VARCHAR(100), SNO VARCHAR(100), AMTTYPE VARCHAR(100), CCY VARCHAR(100), TRANCODE VARCHAR(100), CLIENTID VARCHAR(100), DEVICE_ID VARCHAR(100), INSERT_TIME DATETIME, MAINLOG_ID VARCHAR(100) );
CREATE TABLE FIN_CASH_ACCOUNT ( UNTID VARCHAR(8) NOT NULL, ACCNO VARCHAR(30) NOT NULL, ACCTYPE VARCHAR(1) NOT NULL, CCY VARCHAR(3) NOT NULL, OPENDATE VARCHAR(8), CLOSEDATE VARCHAR(8), ACCSTATE VARCHAR(1), BRANCHID VARCHAR(8), LASTTELLER VARCHAR(20), BOXSEQ VARCHAR(5), LASTTELLERNAME VARCHAR(50), BAL INT(17), CONSTRAINT PK_CASHACCOUNT PRIMARY KEY (UNTID, ACCNO, ACCTYPE, CCY) );
CREATE TABLE FIN_DEVICE_COUNTER_BOOK ( TRANLOG_ID VARCHAR(30), LOGTIME DATETIME, TRANFLAG VARCHAR(10), BLANCE_100 VARCHAR(10), BLANCE_50 VARCHAR(10), BLANCE_20 VARCHAR(10), BLANCE_10 VARCHAR(10), BLANCE_5 VARCHAR(10), BLANCE_1 VARCHAR(10), COLLECT_100 VARCHAR(10), COLLECT_50 VARCHAR(10), COLLECT_20 VARCHAR(10), COLLECT_10 VARCHAR(10), COLLECT_5 VARCHAR(10), COLLECT_1 VARCHAR(10), ECYCLE_100 VARCHAR(10), ECYCLE_50 VARCHAR(10), ECYCLE_20 VARCHAR(10), ECYCLE_10 VARCHAR(10), ECYCLE_5 VARCHAR(10), ECYCLE_1 VARCHAR(10), BOX7013TYPE VARCHAR(10), BOX7013COUNT VARCHAR(10), BOX7013STATUS VARCHAR(10), BOX7013CCY VARCHAR(10), BOX7014TYPE VARCHAR(10), BOX7014COUNT VARCHAR(10), BOX7014STATUS VARCHAR(10), BOX7014CCY VARCHAR(10), BOX7015TYPE VARCHAR(10), BOX7015COUNT VARCHAR(10), BOX7015STATUS VARCHAR(10), BOX7015CCY VARCHAR(10), BOX7016TYPE VARCHAR(10), BOX7016COUNT VARCHAR(10), BOX7016STATUS VARCHAR(10), BOX7016CCY VARCHAR(10), BOX7018TYPE VARCHAR(10), BOX7018COUNT VARCHAR(10), BOX7018STATUS VARCHAR(10), BOX7018CCY VARCHAR(10), BOX_DETAIL VARCHAR(10), DEVICE_ID VARCHAR(10) );
CREATE TABLE FIN_MONITOR_RULE ( UNTID VARCHAR(8), BRANCHID VARCHAR(8), WARNNUM VARCHAR(5) NOT NULL, CASHBOX VARCHAR(10), RULE VARCHAR(5), WARNVALUE VARCHAR(3), WARNLVL VARCHAR(2), CONSTRAINT PK_CASHBOXCAPWARN PRIMARY KEY (WARNNUM) );
CREATE TABLE FIN_TEMP_TRANINFO ( ID VARCHAR(30) NOT NULL, USER_ID VARCHAR(15), USER_NAME VARCHAR(30), SOLUTIONID VARCHAR(30), TRANLINKID VARCHAR(30), TRANTYPE VARCHAR(30), LOGTIME DATETIME, REASON VARCHAR(200), CCY VARCHAR(20), TCRAMT VARCHAR(10), BOXAMT VARCHAR(10), PATTERN VARCHAR(10), ACTUALAMT VARCHAR(100), FLAG VARCHAR(100), MARK VARCHAR(100), ACTUALAMT_DETAIL VARCHAR(300), TRANAMT_DETAIL VARCHAR(300), CONSTRAINT PK_ESCROW_ID PRIMARY KEY (ID) );
CREATE TABLE FIN_TRAN_EXCEPTION ( TRANLOG_ID VARCHAR(30), SCREEN TEXT, DATA VARCHAR(500) );
CREATE TABLE FIN_TRAN_LOG ( TRANLOG_ID VARCHAR(30) NOT NULL, MAINLOG_ID VARCHAR(30), USER_ID VARCHAR(15), ORG_ID VARCHAR(15), DEVICE_ID VARCHAR(15), ACCOUNT_ID VARCHAR(30), TRANCODE VARCHAR(15), INSERT_TIME DATETIME, FINISH_TIME DATETIME, TRAN_STATUS VARCHAR(20), TCRAMT VARCHAR(15), BOXAMT VARCHAR(15), ONLINE_NO VARCHAR(30), RETCODE_ONLINE VARCHAR(20), TCR_REAL_AMT VARCHAR(15), REAL_V1 VARCHAR(10), REAL_V5 VARCHAR(10), REAL_V10 VARCHAR(10), REAL_V20 VARCHAR(10), REAL_V50 VARCHAR(10), REAL_V100 VARCHAR(10), TCR_AMT_BEFOR VARCHAR(10), ATM_NO VARCHAR(20), CONSUMER_ACCOUNT VARCHAR(30), SELEBRANCH VARCHAR(1), IS_REVERSED VARCHAR(1), TRANFEES VARCHAR(10), TRANCODE_THIRD VARCHAR(15), SEQNO_THIRD VARCHAR(10), ADD_MONEY_CYCLE VARCHAR(5), REASON VARCHAR(100), MEMO VARCHAR(200), UPDATE_TIME DATETIME, CCY VARCHAR(15), PATTERN VARCHAR(3), CASH_FLAG VARCHAR(8) );
CREATE TABLE BASE_SYSTEM_USE_TIME( ID VARCHAR(32), ORG_ID VARCHAR(10), DEVICE_NUM VARCHAR(10), USE_TIME VARCHAR(20), TIME_QUANTUM VARCHAR(15), PRIMARY KEY (ID) );
CREATE TABLE BASE_USERHANDOVER_LOG (ID VARCHAR(32) NOT NULL, ORG_ID VARCHAR(10), DEVICE_ID VARCHAR(10), CURRENTUSER VARCHAR(15), CURRENTDATE DATETIME, DEVICE_AMT VARCHAR(10), TAILBOX_AMT VARCHAR(10), RECEIVE_USER VARCHAR(15), PRIMARY KEY (ID));