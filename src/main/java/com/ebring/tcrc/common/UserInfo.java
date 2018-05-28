package com.ebring.tcrc.common;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public class UserInfo implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String userID;
	private String userName;
	private String password;
	private String orgID;
	private String accountID;
	private String deviceID;
	private String orgName;
	private String updateTime;
	private String orgAdmin;
	private String twoTeller;
	private String quotaControl;
	private String lockStatus;
	
	public String getUserID() {
		return userID;
	}
	
	public void setUserID(String userID) {
		this.userID = userID;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}

	public String getOrgID() {
		return orgID;
	}

	public void setOrgID(String orgID) {
		this.orgID = orgID;
	}

	public String getAccountID() {
		return accountID;
	}

	public void setAccountID(String accountID) {
		this.accountID = accountID;
	}

	public String getDeviceID() {
		return deviceID;
	}

	public void setDeviceID(String deviceID) {
		this.deviceID = deviceID;
	}

	public String getOrgName() {
		return orgName;
	}

	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}
	public void setUpdateTime(String updateTime) {
		this.updateTime = updateTime;
	}

	public void setOrgAdmin(String orgAdmin) {
		this.orgAdmin = orgAdmin;
	}
	public String getUpdateTime() {
		return updateTime;
	}

	public String getOrgAdmin() {
		return orgAdmin;
	}
	
	public String getQuotaControl() {
		return quotaControl;
	}

	public void setQuotaControl(String quotaControl) {
		this.quotaControl = quotaControl;
	}

	public String getTwoTeller() {
		return twoTeller;
	}

	public void setTwoTeller(String twoTeller) {
		this.twoTeller = twoTeller;
	}
	
	public String getLockStatus() {
		return lockStatus;
	}

	public void setLockStatus(String lockStatus) {
		this.lockStatus = lockStatus;
	}

	public String toString(){
		Map<String, String> map = new HashMap<String, String>();
		map.put("deviceID", accountID);
		map.put("orgID", orgID);
		map.put("orgName", orgName);
		map.put("userID", userID);
		map.put("userName", userName);
		map.put("accountID", accountID);
		map.put("updateTime", updateTime);
		map.put("orgAdmin", orgAdmin);
		map.put("twoTeller", "false");
		map.put("quotaControl", "false");
		map.put("lockStatus", lockStatus);
		return map.toString();
	}

}