package com.ebring.platform.controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

public class SecurityController implements Controller{

	
	public boolean authentication(HttpServletRequest req, HttpServletResponse res)
	  {
		
		
		
		return false;
	  }
	
	
	 public ModelAndView errorHand(HttpServletRequest req, HttpServletResponse res)
			    throws ServletException, IOException
			  {
			    return new ModelAndView("login.html");
			  }
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest req,
			HttpServletResponse res) throws Exception {

		System.out.println("SecurityController handleRequest...");
		
		 if (authentication(req, res)) {
			return handle(req,res);
		 }
		 return errorHand(req, res);
	}

	public ModelAndView handle(HttpServletRequest req, HttpServletResponse res)
		    throws ServletException, IOException
		  {
		    return null;
		  }

}
