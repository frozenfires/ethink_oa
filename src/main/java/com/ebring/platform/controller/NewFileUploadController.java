package com.ebring.platform.controller;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;

/**
 * 文件上传
 * @author zxing
 */
@Controller
@RequestMapping("/file.do")
public class NewFileUploadController
{
	@Value("${app.workdir}")
	private String workdir;
	@Resource
	private ITcrcBaseManageDao iTcrcBaseManageDao;
	private static final Logger log = LoggerFactory.getLogger(NewFileUploadController.class);
	
	public ITcrcBaseManageDao getiTcrcBaseManageDao() {
	        return iTcrcBaseManageDao;
	}

	public void setiTcrcBaseManageDao(ITcrcBaseManageDao iTcrcBaseManageDao) {
	        this.iTcrcBaseManageDao = iTcrcBaseManageDao;
	}
	
	
	@RequestMapping(params = "method=uploads", method = RequestMethod.POST)
	public @ResponseBody Object uploads(MultipartFile file,
		            HttpServletRequest request, HttpServletResponse response) throws Exception{
		Result result = new Result();
		try
		{	
			log.debug("NewFileUploadController start...");
			// 文件预设上传大小
			int fileSize = Integer.parseInt(request.getParameter("fiSize"));
			int filSize = fileSize*1024*1024;			
			// 上传文件后缀名
			String fileSuffix = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));	
			// 上传文件真实名称
			String fileName=file.getOriginalFilename();
											
			// 文件(图片)保存路径
			String path=request.getParameter("filePath");;
			if(path.split("/")[1].equalsIgnoreCase("image")){
				if(!fileSuffix.equalsIgnoreCase(".jif")&&!fileSuffix.equalsIgnoreCase(".jpg")&&!fileSuffix.equalsIgnoreCase(".JPEG")&&!fileSuffix.equalsIgnoreCase(".png")&&!fileSuffix.equalsIgnoreCase(".bmp")){
					result.setSuccess(false);
					result.setMessage("上传图片只能是jif/jpg/JPEG/png/bmp格式!");
					log.error("上传图片只能是jif/jpg/JPEG/png/bmp格式!");
					return result.getResult().toString();
				}
			}else if(path.split("/")[1].equalsIgnoreCase("file")){
				if(!fileSuffix.equalsIgnoreCase(".rar")&&!fileSuffix.equalsIgnoreCase(".zip")&&!fileSuffix.equalsIgnoreCase(".txt")&&!fileSuffix.equalsIgnoreCase(".et")&&!fileSuffix.equalsIgnoreCase(".xlsx")&&!fileSuffix.equalsIgnoreCase(".docx")&&!fileSuffix.equalsIgnoreCase(".doc")&&!fileSuffix.equalsIgnoreCase(".xls")&&!fileSuffix.equalsIgnoreCase(".ppt")&&!fileSuffix.equalsIgnoreCase(".pptx")){
					result.setSuccess(false);
					result.setMessage("上传文件只能是zip/rar/et/txt/xlsx/docx/doc/xls/ppt/pptx格式!");
					log.error("上传文件只能是zip/rar/et/txt/xlsx/docx/doc/xls/ppt/pptx格式!!");
					return result.getResult().toString();
				}								
			}else{
				result.setSuccess(false);
				result.setMessage("上传失败");
				log.error("上传失败!");
				return result.getResult().toString();
			}			
			
			log.debug("文件大小: " + getPrintSize(file.getSize()));
			//判断文件大小是否为0
			if(file.getSize()==0){
				result.setSuccess(false);
				result.setMessage("不能上传空文件！");
				log.error("不能上传空文件");
				return result.getResult().toString();
			// 判断上传文件大小是否大于5G
			}else if(file.getSize() > filSize){
				result.setSuccess(false);
				result.setMessage("上传文件不能超过" + fileSize + "MB!");
				log.error("上传文件不能超过" + fileSize + "MB!");
				return result.getResult().toString();			
			}else{
				boolean flag = uploadSpringMVCfile(file, request, path, fileName);
				if(!flag){
					result.setSuccess(false);
					result.setMessage("文件已存在,请重新上传！");		
					log.error("文件已存在,请重新上传");
					return result.getResult().toString();
				}else{
					path=path+"/"+fileName;
					log.debug("服务器保存文件地址: " + path+"/"+path);				
					result.setSuccess(true);	
					Map map=new TreeMap();
					map.put(path, getPrintSize(file.getSize()));
					//result.setContent(path+":"+getPrintSize(file.getSize()));
					result.setContent(map);
				}				
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
	public boolean uploadSpringMVCfile(MultipartFile file,HttpServletRequest request,String relroot, String fileName){		
			String path=workdir+relroot;						
			File fileDir=new File(path);
			if(fileDir.exists()){
				 System.out.println("dir exists");
			}else{
				 boolean a =fileDir.mkdirs();
				 if(a){
					 System.out.println("创建成果");
				 }else{
					 System.out.println("创建失败");
				 }
			}
			File targetFile = new File(path, fileName);
			
			if(targetFile.exists()){
				System.out.println("file exists");
				return false;
			}else{
				System.out.println("file not exists...create");
			}									
			try {
				file.transferTo(targetFile.getAbsoluteFile());
			} catch (Exception e) {
				e.printStackTrace();
			}
				return true;		
	}
	

		//UUID生成唯一文件名
	  public static String getId(){  
          String id=UUID.randomUUID().toString();//生成的id942cd30b-16c8-449e-8dc5-028f38495bb5中间含有横杠，<span style="color: rgb(75, 75, 75); font-family: Verdana, Arial, Helvetica, sans-serif; line-height: 20.7999992370605px;">用来生成数据库的主键id是很实用的。</span>  
          id=id.replaceAll("-", "");//替换掉中间的那个斜杠  
          return id;  
      }  
	
	  //获取文件大小(B,KB,MB,GB)
	  public String getPrintSize(long size) {
		    //如果字节数少于1024，则直接以B为单位，否则先除于1024，后3位因太少无意义
		    if (size < 1024) {
		      return String.valueOf(size) + "B";
		    } else {
		      size = size / 1024;
		    }
		    //如果原字节数除于1024之后，少于1024，则可以直接以KB作为单位
		    //因为还没有到达要使用另一个单位的时候
		    //接下去以此类推
		    if (size < 1024) {
		      return String.valueOf(size) + "KB";
		    } else {
		      size = size / 1024;
		    }
		    if (size < 1024) {
		      //因为如果以MB为单位的话，要保留最后1位小数，
		      //因此，把此数乘以100之后再取余
		      size = size * 100;
		      return String.valueOf((size / 100)) + "."
		          + String.valueOf((size % 100)) + "MB";
		    } else {
		      //否则如果要以GB为单位的，先除于1024再作同样的处理
		      size = size * 100 / 1024;
		      return String.valueOf((size / 100)) + "."
		          + String.valueOf((size % 100)) + "GB";
		    }
		  }

	 	  
}
