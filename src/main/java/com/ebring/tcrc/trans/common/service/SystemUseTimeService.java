package com.ebring.tcrc.trans.common.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.ebring.platform.common.service.IService;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;

/**
 * 此服务重要功能为：通过使用时间设置模块所规定的合法使用时间
 * 判断当前网点下的设备号在当前时间是否具有操作设备的合法性
 * @author Administrator
 *
 */
public class SystemUseTimeService implements IService  {

	private static final Logger log = Logger.getLogger(SystemUseTimeService.class);
	private ITcrcBaseManageDao tcrcBaseManageDao;
	//private Result result = new Result();
	
	@Override
	public Result execute(Map<String, Object> params) {
		Result result = new Result();
		//建立list集合存放根据网点号和设备号两个条件查出来的数据,list中存放BASE_SYSTEM_USE_TIME表的USE_TIME,TIME_QUANTUM两个字段的数据
		List list = new ArrayList();
		//建立list集合存放根据网点号一个条件查出来的数据
		List list2 = new ArrayList();
		//建立list集合存放网点号和设备号都为空时查出来的数据
		List list3 = new ArrayList();
		//新建空字符串存判断当前操作模块是否需要做时间判断
		String ss = "";		
		if (log.isDebugEnabled()) {
			log.debug("SystemUseTimeService接收到的参数：" + params);
		}
		try {
			//获得网点号
			String ORG_ID =(String)params.get("ORG_ID");
			String DEVICE_ID =(String)params.get("DEVICE_ID");
			log.debug("当前网点号 "+ORG_ID);
			log.debug("当前设备号 "+DEVICE_ID);
			//获取前台的MODULE_ID
			String MODULE_ID = (String)params.get("MODULE_ID");
			log.debug("获取前台的MODULE_ID值 "+MODULE_ID);
			//当前map存放MODULE_ID值传入后台
			Map map = new HashMap();
			map.put("MODULE_ID", MODULE_ID);
			//判断BASE_RESOURCE表中有哪些管理模块需要做时间验证判断,如果ss不为null证明需要验证
			ss = tcrcBaseManageDao.selectBaseSourceIsY(map);
			if(ss ==null){
				log.debug("该模块不会被验证 "+ ss);
				result.setSuccess(true);
				result.setMessage("不需要验证");
			
			}else{
				log.debug("该模块会被验证 "+ss);
				//map2存放当前网点号和设备号
				Map map2 = new HashMap();
				map2.put("ORG_ID", ORG_ID);
				map2.put("DEVICE_NUM", DEVICE_ID);
				log.debug("map2 "+map2);	
				//map3存放当前网点号
				Map map3 = new HashMap();
				map3.put("ORG_ID", ORG_ID);
				log.debug("map3 "+map3);
				//根据网点号和设备号作为条件查询当前时间段模块是否可用
				list = tcrcBaseManageDao.SelectBaseSystemUseTimeByORG_IDAndDEVICE_ID(map2);
				log.debug("根据网点号和设备号作为条件查询当前时间段模块是否可用  "+map2);
				//仅根据网点号查询当前时间模块是否可用
				list2 = tcrcBaseManageDao.SelectBaseSystemUseTimeByORG_IDA(map3);
				log.debug("仅根据网点号查询当前时间模块是否可用  "+map3);
				//网点号和设备号都为空时查询当前时间模块是否可用
				list3 = tcrcBaseManageDao.SelectBaseSystemUseTimeByempty();
				log.debug("网点号和设备号都为空时查询当前时间模块是否可用  ");
				if(list.size()>0){
					result.setSuccess(CommValidate(list));
				}else if(list2.size()>0){
					result.setSuccess(CommValidate(list2));
				}else if(list3.size()>0){
					result.setSuccess(CommValidate(list3));
				}else{
					//如果当前登录用户的网点号和设备号都不匹配上述三种情况，则默认允许该用户操作设备
					result.setSuccess(true);
				}
			}
				
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		log.debug(result.getResult());
		return result;
	}
	
	/**
	 *  公共验证方法 
	 *  此方法用来判断传入的list中USE_TIME字段存储的数据是日期、星期，还是每天
	 *  取出数据库中与今天相匹配的限制条件，并且验证当前时间是否处在合法的操作时间范围内
	 */
	private boolean CommValidate(List list){
		Result result = new Result();
		try {
			//此次循环用来判断符合网点号和设备号条件的是否有优先级最高的日期判断
			for(int i=0;i<list.size();i++){
				Map map5 = (Map)list.get(i);
				if(map5.get("USE_TIME").toString().length()>0){
					String USE_TIME = (String) map5.get("USE_TIME");
					USE_TIME = USE_TIME.substring(0, 1);
					if(USE_TIME.equals("D")){
						log.debug("进入日期判断 ");
						//获得设定日期
						String sheding =(String)map5.get("USE_TIME");
						String sheding2 = sheding.substring(2,sheding.length()-1);
						String now = getDate();
						if(now.equals(sheding2)){
							//设定日期与指定日期相符,按照设定日期规则
							//获得设定日期的规定可操作时间String ddf="01,05,10,13,";
							//获得用户前台设置的合法可操作时间范围
							String zong  = (String)map5.get("TIME_QUANTUM");
							//在此基础上去掉最后一个逗号
							String ss1 = zong.substring(0,zong.length()-1);
							//将前台传入的合法可操作时间范围字符串以","分割成ss2[]数组
							String [] ss2 = ss1.split(",");
							//起始时间转换成Integer类型
							int TimeStart = Integer.parseInt(ss2[0]+ss2[1]);
							//结束时间转换成Integer类型
							int TimeEnd = Integer.parseInt(ss2[2]+ss2[3]);
					    //获得当前时间
							Date date = new Date();
							SimpleDateFormat simple = new SimpleDateFormat("HHmm");
							//io为HHmm格式的当前时间
							String io = simple.format(date);
							//将当前时间转换成Integer类型
							int ioo = Integer.parseInt(io);
							//判断当前时间是否在合法的时间范围内
							if(ioo<TimeStart || ioo>TimeEnd){
								result.setSuccess(false);
								return false;
							}else{
								result.setSuccess(true);
								return true;
							}
						}else{
							//return false;
						}
					}
				}
			}
			//此次循环用来判断符合网点号和设备号条件的是否有优先级次高的星期判断
			for(int j=0;j<list.size();j++){
				log.info(list.toString());
				//map6用来存放数据库中符合网点号和设备号条件的USE_TIME和TIME_QUANTUM字段数据
				Map map6 = (Map)list.get(j);
				if(map6.get("USE_TIME").toString().length()>0){
					String USE_TIME1 = (String) map6.get("USE_TIME");
					log.info(USE_TIME1);
					String USE_TIME2 = USE_TIME1.substring(0, 1);
					//判断是否有星期
					if(USE_TIME2.equals("W")){
						log.debug("进入星期判定 ");
						//定义dd1是为了获得前台传入的星期字符串并去除掉最后一个逗号
						String dd1 = USE_TIME1.substring(0,USE_TIME1.length()-1);
						//将dd1以","分割成f[]数组
						String [] f=dd1.split(",");
						//获取数据库中符合条件的时间规则
						String e = (String)map6.get("TIME_QUANTUM");
						//得到当前星期
						int weekx = week();
						//将当前星期转换成Integer类型
						String weekc = Integer.toString(weekx);
						//循环当前f[]数组中的每一个星期数据，来和今天作比对，如果比对成功则判断今天的当前时间是否处在合法的可操作时间范围内
						//如果无一比对成功则证明今天是不可操作星期
						for(int k=0;k<f.length;k++){
							if(f[k].equals(weekc)){
								if(panduan(e)){
									result.setSuccess(true);
									return true;
								}else{
									result.setSuccess(false);
									return false;
								}
								
							}else{
								log.debug("今天不在指定星期内");
							}
						}
						//result.setSuccess(false);
						//return false;
					}
				}
			}
			//result.setSuccess(false);
			//return false;
			//此次循环用来判断符合网点号和设备号条件的是否有优先级最低的每天
			for(int n=0;n<list.size();n++){
				//list意为接收数据库中按相应网点号或设备号查询出的USE_TIME和TIME_QUANTUM字段的数据，将list中的每一个值放入map7中
				Map map7 = (Map)list.get(n);
				if(map7.get("USE_TIME").toString().length()>0){
					//USE_TIME3存放USE_TIME的数据
					String USE_TIME3 = (String) map7.get("USE_TIME");
					//USE_TIME4含义为截取字符串USE_TIME3的首位字母
					String USE_TIME4 = USE_TIME3.substring(0, 1);
					//如果以字母"E"开头则进入每天判定
					if(USE_TIME4.equals("E")){
						log.debug("进入每天判定 ");
						String e = (String)map7.get("TIME_QUANTUM");
						if(panduan(e)){
							log.debug("在范围时间内 ");
							result.setSuccess(true);
							return true;
						}else{
							log.debug("不在范围时间内 ");
							result.setSuccess(false);
							return false;
						}
					}
				}
			}
			
		} catch (Exception e) {
			// TODO: handle exception
			log.error(Util.getStackTrace(e));
		}
		result.setSuccess(false);
		return false;
		//return true;
	}
	
	
	/**
	 * 获取当前日期
	 * @return
	 *//*
	public static String getDate(String format){
		SimpleDateFormat simple = null;
		try {
			simple = new SimpleDateFormat(format);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return simple.format(new Date());
	}*/
	
	/**
	 * 获取当前日期
	 * @param tcrcBaseManageDao
	 */
	private String getDate(){
		Date date = new Date();
		SimpleDateFormat s =new SimpleDateFormat("yyyyMMdd");
		String time = s.format(date);
		return time;
	}
	
	/**
	 * 判断当前时间是否在设定时间的范围内
	 * @param tcrcBaseManageDao
	 */
	private boolean panduan(String time){
			//获得设定日期的规定可操作时间String ddf="01,05,10,13,";
			String zong  = time;
			log.debug("当前传入时间 "+zong);
			String ss1 = zong.substring(0,zong.length()-1);
			String [] ss2 = ss1.split(",");
				//起始时间
				int TimeStart = Integer.parseInt(ss2[0]+ss2[1]);
				log.debug("当前传入起始时间 "+TimeStart);
				//结束时间
				int TimeEnd = Integer.parseInt(ss2[2]+ss2[3]);
				log.debug("当前传入截止时间 "+TimeEnd);
		    //获得当前时间
				Date date = new Date();
				SimpleDateFormat simple = new SimpleDateFormat("HHmm");
				String io = simple.format(date);
				int ioo = Integer.parseInt(io);
				log.debug("获得当前时间 "+ioo);
				if(ioo<TimeStart || ioo>TimeEnd){
					System.out.println("当前不可操作");
					log.debug("当前不可操作 ");
					return false;
				}else{
					System.out.println("当前可以操作");
					log.debug("当前可以操作");
					return true;
				}
	}
	
	/**
	 * 获得当前星期
	 * @param tcrcBaseManageDao
	 */
	private int week(){
		Date d= new Date();
		//String[] weekDays = {"星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"};
        Calendar cal = Calendar.getInstance();
        cal.setTime(d);
        int w = cal.get(Calendar.DAY_OF_WEEK) - 1;
        return w;
	}

	public void setTcrcBaseManageDao(ITcrcBaseManageDao tcrcBaseManageDao) {
		this.tcrcBaseManageDao = tcrcBaseManageDao;
	}
	
}
