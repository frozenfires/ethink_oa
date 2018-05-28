/**
 * Ebring 2003 copyright
 * 
 */
package com.ebring.platform.controller;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.AccessException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.ebring.platform.exception.TimeoutException;
import com.ebring.tcrc.common.Result;
import com.ebring.tcrc.common.UserInfo;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;

/**
 * @author wangjing.dc@qq.com
 * 
 *         描述:视图控制器,负责视图界面内容的组织
 */
@Controller
public class ViewController {
	private static final Logger log = Logger.getLogger(ViewController.class);
	
	
	
	@Autowired
	private ITcrcBaseManageDao tcrcBaseManageDao;
	
	@RequestMapping(value="/api/v/{viewid}")
	public ModelAndView handle(HttpServletRequest req, HttpServletResponse res,
			@PathVariable String viewid) {
		
		log.info("request viewid = " + viewid);
		ModelAndView retView = new ModelAndView("/404.html");
		Result result=new Result();
		result.setSuccess(false);
		
		try{
			if(!SecurityUtils.getSubject().isAuthenticated()){
				throw new TimeoutException("登录超时");
			}
			
			Map<String, String> param = new HashMap<String, String>();
			param.put("MODULE_ID", viewid);
			List<Map> ret = tcrcBaseManageDao.selectResourceDetail(param);
			
			if(null != ret && ret.size() > 0){
				Map map = ret.get(0);
				auth(map);
				Object url = map.get("MODULE_URL");
				if(url != null && url instanceof String){
					log.debug("准备装载视图:" + url);
					retView = new ModelAndView((String) url);
				}
			}
		}
		catch(TimeoutException e){
			log.error(null, e);
			retView = new ModelAndView("/platform/message.jsp");
			retView.addObject("msgtype", "timeout");
		}
		catch(AccessException e){
			log.error(null, e);
			retView = new ModelAndView("/platform/message.jsp");
			retView.addObject("msgtype", "error");
			retView.addObject("msg", e.getMessage());
		}
		catch(Throwable e){
			String msg = "没有找到"+viewid+"对应的视图url";
			log.error(msg, e);
			
			retView = new ModelAndView("/platform/message.jsp");
			retView.addObject("msgtype", "error");
			retView.addObject("msg", msg);
		}
		
		return retView;
	}
	
	/**
	 * 校验是否有权限打开视图
	 * @param view
	 * @throws AccessException
	 */
	private void auth(Map view) throws AccessException {
		Subject currentUser = SecurityUtils.getSubject();
		UserInfo userInfo = (UserInfo) currentUser.getSession().getAttribute(
				"UserInfo");
		String errmsg = "";
		Object auth = view.get("AUTH");
		String[] authArray = new String[]{};
		if(auth != null && auth instanceof String){
			authArray = ((String)auth).split(",");
		}
		if(userInfo != null && Arrays.binarySearch(authArray, "device") > -1){
			String accountid = userInfo.getAccountID();
			String orgid = userInfo.getOrgID();
			if(accountid == null || "".equals(accountid)){
				errmsg = "未找到设备，请检查设备是否已添加！";
			}
			else if(orgid == null || "".equals(orgid)){
				errmsg = "用户信息不完整，没有所属机构！";
			}
			else{
				return;
			}
			
			throw new AccessException(errmsg);
		}
	}
}
