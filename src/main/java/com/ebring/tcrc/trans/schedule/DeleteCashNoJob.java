package com.ebring.tcrc.trans.schedule;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;

import com.ebring.platform.common.schedule.IJob;
import com.ebring.tcrc.common.ConfigUtil;
import com.ebring.tcrc.common.Util;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseFunctionDao;


/**
 * 删除冠字号及日志信息
 * @author zhigq
 *
 */
public class DeleteCashNoJob implements IJob {
	private static final Logger log = Logger.getLogger(DeleteCashNoJob.class);
	private int  cashnoKeepMonth;//冠字号保留月
	private int tranlogKeepMonth;//日志保留月
	private ITcrcBaseFunctionDao tcrcBaseFunctionDao;
	@Override
	public void executeJob() {
         
		//从config.properties 中获取配置参数
		cashnoKeepMonth=Integer.parseInt(ConfigUtil.getPropertyValue("cashnoKeepMonth"));
		tranlogKeepMonth=Integer.parseInt(ConfigUtil.getPropertyValue("tranlogKeepMonth"));
		
           Map<String,String> paramMap=new HashMap<String,String>();
           
           if(cashnoKeepMonth!=-1){
           String cashDate=getMinusDate(cashnoKeepMonth);
           paramMap.put("DELETE_DATE", cashDate);

           try{
                int rows=  tcrcBaseFunctionDao.deleteCashNo(paramMap);
                log.info("Detele cashno success rows:"+rows);
           }catch(Exception e){
        	   e.printStackTrace();
        	   log.error(Util.getStackTrace(e));
            }
           }
           
           if(tranlogKeepMonth!=-1){
               String logDate=getMinusDate(tranlogKeepMonth);
               paramMap.put("DELETE_DATE", logDate);

               try{
                    int rows=  tcrcBaseFunctionDao.deleteTranLog(paramMap);
                    log.info("Detele TranLog success rows:"+rows);
               }catch(Exception e){
            	   e.printStackTrace();
            	   log.error(Util.getStackTrace(e));
                }
               }   
	}


	public void setTcrcBaseFunctionDao(ITcrcBaseFunctionDao tcrcBaseFunctionDao) {
		this.tcrcBaseFunctionDao = tcrcBaseFunctionDao;
	}


	private String getMinusDate(int month){
		   Calendar calendar=Calendar.getInstance();   
		   calendar.setTime(new Date()); 
		   calendar.set(Calendar.MONTH,calendar.get(Calendar.MONTH)-month);//让日期加减
		   SimpleDateFormat df=new SimpleDateFormat("yyyy-MM-dd");  
		   return  df.format(calendar.getTime());
	}	
	
}
