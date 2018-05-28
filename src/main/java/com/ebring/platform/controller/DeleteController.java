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

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;


/**
 * 文件下载
 * @author majie
 *
 */
@Controller
public class DeleteController {
	/**
	 * Logger for this class
	 */
	private static final Logger log = Logger.getLogger(DeleteController.class);		
	   /**
     * 删除单个文件
     *
     * @param fileName 要删除的文件的文件名
     * @return 单个文件删除成功返回true，否则返回false
     */
    @RequestMapping("delete.do")
    @ResponseBody
    public static void deleteFile(HttpServletRequest request, HttpServletResponse response, String reportName) {
        if (StringUtils.isEmpty(reportName)) {
            return;
        }
        log.debug("reportName : " + reportName);
        String path = request.getParameter("path");
        String deleteFlag = request.getParameter("FLAG");
        path = request.getSession().getServletContext().getRealPath(path);
        File file = new File(path, reportName);
        // 如果文件路径所对应的文件存在，并且是一个文件，则直接删除

        if (deleteFlag.equals("T_DELETE")) {//真删除
            if (file.exists() && file.isFile()) {
                if (file.delete()) {
                    log.debug("删除单个文件" + reportName + "成功！");
                    return;
                } else {
                    log.debug("删除单个文件" + reportName + "失败！");
                    return;
                }
            } else {
                log.debug("删除单个文件失败：" + reportName + "不存在！");
                return;
            }
        } else {
            return;
        }


    }

}
