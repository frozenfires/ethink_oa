package com.ebring.tcrc.trans.login;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.Subject;

import com.ebring.platform.common.license.TCREntry;
import com.ebring.tcrc.common.UserInfo;
import com.ebring.tcrc.trans.base.dao.ITcrcBaseManageDao;

/**
 * 自建的登录验证方法
 * @author Administrator
 *
 */
public class MyShiroRealm extends AuthorizingRealm{

	private static final Logger log = Logger.getLogger(MyShiroRealm.class);
	
	private ITcrcBaseManageDao tcrcBaseManageDao;
	
	// 获取授权信息
	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
		if(log.isDebugEnabled()){
			log.debug("MyShiroRealm doGetAuthorizationInfo.");
		}
		
		String userid = (String) principals.fromRealm( 
		         getName()).iterator().next(); 
		
		  
		return null;
	}

	//获取认证信息
	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(
			AuthenticationToken authcToken ) throws AuthenticationException {
		//参数authcToken中存储着输入的用户和密码
		if(log.isDebugEnabled()){
			log.debug("MyShiroRealm doGetAuthenticationInfo.");
		}
		
		if(!TCREntry.validate()){
			log.error("License valid fail!");
			return null;
		}
		//将接受的参数强转成可用的UsernamePasswordToken类型
		UsernamePasswordToken token = (UsernamePasswordToken) authcToken; 
		System.out.println("host:"+token.getHost());
		
	      // 通过表单接收的用户名
	      String userid = token.getUsername(); 
	      //将token.getPassword()转换成String类型
	      String password=String.valueOf(token.getPassword());
	      String ip=token.getHost();
	      
	      UserInfo userInfo= getUserInfo(userid,password,ip);
	      //得到当前正在执行的用户
		  Subject currentUser = SecurityUtils.getSubject();
		  //给当前currentUser会话中设置属性为UserInfo的表单接收对象userinfo
		  currentUser.getSession().setAttribute("UserInfo", userInfo);
		  log.debug("userInfo=" + userInfo);
		  
		  if(userInfo!=null){
			  return new SimpleAuthenticationInfo(userInfo,  
					  userInfo.getPassword(),userid);
		  }
		  
	
		return null;
	}

	public ITcrcBaseManageDao getTcrcBaseManageDao() {
		return tcrcBaseManageDao;
	}

	public void setTcrcBaseManageDao(ITcrcBaseManageDao tcrcBaseManageDao) {
		this.tcrcBaseManageDao = tcrcBaseManageDao;
	}

	//此注解用于抑制编码器产生多类警告信息，过多的警告信息可能会对程序员造成误判
    @SuppressWarnings({ "rawtypes", "unchecked" })
	private UserInfo getUserInfo(String userid,String password,String ip){
    	UserInfo userInfo=null;
    	
    	Map  parameterMap=new HashMap();
		parameterMap.put("USER_ID_P", userid);
		List<Map> list=tcrcBaseManageDao.selectUserDetail(parameterMap);
		if(list.size()>0){
			//判断该用户是否被冻结
			//List<Map> list0=tcrcBaseManageDao.isFreeze(parameterMap);
			
			/*if(list0.size()==0){
				throw new LockedAccountException();
			}*/
			userInfo=new UserInfo();
			Map map=list.get(0);
			//判断该用户是否被冻结,aa为从库中查出的FREEZE_USER的状态
			String aa = (String)map.get("FREEZE_USER");
			if("冻结".equals(aa)){
				throw new LockedAccountException();
			}
			userInfo.setUserID(userid);
			userInfo.setPassword((String)map.get("PASSWORD"));
			userInfo.setUserName((String)map.get("USER_NAME_P"));
			userInfo.setOrgID((String) map.get("org_id_p".toUpperCase()));
			userInfo.setOrgName((String)map.get("ORG_NAME_P"));
			userInfo.setOrgAdmin((String)map.get("ORG_ADMIN_P"));
		}
		else{
			// 用户不存在
			throw new UnknownAccountException();
		}
		
    	return userInfo;
    }
	
}
