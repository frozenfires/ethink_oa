package com.ebring.tcrc.common;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * File工具类
 * @author Liujian
 *
 */
public class FileUtil {

	/**
	 * 写文件
	 * @param filePath 文件路径
	 * @param boo 是否追加写入，TRUE追加，false不追加
	 * @param content 字符内容
	 * @param coding 编码格式
	 */
	public static void write(File file, boolean boo, String content, String coding) {
		try {
			OutputStreamWriter writer = new OutputStreamWriter(new FileOutputStream(file, boo), coding);
			writer.write(content);
			writer.flush();
			writer.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * @param baseDir
	 *            所要压缩的目录名（包含绝对路径）
	 * @param objFileName
	 *            压缩后的文件名
	 * @throws Exception
	 */
	public static void createZip(String baseDir, String objFileName) throws Exception {
		File folderObject = new File(baseDir);
		if (folderObject.exists()) {
			List fileList = getSubFiles(new File(baseDir));
			// 压缩文件名
			ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(objFileName));
			ZipEntry ze = null;
			byte[] buf = new byte[1024];
			int readLen = 0;
			for (int i = 0; i < fileList.size(); i++) {
				File f = (File) fileList.get(i);
				// 创建一个ZipEntry，并设置Name和其它的一些属性
				ze = new ZipEntry(getAbsFileName(baseDir, f));
				ze.setSize(f.length());
				ze.setTime(f.lastModified());
				// 将ZipEntry加到zos中，再写入实际的文件内容
				zos.putNextEntry(ze);
				InputStream is = new BufferedInputStream(new FileInputStream(f));
				while ((readLen = is.read(buf, 0, 1024)) != -1) {
					zos.write(buf, 0, readLen);
				}
				is.close();
			}
			zos.close();
		} else {
			throw new Exception("this folder isnot exist!");
		}
	}
	
	/**
	 * 给定根目录，返回另一个文件名的相对路径，用于zip文件中的路径.
	 * 
	 * @param baseDir
	 *            java.lang.String 根目录
	 * @param realFileName
	 *            java.io.File 实际的文件名
	 * @return 相对文件名
	 */
	private static String getAbsFileName(String baseDir, File realFileName) {
		File real = realFileName;
		File base = new File(baseDir);
		String ret = real.getName();
		while (true) {
			real = real.getParentFile();
			if (real == null)
				break;
			if (real.equals(base))
				break;
			else {
				ret = real.getName() + "/" + ret;
			}
		}
		return ret;
	}
	
	/**
	 * 取得指定目录下的所有文件列表，包括子目录.
	 * 
	 * @param baseDir
	 *            File 指定的目录
	 * @return 包含java.io.File的List
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	private static List getSubFiles(File baseDir) {
		List ret = new ArrayList();
		File[] tmp = baseDir.listFiles();
		for (int i = 0; i < tmp.length; i++) {
			if (tmp[i].isFile()) {
				ret.add(tmp[i]);
			}
			if (tmp[i].isDirectory()) {
				ret.addAll(getSubFiles(tmp[i]));
			}
		}
		return ret;
	}
	
	public static void main(String[] args) {
		Properties props = System.getProperties(); //获得系统属性集    
		String osVersion = props.getProperty("os.version"); //操作系统版本  
		System.out.println(osVersion);
	}

}
