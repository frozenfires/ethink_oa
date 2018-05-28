package com.ebring.oa.trans;

import com.ebring.platform.common.service.IService;

import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.Util;

import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;
import com.ebring.workflow.IWorkFlowService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;

import java.util.List;
import java.util.Map;

//工单处理服务
public class DeleteFileService implements IService {

    private static final Logger log = Logger.getLogger(AppWorkService.class);

	@Value("${app.workdir}")
	private String workdir;

    @Override
    public Result execute(Map parameterMap) {
      
    	log.info(parameterMap);
    	String fileName = parameterMap.get("fileName").toString();
    	String trueLoc = parameterMap.get("fileloc").toString();
    	return deleteFile(fileName,trueLoc);
    	
    }
        
    //删除文件
    public Result deleteFile(String fileName,String trueLoc) {
       	Result result = new Result();
       	trueLoc=workdir+trueLoc;
		File file = new File(trueLoc,fileName);
		 // 如果文件路径所对应的文件存在，并且是一个文件，则直接删除
        if (file.exists() && file.isFile()) {
            if (file.delete()) {
                System.out.println("删除单个文件" + fileName + "成功！");
                result.setSuccess(true);
                result.setMessage("true");
                return result;
            } else {
                System.out.println("删除单个文件" + fileName + "失败！");
                result.setSuccess(false);
                result.setMessage("false");
                return result;
            }
        } else {
            System.out.println("删除单个文件失败：" + fileName + "不存在！");
            result.setSuccess(false);
            result.setMessage("false");
            return result;          
        }   	
    }
      
}
