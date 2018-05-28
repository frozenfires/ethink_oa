package com.ebring.platform.controller;

import java.io.File;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.ebring.tcrc.common.Result;

/**
 * 图片上传
 * @author zxing
 */
@Controller
@RequestMapping("/images.do")
public class ImageUploadController
{
	private static final Logger log = LoggerFactory.getLogger(ImageUploadController.class);
	
	@RequestMapping(params = "method=uploads", method = RequestMethod.POST)
	public @ResponseBody Object uploads(MultipartFile file,
		            HttpServletRequest request, HttpServletResponse response) throws Exception{
		Result result = new Result();
		try
		{	
			log.debug("ImageUploadController start...");
			// 文件预设上传大小
			int imageSize = Integer.parseInt(request.getParameter("imgSize"));
			int imgSize = imageSize*1024*1024;
			// 文件预设格式
			String imgFormat = request.getParameter("imgFormat");
			// 上传文件后缀名
			String imgSuffix = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
			// 保存用的文件名
			String imgName = request.getParameter("imgName") + imgSuffix;
			// 文件保存路径
			String path = request.getParameter("imgPath");
			// 判断上传文件大小
			if(file.getSize() > imgSize){
				result.setSuccess(false);
				result.setMessage("上传文件不能超过" + imageSize + "MB!");
				log.error("上传文件不能超过" + imageSize + "MB!");
			// 判断上传文件类型
			}else if(!imgFormat.equals(imgSuffix)){
				result.setSuccess(false);
				result.setMessage("上传文件只能是" + imgFormat + "格式!");
				log.error("上传文件只能是" + imgFormat + "格式!");
			}else{
				String imgPath = uploadSpringMVCfile(file, request, path, imgName);
				log.debug("服务器保存图片地址: " + imgPath);
				result.setSuccess(true);
			}
			
		} catch (Exception e){
			result.setSuccess(false);
			result.setMessage("文件上传失败！");
			log.error(null, e);
			
		}
		return result.getResult().toString();
	}
	
	/**
	 * mutifile上传文件方法
	 * @param file
	 * @param request
	 * @param relroot
	 * @return
	 */
	public static String uploadSpringMVCfile(MultipartFile file,HttpServletRequest request,String relroot, String fileName){
		if (file.getSize()>0) {
			String path = request.getSession().getServletContext().getRealPath(relroot);
			File targetFile = new File(path, fileName);
			String imagePath = relroot + "/" + fileName;
			if (!targetFile.exists()) {
				targetFile.mkdirs();
			}
			try {
				file.transferTo(targetFile);
			} catch (Exception e) {
				e.printStackTrace();
			}
			return imagePath;
		}else{
			return null;
		}	
	}
	
}
