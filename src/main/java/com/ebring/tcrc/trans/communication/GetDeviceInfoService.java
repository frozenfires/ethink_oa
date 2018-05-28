package com.ebring.tcrc.trans.communication;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;

@Service("GetDeviceInfoService")
public class GetDeviceInfoService {

	private static final Logger log = Logger.getLogger(GetDeviceInfoService.class);
	private ITcrcBaseManageDao tcrcBaseManageDao;
	private Map deviceMap;
	
	
	private void loadInfo(){
		 if(deviceMap==null){
			 deviceMap=new HashMap();
		 }else{
			 deviceMap.clear();
		 }
		   List<Map> deviceList=	tcrcBaseManageDao.selectDeviceinfo(new HashMap());
			for (int i = 0; i <deviceList.size(); i++) {
				Map map=deviceList.get(i);
				String terminal_ip=(String)map.get("TERMINAL_IP");
				String device_status=(String)map.get("DEVICE_STATUS");
				deviceMap.put(terminal_ip, device_status);
				String TERMINAL_IP2 = (String) map.get("TERMINAL_IP2");
				if (StringUtils.isNotEmpty(TERMINAL_IP2)) {
					terminal_ip=TERMINAL_IP2;
					deviceMap.put(terminal_ip, device_status);
				}
			}
	}
	
	
	public void init(){
		
	}
	
	public void reloadInfo(){
		try{
			loadInfo();
		}catch(Exception e){
			log.error(null, e);
		}
	}
	
	
	public boolean getDeviceFormIP(String ip){
		boolean flag=false;
		if(deviceMap == null){
			loadInfo();
		}

		if(deviceMap.containsKey(ip)){
			String device_status=(String)deviceMap.get(ip);
			if("0".equals(device_status)){
				flag=true;
			}
		}
		return flag;
	}

	public void setTcrcBaseManageDao(ITcrcBaseManageDao tcrcBaseManageDao) {
		this.tcrcBaseManageDao = tcrcBaseManageDao;
	}

	public ITcrcBaseManageDao getTcrcBaseManageDao() {
		return tcrcBaseManageDao;
	}
	
	
	

}
