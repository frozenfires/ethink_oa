<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!--noView-->
<script type="text/javascript">
(function(){
	<%
		response.addHeader("Cache-Control", "no-store, must-revalidate"); 
    	response.addHeader("Expires", "thu, 01 Jan 1970 00:00:01 GMT");
		String msgtype = (String)request.getAttribute("msgtype");
		String msg = (String)request.getAttribute("msg");
		String basepath=request.getContextPath();
	%>

	var msgtype = '<%=msgtype%>',
	    msg = '<%=msg%>',
	    basePath = '<%=basepath%>';

	alert(msgtype);
	if(msgtype === 'error'){
		Alert.error(msg);
	}
	else if(msgtype === 'timeout'){
		window.top.location = basePath+"/login.html";
	}
	
})();

</script>