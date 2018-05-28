package com.ebring.tcrc.trans.f014.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;
/**
 * 修改前台表单数据服务
 * @author Administrator
 *
 */
public class SystemUseTimeUpdateService implements IService{
	private static final Logger log = Logger.getLogger(SystemUseTimeUpdateService.class);
	private ITcrcBaseManageDao tcrcBaseManageDao;
	@Override
	public Result execute(Map<String, Object> parameterMap) {
		Result result= new Result();
		String week2 = "";
		String USE_TIME = "";
		if (log.isDebugEnabled()) {
			log.debug("SystemUseTimeUpdateService接收到的参数：" + parameterMap);
		}
		try {
			String Serial = (String)parameterMap.get("Serial");
			//获得前台的网点号
			String Network = (String)parameterMap.get("Network");
			//获得前台的设备号
			String Equipment = (String)parameterMap.get("Equipment");
			//获得前台的日期
			String Date5 = (String)parameterMap.get("Date5");
			String TimeSlot = (String)parameterMap.get("TimeSlot");
			//获得前台的每一天选项	
			String weiyi1 =(String)parameterMap.get("weiyi1");
			//前台获得星期
			String week1 =(String) parameterMap.get("ZZ1")+(String) parameterMap.get("ZZ2")+(String) parameterMap.get("ZZ3")+
						 (String) parameterMap.get("ZZ4")+(String) parameterMap.get("ZZ5")+(String) parameterMap.get("ZZ6")+
						 (String) parameterMap.get("ZZ7");	
			System.out.println(week1);
			//
			String week = (String) parameterMap.get("week");
			
			if(!"".equals(weiyi1) && weiyi1 != null){
				USE_TIME ="E,"+weiyi1;
			}else if(!"".equals(week) && week != null){
				String week3 = "W,";
				week3 += week;
				USE_TIME += week3;
			}else if(!"".equals(Date5) && Date5 != null){
				Date5 = "D,"+Date5+",";
				USE_TIME+=Date5;
			}
			//获得时间差
			String HourHome2 = (String)parameterMap.get("HourHome2");
			String SecondHome2 = (String)parameterMap.get("SecondHome2");
			String HourEnd2 =  (String)parameterMap.get("HourEnd2");
			String SecondEnd2 = (String)parameterMap.get("SecondEnd2");
			int startHour2= Integer.parseInt(HourHome2);
			int startSecond2= Integer.parseInt(SecondHome2);
			int endHour2= Integer.parseInt(HourEnd2);
			int endSecond2= Integer.parseInt(SecondEnd2);
			if(startHour2<10){
				HourHome2="0"+startHour2;
			}
			if(startSecond2<10){
				SecondHome2="0"+startSecond2;
			}
			if(endHour2<10){
				HourEnd2="0"+endHour2;
			}
			if(endSecond2<10){
				SecondEnd2="0"+endSecond2;
			}
			String STARTTIME =HourHome2+","+SecondHome2;
			String ENDTIME =HourEnd2+","+SecondEnd2;
			String TIME_QUANTUM =STARTTIME+","+ENDTIME+",";
			//设置map存放得到的数据
			Map map = new HashMap();
			map.put("ID", Serial);
			map.put("ORG_ID",Network );
			map.put("DEVICE_NUM",Equipment );
			map.put("USE_TIME", USE_TIME);
			map.put("TIME_QUANTUM", TIME_QUANTUM);
			//判断修改数据是否重复提交
			List list =new ArrayList();
			list = tcrcBaseManageDao.InspectionSaveDateSubmit(map);
			String message;
			/*if(list.size()==0){
				tcrcBaseManageDao.updateUseTimeDate(map);
				result.setSuccess(true);
				}else{
					message = "该修改后数据已经存在";				
					result.setSuccess(false);
					result.setMessage(message);
				}*/
			/**
			 * 以下代码判断数据修改后星期是否重复存在(代码开始)
			 */
			Map map2 = new HashMap();
			map2.put("ID", Serial);
			map2.put("ORG_ID", Network);
			map2.put("DEVICE_NUM",Equipment );
			//按当前网点号和设备号查询出库中表BASE_SYSTEM_USE_TIME的所有USE_TIME字段的数据
			List list2 = new ArrayList();
			list2 = tcrcBaseManageDao.updateSelectUSE_TIME(map2);
			//设置一个set集合存放从库中查出的星期数据
			Set set = new HashSet();
			//设置一个set集合存放从页面传入的星期数据
			Set set2 = new HashSet();
			//循环取出list2中的USE_TIME字段中以W开头的星期数据存放如新建的set集合中
			for(int i=0;i<list2.size();i++){
				Map map3 = (Map)list2.get(i);
				System.out.println(map3);
				if(map3.get("USE_TIME").toString().length()>0){
					String USE_TIME1 = (String) map3.get("USE_TIME");
					String USE_TIME2 = USE_TIME1.substring(0, 1);
					//仅仅判断星期
					if(USE_TIME2.equals("W")){
						log.debug("进入星期判定 ");
						String dd1 = USE_TIME1.substring(2,USE_TIME1.length()-1);
						System.out.println(dd1);
						String [] f=dd1.split(",");
						log.debug(f);
						for(int j=0;j<f.length;j++){
							set.add(f[j]);
						}
					}
					//判断每天
					if(USE_TIME2.equals("E")){
						log.debug("进入每天判断");
						String dd2 = "1,2,3,4,5,6,7";
						String [] f2=dd2.split(",");
						for(int n=0;n<f2.length;n++){
							set.add(f2[n]);
						}
					}
				}
			}
			//设置一个set集合判断页面传入的星期集合是否和数据库中的星期集合有重复
			Set set3 = new HashSet(set);
			//将获取到的week6打成纯数字
			if(!"".equals(week) && week != null){
				String vv1 = week.substring(0,week.length()-1);
				String [] h=vv1.split(",");
				for(int i=0;i<h.length;i++){
					set2.add(h[i]);
				}
			}
			//判断set1和set2是否存在交集
			set3.retainAll(set2);
			//进行星期是否重复判断
			if(set3.size()>0){
				result.setMessage("修改后的星期与原有星期重复");
				result.setSuccess(false);
				return result;
			}
			/**
			 * 判断修改数据提交星期是否重复存在(代码结束)
			 */
			if(list.size()==0){
				tcrcBaseManageDao.updateUseTimeDate(map);
				result.setSuccess(true);
				}else{
					message = "该修改后数据已经存在";	
					result.setMessage(message);
					result.setSuccess(false);
				}
			
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		return result;
	}
	public void setTcrcBaseManageDao(ITcrcBaseManageDao tcrcBaseManageDao) {
		this.tcrcBaseManageDao = tcrcBaseManageDao;
	}


}
