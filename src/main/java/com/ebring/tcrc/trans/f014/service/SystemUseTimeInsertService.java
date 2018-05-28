package com.ebring.tcrc.trans.f014.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;
/**
 * 表单数据增加，将前台数据加入到数据库之前，对数据是否重复提交进行判断
 * @author 焦明轩
 *
 */
public class SystemUseTimeInsertService implements IService{
	
	private static final Logger log = Logger.getLogger(SystemUseTimeInsertService.class);
	private ITcrcBaseManageDao tcrcBaseManageDao;
	@Override
	public Result execute(Map<String, Object> params) {
		// TODO Auto-generated method stub
		String week2 = "";
		//Result result=null;
		Result result = new Result();
		String USE_TIME="";
		if (log.isDebugEnabled()) {
			log.debug("SystemUseTimeService接收到的参数：" + params);
		}
		try {
			//String MODULE_ID = (String)params.get("MODULE_ID");
			//String ORG_ID = (String)params.get("ORG_ID");
			String POINT = (String)params.get("POINT5");
			String EQUIPMENT =(String)params.get("EQUIPMENT");
			//前台获得每天
			String weiyi =(String)params.get("weiyi");
			//前台获得日期
			String DATE =(String)params.get("DATE");
			//前台获得星期
			String week =(String) params.get("Z1")+(String) params.get("Z2")+(String) params.get("Z3")+
						 (String) params.get("Z4")+(String) params.get("Z5")+(String) params.get("Z6")+
						 (String) params.get("Z7");
			String week6 =(String)params.get("week6");
			
			if(!"".equals(weiyi) && weiyi != null){
				USE_TIME ="E,"+weiyi;
				//weiyi = "E"+weiyi;
			}else if(!"".equals(week6) && week6 != null){
				 week2 = "W,";
				 week2 +=week6;
				USE_TIME +=week2;
			}else if(!"".equals(DATE) && DATE != null){
				DATE = "D,"+DATE+",";
				USE_TIME+=DATE;
			}
			//生成UUID
			//Util u=new Util();
			String UUID=Util.getUUID();
			//获得前台时间段
			//String STARTTIME =(String)params.get("STARTTIME");
			//String ENDTIME =(String)params.get("ENDTIME");			
			//String TIME_QUANTUM =STARTTIME+"-"+ENDTIME;
			//获得时间差
			String HourHome = (String)params.get("HourHome");
			String SecondHome = (String)params.get("SecondHome");
			String HourEnd =  (String)params.get("HourEnd");
			String SecondEnd = (String)params.get("SecondEnd");
			int startHour= Integer.parseInt(HourHome);
			int startSecond= Integer.parseInt(SecondHome);
			int endHour= Integer.parseInt(HourEnd);
			int endSecond= Integer.parseInt(SecondEnd);
			if(startHour<10){
				HourHome="0"+startHour;
			}
			if(startSecond<10){
				SecondHome="0"+startSecond;
			}
			if(endHour<10){
				HourEnd="0"+endHour;
			}
			if(endSecond<10){
				SecondEnd="0"+endSecond;
			}
			String STARTTIME =HourHome+","+SecondHome;
			String ENDTIME =HourEnd+","+SecondEnd;
			String TIME_QUANTUM =STARTTIME+","+ENDTIME+",";
			//设置map存放得到的数据
			Map map =new HashMap();
			map.put("ID", UUID);
			map.put("ORG_ID",POINT );
			map.put("DEVICE_NUM",EQUIPMENT );
			map.put("USE_TIME", USE_TIME);
			map.put("TIME_QUANTUM", TIME_QUANTUM);
			//添加时进行用户是否重复插入判断，新建map集合存放除TIME_QUANTUM之外的所有数据
			Map map5 =new HashMap();
			map5.put("ID", UUID);
			map5.put("ORG_ID",POINT );
			map5.put("DEVICE_NUM",EQUIPMENT );
			map5.put("USE_TIME", USE_TIME);
			//判断数据是否重复提交
			List list = new ArrayList();
			list = tcrcBaseManageDao.InspectionSaveDateSubmit(map5);
			//以下代码判断增加时星期是否有重叠
			Map map2 = new HashMap();
			map2.put("ORG_ID", POINT);
			map2.put("DEVICE_NUM",EQUIPMENT );
			//按当前网点号和设备号查询出库中表BASE_SYSTEM_USE_TIME的所有USE_TIME字段的数据
			List list2 = new ArrayList();
			list2 = tcrcBaseManageDao.selectUSE_TIME(map2);
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
			if(!"".equals(week6) && week6 != null){
				String vv1 = week6.substring(0,week6.length()-1);
				String [] h=vv1.split(",");
				for(int i=0;i<h.length;i++){
					set2.add(h[i]);
				}
			}
			//判断set1和set2是否存在交集
			set3.retainAll(set2);
			//进行星期是否重复判断
			if(set3.size()>0){
				result.setMessage("星期不能重复");
				result.setSuccess(false);
				return result;
			}
			log.debug(set3);
			String message;
			if(list.size()==0){
			tcrcBaseManageDao.insertSystemUseTime(map);
			result.setSuccess(true);
			}else{
				//message = "该数据已经存在";
				result.setMessage("该数据已经存在");
				result.setSuccess(false);
				//result.setMessage(message);
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
