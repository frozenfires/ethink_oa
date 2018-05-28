/**
 * Ebring 2003 copyright
 * 
 */
package com.ebring.platform.log;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.log4j.DailyRollingFileAppender;
import org.apache.log4j.helpers.LogLog;
import org.apache.log4j.helpers.OptionConverter;
import org.apache.log4j.spi.LoggingEvent;

import com.google.common.io.Files;

/**
 *
 * 描述: 按时间周期产生日志文件
 * 将过期的日志文件自动压缩备份起来。
 * 使用备份功能需要配置属性 BackupFile
 * @author wangjing.dc@qq.com
 */
public class EthinkAppender extends DailyRollingFileAppender{

	// 备份文件名称
	private String backupFile;
	// 备份文件最大 默认500M
	private String backupMaxSize;//500*1024*1024;
	// 是否处于激活状态，非激活状态下不记录日志
	private boolean active = false;
	// linux 文件路径
	private String linuxFile;

	public EthinkAppender(){
		super();
	}

	public String getLinuxFile() {
		return new File(linuxFile).getParent();
	}
	
	public void setLinuxFile(String linuxFile) {
		this.linuxFile = linuxFile;
	}
	/**
	 * 激活Appender
	 */
	public void activeAppender(){
		this.active = true;
	}
	
	@Override
	public void activateOptions() {
		super.activateOptions();
	}
	
	public String getFilePath() {
		return new File(this.getFile()).getParent();
	}
	
	@Override
	public void setFile(String file) {
		super.setFile(file);
	}

	public void setBackupFile(String backupFile) {
		this.backupFile = backupFile;
	}
	
	public String getBackupMaxSize() {
		return backupMaxSize;
	}

	public void setBackupMaxSize(String backupMaxSize) {
		this.backupMaxSize = backupMaxSize;
	}
	
	@Override
	public void append(LoggingEvent event){
		if(this.active){
			super.append(event);
		}
	}

	@Override
	public synchronized void setFile(String fileName, boolean append,
			boolean bufferedIO, int bufferSize) throws IOException {
		if(this.active){
			LogLog.debug("当前日志存储路径------------>" + (new File(fileName)).getAbsolutePath());
			
			File file = new File(fileName);
			Files.createParentDirs(file);
//			System.out.println("文件不存在？："+!file.exists());
			if(!file.exists()){
				file.createNewFile();
				System.out.println("文件已成功创建："+fileName);
			}else{
				System.out.println("文件已存在："+fileName);
			}
			
			
			super.setFile(fileName, append, bufferedIO, bufferSize);
		}
	}

	@Override
	protected void subAppend(LoggingEvent event) {
		if(active){
			super.subAppend(event);
			if(this.backupFile != null && !"".equals(this.backupFile)){
				removeMaxedBackupFiles();
				backupLogfiles();
			}
		}
	}

	/**
	 * 删除超过备份周期的文件
	 */
	private void removeMaxedBackupFiles() {
		File file = new File(this.backupFile);
		
		long defaultsize = 500*1024*1024;
		long maxSize = OptionConverter.toFileSize(backupMaxSize, defaultsize + 1);
		if(file.exists() && file.isFile() && file.length() >= maxSize){
			String newFile = this.backupFile + ".1";
			new File(newFile).deleteOnExit();
			file.renameTo(new File(newFile));
		}
	}

	/**
	 * 备份日志文件
	 */
	private void backupLogfiles() {
		String zipFile = backupFile;

		if(zipFile==null){
			LogLog.error("没有设置备份文件属性[backupFile] or [backupFile4linux]，无法备份文件");
			return;
		}
		
		try {
			List<File> backupfiles = findBackupfiles();
			if (backupfiles.size() > 0) {
				File zip = new File(zipFile);
				Files.createParentDirs(zip);
				ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(
						zip));

				for (File file : backupfiles) {
					FileInputStream fis = new FileInputStream(file);
					String entryname = name + "/" + file.getName();
					LogLog.debug("next entryname=" + entryname);
					ZipEntry entry = new ZipEntry(entryname);
					zos.putNextEntry(entry);
//					FileUtil.copyStream(fis, zos);
					Files.copy(file, zos);

					zos.closeEntry();
					fis.close();
				}
				zos.flush();
				zos.finish();
				zos.close();
				
				for (File file : backupfiles) {
					file.deleteOnExit();
				}
			}

		} catch (Exception e) {
			LogLog.error("备份日志文件出错", e);
		}
	}
	
	/**
	 * 过滤需要备份的日志文件。
	 * @return
	 */
	private List<File> findBackupfiles() {
		List<File> files = new ArrayList<File>();
		
		File mainFile = new File(this.fileName);
		File[] list = mainFile.getParentFile().listFiles();
		for (int i = 0; list!=null && i < list.length; i++) {
			File f = list[i];
			
			if (f.exists() && f.isFile()) {
				int dotIndex = f.getName().lastIndexOf(".");
				String suffix = f.getName().substring(dotIndex+1);
//				String name = f.getName().substring(0,dotIndex);
//				if(suffix.startsWith("log") && suffix.length() > 3){
				if(suffix.length() > 3){
					files.add(f);
				}
			}
		}
		
		return files;
	}
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		try {
			String filename="abc.zip";
			String sourcefile="abc.txt";
			ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(filename));
			ZipEntry entry=new ZipEntry("acd/abc.txt");
			zos.putNextEntry(entry);
			
//			FileUtil.copyStream(new FileInputStream(new File(sourcefile)), zos);
			Files.copy(new File(sourcefile), zos);
			
			zos.flush();
			zos.closeEntry();
			zos.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	
}
