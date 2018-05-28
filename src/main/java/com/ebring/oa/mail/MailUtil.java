package com.ebring.oa.mail;

import java.util.Properties;
import javax.mail.Authenticator;
import javax.mail.Message.RecipientType;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.ebring.oa.event.EventListenerService;


/**
 * 邮件发送
 * 
 * @author df
 *
 */
public class MailUtil {

	private static Logger log = LoggerFactory.getLogger(EventListenerService.class);

	/**
	 * 邮件发送
	 * 
	 * @param1 mailContent 邮件内容
	 * @param2 toMail 邮件接收人 不需要传后缀
	 * @param3 mailTitle 邮件主题
	 * @return 执行结果 true/false
	 * @throws MessagingException
	 * 
	 */
	public boolean sendMail(String mailContent, String toMail, String mailTitle) {
		Properties props = new Properties();
		// 表示SMTP发送邮件，必须进行身份验证
		props.put("mail.smtp.auth", "true");
		// 此处填写SMTP服务器
		props.put("mail.smtp.host", "smtp.exmail.qq.com");
		// 端口号，QQ邮箱给出了两个端口，但是另一个我一直使用不了，所以就给出这一个587
		props.put("mail.smtp.port", "587");
		// 此处填写你的账号
		props.put("mail.user", "service@ethinkbank.com");
		// 此处的密码就是前面说的16位STMP口令
		props.put("mail.password", "A1b2c3d4");
		// 构建授权信息，用于进行SMTP进行身份验证
		Authenticator authenticator = new Authenticator() {

			protected PasswordAuthentication getPasswordAuthentication() {
				// 用户名、密码
				String userName = props.getProperty("mail.user");
				String password = props.getProperty("mail.password");
				return new PasswordAuthentication(userName, password);
			}
		};
		// 使用环境属性和授权信息，创建邮件会话
		Session mailSession = Session.getInstance(props, authenticator);
		// 创建邮件消息
		MimeMessage message = new MimeMessage(mailSession);
		// 设置发件人
		try {
			InternetAddress form = new InternetAddress(props.getProperty("mail.user"));
			message.setFrom(form);
			
			// 设置收件人的邮箱
			InternetAddress to = new InternetAddress(toMail);
			//InternetAddress to = new InternetAddress("dingfan" + "@ethinkbank.com");
			message.setRecipient(RecipientType.TO, to);
			// 设置邮件标题
			message.setSubject(mailTitle);
			// 设置邮件的内容体

		//	String contentDeal = contentDeal(mailContent);
			message.setContent(mailContent, "text/html;charset=UTF-8");
			// 最后当然就是发送邮件啦
			Transport.send(message);
		} catch (MessagingException e) {
			log.info("邮件发送失败,请核对用户邮箱是否在正确" + e.getMessage());
			return false;
		}
		log.info("邮件已发送,收件人为：" + toMail);

		System.out.println("********" + mailTitle + "***************" + mailContent.toString());
		return true;
	}


}
