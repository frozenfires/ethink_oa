package com.ebring.platform.controller;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;


/**
 * 文件下载
 * @author Liujian
 *
 */
@Controller
public class DownloadController {
	/**
	 * Logger for this class
	 */

	@Value("${app.workdir}")
	private String workdir;
	private static final Logger log = Logger.getLogger(DownloadController.class);
	
	private static List<File> files = new ArrayList<File>();

	@RequestMapping("download.do")
	@ResponseBody
	public void download(String reportName, HttpServletRequest request, HttpServletResponse response) {       
        	if (StringUtils.isEmpty(reportName)) {
        		return;
        	}
        	log.debug("reportName : " + reportName);
        	String path = request.getParameter("path");
        	//path = request.getSession().getServletContext().getRealPath(path);
        	path=workdir+path;
        	log.debug("path : " + path);
        	downFile(request,path,reportName,response);
        	
	}
	
	public void downFile(HttpServletRequest request,String relroot, String reportName,HttpServletResponse response){
		try {
			File filedow = new File(relroot,reportName);
			files.add(filedow);
	    	response.setContentType("application/vnd.ms-excel");
	    	response.addHeader("Content-Disposition", "attachment;filename=" + new String(filedow.getName().getBytes("gbk"),"iso-8859-1"));  //转码之后下载的文件不会出现中文乱码
	    	response.addHeader("Content-Length", "" + filedow.length()); 
			InputStream fis = new BufferedInputStream(new FileInputStream(filedow));
			byte[] buffer = new byte[fis.available()];
			fis.read(buffer);
			fis.close();
			OutputStream toClient = new BufferedOutputStream(response.getOutputStream());
			toClient.write(buffer);
			toClient.flush();
			toClient.close();
		}catch (Exception e) {
			log.error("", e);
		} finally {						
			String path = request.getSession().getServletContext().getRealPath(relroot);
			log.debug("系统的绝对path : " + path);
	}
	
	}
}
