package com.ebring.platform.common.page;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 分页信息
 */
public class PageBean {
	private int count;
	private List list = new ArrayList();
	public String pageBeanName = "pageBean";
	private int offset = 0;
	private int limit = 0;
	private int totalPage = 0;
    private int sEcho=0;
	private int pageSize = 0;

	public PageBean(Map paramMap) {
		pageParamAdapter(paramMap);
		paramMap.put(pageBeanName, this);
	}

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

	public List getList() {
		return list;
	}

	public void setList(List list) {
		this.list = list;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public int getTotalPage() {
		return totalPage;
	}

	public void setTotalPage(int totalPage) {
		this.totalPage = totalPage;
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map getResult() {
		Map result = new HashMap();
		 result.put("sEcho", sEcho);
		 result.put("iTotalRecords", count);
		 result.put("iTotalDisplayRecords", count);
		 result.put("aaData", list);
		 
		return result;
	}

	/**
	 * 对分页表格上送参数的适配，因为如果使用不同的表格控件，上送的分页信息的key是不同的， 该方法的目的是作统一的处理.
	 * 
	 * @param paramMap
	 */
	public void pageParamAdapter(Map paramMap) {

		if (paramMap.get("iDisplayStart") != null) {
			offset = Integer.parseInt(String.valueOf(paramMap
					.get("iDisplayStart")));
		}

		if (paramMap.get("iDisplayLength") != null) {
			limit = Integer.parseInt(String.valueOf(paramMap
					.get("iDisplayLength")));
			this.pageSize=limit;
		}
		if (paramMap.get("sEcho") != null) {
			sEcho = Integer.parseInt(String.valueOf(paramMap
					.get("sEcho")));
		}

	}

	public RowLimit getRowLimit() {
		RowLimit rowlimit = new RowLimit(offset, limit);
		return rowlimit;
	}

}