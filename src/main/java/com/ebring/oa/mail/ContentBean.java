package com.ebring.oa.mail;

public class ContentBean {

	private String mailPath;
	private String mailTitle;
	private String mailContent;
	private String mailflag;
	public String getMailflag() {
		return mailflag;
	}

	public void setMailflag(String mailflag) {
		this.mailflag = mailflag;
	}

	public String getMailPath() {
		return mailPath;
	}

	public void setMailPath(String mailPath) {
		this.mailPath = mailPath;
	}

	public String getMailTitle() {
		return mailTitle;
	}

	public void setMailTitle(String mailTitle) {
		this.mailTitle = mailTitle;
	}

	public String getMailContent() {
		return mailContent;
	}

	public void setMailContent(String mailContent) {
		this.mailContent = mailContent;
	}

	@Override
	public String toString() {
		return "ContentBean [mailPath=" + mailPath + ", mailTitle=" + mailTitle + ", mailContent=" + mailContent + "]";
	}
}