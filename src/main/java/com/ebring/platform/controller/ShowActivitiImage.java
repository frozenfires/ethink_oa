/**
 * 
 */
package com.ebring.platform.controller;

import java.io.InputStream;
import java.io.OutputStream;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import org.activiti.engine.RepositoryService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author fan
 *
 */
@Controller
public class ShowActivitiImage {
	@Resource
	private RepositoryService repositoryService;
	

	@RequestMapping("/showView.action")
	public String showView(String deploymentId,String diagramResourceName,HttpServletResponse response)throws Exception{
		InputStream inputStream=repositoryService.getResourceAsStream(deploymentId, diagramResourceName);
		OutputStream out=response.getOutputStream();
		for(int b=-1;(b=inputStream.read())!=-1;){
			out.write(b);
		}
		out.close();
		inputStream.close();
		return null;
	}
}
