package com.ebring.platform.log;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

import org.apache.log4j.RollingFileAppender;

import com.ebring.tcrc.common.Util;

public class ServerAppender extends RollingFileAppender {
	
	public ServerAppender(){
		super();
	}
	
	// 文件路径
	private String linuxFile;
	public void setLinuxFile(String linuxFile) {
		this.linuxFile = linuxFile;
	}
	
	
	// 根据判断结果传入路径参数
	public synchronized void setFile(String fileName,  boolean append, boolean bufferedIO, int bufferSize) throws IOException{
		// 获取当前操作系统信息
		Boolean isWindow = Util.isWindow();
		Boolean isLinux = Util.isLinux();
		
		if(isWindow == true){
			fileName = this.getFile();
		}else if(isLinux == true){
			Boolean boo = linuxFile.contains("{user.home}");
			if(boo){
				linuxFile = linuxFile.replace("{user.home}", System.getProperty("user.home"));
			}
			fileName = linuxFile;
		}
		
		File file = new File(fileName);
		Files.createDirectories(file.toPath());
		
		if(!file.exists()){
			file.createNewFile();
			System.out.println("文件已成功创建："+fileName);
		}else{
			System.out.println("文件已存在："+fileName);
		}
		
		super.setFile(fileName, append, bufferedIO, bufferSize);
	}
}
