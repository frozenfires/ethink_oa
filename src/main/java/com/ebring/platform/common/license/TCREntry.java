package com.ebring.platform.common.license;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import com.ebring.platform.exception.LicenceException;

public class TCREntry {

	private static Logger logger = Logger.getLogger(TCREntry.class);
	private static Map<String, Boolean> validateMap = new HashMap<String, Boolean>();
	private static String VALIDATE = "VALIDATE";
	private static StringBuilder licenseMsg = new StringBuilder();
	private static License license = new License();
	private static String ACTIVE_PROFILE = "spring.profiles.active";
	private static String DEVELOPMENT = "development"; 

	/**
	 * 验证license，并保存结果。
	 * @return
	 */
	public static boolean validate() {
		boolean result = false;
		try {
			if (validateMap.containsKey(VALIDATE)) {
				result = validateMap.get(VALIDATE);
				if (!result ) {
					LicenceException licenceError = new LicenceException(licenseMsg.toString());
					throw licenceError;
				}
			} else {
				doValidate();
			}
		}catch(LicenceException e){
			throw e;
		}catch (Throwable e) {
			logger.error("TCREntry验证错误", e);
		}
		
		logger.info(DEVELOPMENT.equals(System.getProperty(ACTIVE_PROFILE)));
		return true;
	}
	
	/**
	 * 重新验证license
	 * @return
	 */
	public static boolean re_validate() {
		try{
			doValidate();
			return true;
		}catch(Exception e){
			logger.error("TCREntry验证错误",  e);
			return false;
		}
	}

	/**
	 * 验证license
	 * @throws Exception 验证失败抛出异常
	 */
	private static void doValidate() throws Exception {
		boolean flag = false;
		logger.info("重新计算，验证license");
		try {

			Resource res = new ClassPathResource("pubring.gpg");
			license.loadKeyRing(res.getInputStream(), null);
			Resource res_license = new ClassPathResource("tcr.license");
			license.setLicenseEncoded(res_license.getInputStream());
			String macAddress = license.getFeature("mac");
			String localMac = MacAddressUtil.getMacAddress();
			logger.debug("localMac:" + localMac);
			int valid = 0;
			if (macAddress.indexOf(localMac) < 0) {
				licenseMsg.append("非法license ")
					.append(macAddress).append(",");
				licenseMsg.append("localMac ")
					.append(localMac).append(" ");
				valid++;
			}

			String valid_date = license.getFeature("valid-date");
			SimpleDateFormat st = new SimpleDateFormat("yyyy-MM-dd");
			Date date = st.parse(valid_date);
			boolean isValidate = date.before(new Date());
			
			if (isValidate) {
				logger.error("时间  验证失败! Time valid fail! ");
				licenseMsg.append("license已过期:")
					.append(valid_date).append(" ");
				valid++;
			}

			if (valid == 0) {
				licenseMsg.delete(0, licenseMsg.length());
				flag = true;
			}

		} catch (Exception e) {
			throw e;
		}

		validateMap.put(VALIDATE, flag);
		
		if(!flag)
			throw new LicenceException(licenseMsg.toString());

	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}

}
