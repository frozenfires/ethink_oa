package com.ebring.platform.controller;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.ebring.tcrc.common.Global;
import com.ebring.tcrc.common.Result;

/**
 * 文件上传, 附带执行服务请求
 * {
 * 		fileName: '',
 * 		filePath: '',
 * 		maxSize: '' ,// 文件大小限制单位mb
 *     SERVICE: '', // 服务名称
 *     ... 服务参数
 * }
 * 
 * @author wangjingjing.dc@qq.com
 */
@Controller
@RequestMapping("/uploadFile.do")
public class FileUploadController extends AbstractController.DefaultController {
	
	@SuppressWarnings("rawtypes")
	private class RequestParamterConver extends HashMap{
		private static final long serialVersionUID = 1L;
		
		@SuppressWarnings("unchecked")
		public RequestParamterConver(Map map){
			super(map);
		}
		/* (non-Javadoc)
		 * @see java.util.HashMap#get(java.lang.Object)
		 */
		@Override
		public Object get(Object key) {
			Object v = super.get(key);
			if(v instanceof Object[]){
				return ((Object[])v)[0];
			}else{
				return v;
			}
		}
		
		public String toString(){
			StringBuilder sb = new StringBuilder("{");
			for( Iterator it = this.keySet().iterator(); it.hasNext();){
				Object key = it.next();
				sb.append(key).append("=");
				sb.append(this.get(key));
				if(it.hasNext())
					sb.append(",");
			}
			sb.append("}");
			
			return sb.toString();
		}
	}
	
	private static final Logger log = Logger
			.getLogger(FileUploadController.class);
	
	/**
	 * 
	 * @param file
	 * @param param
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(params = "method=uploads", method = RequestMethod.POST)
	public @ResponseBody Object uploads(MultipartFile file,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		
		Map<String, Object> param =  new RequestParamterConver(request.getParameterMap());
		
		Result result = this.checkFile(file, param);
		if(!result.isSuccess()){// 校验失败，直接返回
			return result;
		}
		
		String fileContent = this.saveFile(file, request, param);
		param.put("fileContent", fileContent);
		
		// 执行附带服务
		String serviceName = (String) param.get(Global.SERVICE);
		if(serviceName != null && !"".equals(serviceName)){
			return super.doServices(serviceName, param, request);
		}
		
		result.setSuccess(true);
		return result.getResult().toString();
	}
	
	/**
	 * 上传文件并转会为base64编码
	 * @return
	 */
	@SuppressWarnings({ "restriction", "unchecked" })
	@RequestMapping(params = "method=uploadBase64", method = RequestMethod.POST)
	public @ResponseBody Object uploadBase64(MultipartFile file,
			HttpServletRequest request) {
		
		Map<String, Object> param = new RequestParamterConver(request.getParameterMap());
		
		log.debug("----------------------------------------" + param);
		Result result = this.checkFile(file, param);
		if(!result.isSuccess()){// 校验失败，直接返回
			return result.getResult().toString();
		}
		
		try {
			String fileContent = new sun.misc.BASE64Encoder().encode(file.getBytes());
			param.put("fileContent", fileContent);
		} catch (IOException e) {
			log.error("文件处理出错", e);
			result.setSuccess(false);
			result.setMessage("文件处理出错");
			return result.getResult().toString();
		}
		
		// 执行附带服务
		this.addCommonParameter(param, request);
		String serviceName = (String) param.get(Global.SERVICE);
		if(serviceName != null && !"".equals(serviceName)){
			try{
				return super.doServices(serviceName, param, request).getResult().toString();
			}catch(Throwable e){
				log.error(serviceName+"服务处理出错", e);
				result.setSuccess(false);
				result.setMessage(serviceName+"服务处理出错");
				return result.getResult().toString();
			}
		}
		
		result.setSuccess(true);
		return result.getResult().toString();
		
	}
	

	/**
	 * 检验文件合法性校验
	 * 
	 * @param request
	 * @return
	 */
	private Result checkFile(MultipartFile file, Map<String, Object> param) {
		Result result = new Result();

		// 文件预设上传大小
		int fileMaxsize = Integer.parseInt((String) param.get("imgSize"));
		int fileMaxsizeMB = fileMaxsize * 1024 * 1024;
		long fileSize = file.getSize();
		log.info("文件大小为:" + fileSize + ",限制文件大小:" + fileMaxsize + "MB");
		if (fileSize > fileMaxsizeMB) {
			result.setSuccess(false);
			result.setMessage("上传文件不能超过" + fileMaxsize + "MB!");

		} else {
			result.setSuccess(true);
		}

		return result;
	}

	/**
	 * 保存上传文件。
	 * 
	 */
	public String saveFile(MultipartFile file, HttpServletRequest request,
			Map<String, Object> param) throws IllegalStateException,
			IOException {

		// 保存用的文件名
		String fileName = (String) param.get("imgName");
		// 文件保存路径
		String path = (String) param.get("imgPath");

		String parent = request.getSession().getServletContext().getRealPath(path);
		File targetFile = new File(parent, fileName);
		String imagePath = path + "/" + fileName;

		if (!targetFile.exists()) {
			targetFile.mkdirs();
		}
		file.transferTo(targetFile);

		return imagePath;
	}


}
