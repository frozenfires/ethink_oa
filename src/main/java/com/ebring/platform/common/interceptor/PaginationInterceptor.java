package com.ebring.platform.common.interceptor;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.DateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.ibatis.executor.parameter.ParameterHandler;
import org.apache.ibatis.executor.statement.StatementHandler;
import org.apache.ibatis.jdbc.SQL;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.ParameterMapping;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.plugin.Signature;
import org.apache.ibatis.reflection.DefaultReflectorFactory;
import org.apache.ibatis.reflection.MetaObject;
import org.apache.ibatis.reflection.ReflectorFactory;
import org.apache.ibatis.reflection.factory.DefaultObjectFactory;
import org.apache.ibatis.reflection.factory.ObjectFactory;
import org.apache.ibatis.reflection.wrapper.DefaultObjectWrapperFactory;
import org.apache.ibatis.reflection.wrapper.ObjectWrapperFactory;
import org.apache.ibatis.scripting.defaults.DefaultParameterHandler;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.RowBounds;
import org.apache.ibatis.type.TypeHandlerRegistry;


import com.ebring.platform.common.page.PageBean;
import com.ebring.platform.common.page.Dialect;
import com.ebring.platform.common.page.MySql5Dialect;
import com.ebring.platform.common.page.OracleDialect;

/**
 * Mybatis 物理分页插件
 * @author zhigq
 *
 */
@Intercepts({@Signature(type=StatementHandler.class,method="prepare",args={Connection.class})})
public class PaginationInterceptor implements Interceptor{

	private final static Log log = LogFactory.getLog(PaginationInterceptor.class);
    private static final ObjectFactory DEFAULT_OBJECT_FACTORY = (ObjectFactory) new DefaultObjectFactory();
    private static final ObjectWrapperFactory DEFAULT_OBJECT_WRAPPER_FACTORY = new DefaultObjectWrapperFactory();
    private static final ReflectorFactory DEFAULT_ReflectorFactory = new DefaultReflectorFactory();
    private static final String ORDERBY_BEGIN = "\\/\\*orderby";
    private static final String ORDERBY_END = "orderby\\*\\/";

    private DataBaseType dataBaseType;
    @Override
	public Object intercept(Invocation invocation) throws Throwable {
		StatementHandler statementHandler = (StatementHandler)invocation.getTarget();
		BoundSql boundSql = statementHandler.getBoundSql();
		MetaObject metaStatementHandler = MetaObject.forObject(statementHandler,DEFAULT_OBJECT_FACTORY,DEFAULT_OBJECT_WRAPPER_FACTORY, DEFAULT_ReflectorFactory);
		RowBounds rowBounds = (RowBounds)metaStatementHandler.getValue("delegate.rowBounds");
		if(rowBounds == null || rowBounds == RowBounds.DEFAULT){
			return invocation.proceed();
		}
		
	  
		Dialect dialect = null;
		
		/*
		Configuration configuration = (Configuration)metaStatementHandler.getValue("delegate.configuration");
		Dialect.Type databaseType  = null;
		try{
			databaseType = Dialect.Type.valueOf(configuration.getVariables().getProperty("dialect").toUpperCase());
		} catch(Exception e){
			//ignore
		}
		if(databaseType == null){
			throw new RuntimeException("the value of the dialect property in configuration.xml is not defined : " + configuration.getVariables().getProperty("dialect"));
		}
		
		
		
		switch(databaseType){
			case MYSQL:
				dialect = new MySql5Dialect();
				
		}
		*/
		
		if("oracle".equals(dataBaseType.getDataBaseType())){
			dialect=new OracleDialect();
		}else if("mysql".equals(dataBaseType.getDataBaseType())){
			dialect=new MySql5Dialect();
		}else if("sybase".equals(dataBaseType.getDataBaseType())){
			 PageBean pageBean=	(PageBean)metaStatementHandler.getValue("delegate.boundSql.parameterObject.pageBean");  
			 Connection connection = (Connection) invocation.getArgs()[0];  
			 MappedStatement mappedStatement = (MappedStatement) metaStatementHandler.getValue("delegate.mappedStatement");
			 String originalSql = (String)metaStatementHandler.getValue("delegate.boundSql.sql");
			 // 重设分页参数里的总页数等  
	         setPageParameter(originalSql, connection, mappedStatement, boundSql, pageBean); 
	         String sql=boundSql.getSql();	
	         executeProcedure(sql,connection,mappedStatement,boundSql,pageBean);
	         metaStatementHandler.setValue("delegate.boundSql.sql","select count(*) from BASE_USER");
	          List mpppings=boundSql.getParameterMappings();
	          for (Iterator it = mpppings.iterator(); it.hasNext();) {
	    	    it.next();
                it.remove();
	    	 }
	         return invocation.proceed();
		}
		
		
		String originalSql = (String)metaStatementHandler.getValue("delegate.boundSql.sql");
		metaStatementHandler.setValue("delegate.boundSql.sql", dialect.getLimitString(originalSql, rowBounds.getOffset(), rowBounds.getLimit()) );
		metaStatementHandler.setValue("delegate.rowBounds.offset", RowBounds.NO_ROW_OFFSET );
		metaStatementHandler.setValue("delegate.rowBounds.limit", RowBounds.NO_ROW_LIMIT );
		if(log.isDebugEnabled()){
			log.debug("生成分页SQL : " + boundSql.getSql());
		}
		 PageBean pageBean=	(PageBean)metaStatementHandler.getValue("delegate.boundSql.parameterObject.pageBean");  
		 Connection connection = (Connection) invocation.getArgs()[0];  
		 MappedStatement mappedStatement = (MappedStatement) metaStatementHandler.getValue("delegate.mappedStatement");
         // 重设分页参数里的总页数等  
         setPageParameter(originalSql, connection, mappedStatement, boundSql, pageBean); 
         return invocation.proceed();
	}

    
    private PreparedStatement executeProcedure(String sql,Connection connection,MappedStatement mappedStatement,BoundSql boundSql,PageBean pageBean){
    	PreparedStatement callStatement=null;
    	 ResultSet rs = null;
    	 List<Map> rowList=new ArrayList<Map>();
    	 int offset=0,limit=10;
    	 
    	  Map paramMap= (Map)boundSql.getParameterObject();
    	 
    		if (paramMap.get("iDisplayStart") != null) {
    			offset = Integer.parseInt(String.valueOf(paramMap
    					.get("iDisplayStart")));
    		}

    		if (paramMap.get("iDisplayLength") != null) {
    			limit = Integer.parseInt(String.valueOf(paramMap
    					.get("iDisplayLength")));
    		}
    		
    	 
    	 
    	try {
    		
		 callStatement=connection.prepareCall("{call splitpage(?,?,?)}");
		 String  pageSql=showSql(mappedStatement.getConfiguration(), boundSql);
		 // 对order by 语句做特殊处理
		 pageSql = pageSql.replaceAll(ORDERBY_BEGIN, "");
		 pageSql = pageSql.replaceAll(ORDERBY_END, "");
		 log.debug("pageSql====>" + pageSql);
         callStatement.setString(1, pageSql);
         callStatement.setInt(2, offset/limit+1);
         callStatement.setInt(3, limit);
    	
         rs= callStatement.executeQuery();
         
         ResultSetMetaData rsmd=   rs.getMetaData();
         List<String> columnNameList=new ArrayList<String>();
         for (int i = 1; i <= rsmd.getColumnCount(); i++) {
        	 columnNameList.add(rsmd.getColumnName(i));
		      }

        
         while(rs.next()){
        	 Map<String,String> rowMap=new HashMap<String,String>();
        	 for (int i = 0; i < columnNameList.size(); i++) {
        		 String columnName=columnNameList.get(i);
        		 String columnValue=rs.getString(columnName);
				 rowMap.put(columnName, columnValue);
			}
                 rowList.add(rowMap);
            }
		 
         
         
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			if(rs!=null){
				try {
					rs.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			if(callStatement!=null){
				try {
					callStatement.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			
		}
	
    	
    	
    	 pageBean.setList(rowList);

    	 return callStatement;
    	
    	
    }
    
    
    private  String showSql(Configuration configuration, BoundSql boundSql) {
        Object parameterObject = boundSql.getParameterObject();
        List<ParameterMapping> parameterMappings = boundSql.getParameterMappings();
        String sql = boundSql.getSql().replaceAll("[\\s]+", " ");
        if (parameterMappings.size() > 0 && parameterObject != null) {
            TypeHandlerRegistry typeHandlerRegistry = configuration.getTypeHandlerRegistry();
            if (typeHandlerRegistry.hasTypeHandler(parameterObject.getClass())) {
                sql = sql.replaceFirst("\\?", getParameterValue(parameterObject));
 
            } else {
                MetaObject metaObject = configuration.newMetaObject(parameterObject);
                for (ParameterMapping parameterMapping : parameterMappings) {
                    String propertyName = parameterMapping.getProperty();
                    if (metaObject.hasGetter(propertyName)) {
                        Object obj = metaObject.getValue(propertyName);
                        sql = sql.replaceFirst("\\?", getParameterValue(obj));
                    } else if (boundSql.hasAdditionalParameter(propertyName)) {
                        Object obj = boundSql.getAdditionalParameter(propertyName);
                        sql = sql.replaceFirst("\\?", getParameterValue(obj));
                    }
                }
            }
        }
        return sql;
    }
 
    private static String getParameterValue(Object obj) {
        String value = null;
        if (obj instanceof String) {
            value = "'" + obj.toString() + "'";
        } else if (obj instanceof Date) {
            DateFormat formatter = DateFormat.getDateTimeInstance(DateFormat.DEFAULT, DateFormat.DEFAULT, Locale.CHINA);
            value = "'" + formatter.format(new Date()) + "'";
        } else {
            if (obj != null) {
                value = obj.toString();
            } else {
                value = "";
            }
 
        }
        return value;
    }
    
    
	@Override
	public Object plugin(Object target) {
		return Plugin.wrap(target, this);
	}

	@Override
	public void setProperties(Properties properties) {
	}
	
	 /**
     * 从数据库里查询总的记录数并计算总页数，回写进分页参数<code>PageParameter</code>,这样调用者就可用通过 分页参数
     * <code>PageParameter</code>获得相关信息。
     * 
     * @param sql
     * @param connection
     * @param mappedStatement
     * @param boundSql
     * @param page
     */
	
	
    private void setPageParameter(String sql, Connection connection, MappedStatement mappedStatement,
            BoundSql boundSql, PageBean pageBean) {
        // 记录总记录数
        String countSql = "select count(0) from (" + sql + ") a";
        PreparedStatement countStmt = null;
        ResultSet rs = null;
        try {
            countStmt = connection.prepareStatement(countSql);
            BoundSql countBS = new BoundSql(mappedStatement.getConfiguration(), countSql,
                    boundSql.getParameterMappings(), boundSql.getParameterObject());
            setParameters(countStmt, mappedStatement, countBS, boundSql.getParameterObject());
            rs = countStmt.executeQuery();
            int totalCount = 0;
            if (rs.next()) {
                totalCount = rs.getInt(1);
            }
            pageBean.setCount(totalCount);
            int totalPage = totalCount / pageBean.getPageSize() + ((totalCount % pageBean.getPageSize() == 0) ? 0 : 1);
            pageBean.setTotalPage(totalPage);

        } catch (SQLException e) {
            log.error("Ignore this exception", e);
        } finally {
            try {
                rs.close();
            } catch (SQLException e) {
                log.error("Ignore this exception", e);
            }
            try {
                countStmt.close();
            } catch (SQLException e) {
                log.error("Ignore this exception", e);
            }
        }

    }
    
    
    /**
     * 对SQL参数(?)设值
     * 
     * @param ps
     * @param mappedStatement
     * @param boundSql
     * @param parameterObject
     * @throws SQLException
     */
    private void setParameters(PreparedStatement ps, MappedStatement mappedStatement, BoundSql boundSql,
            Object parameterObject) throws SQLException {
        ParameterHandler parameterHandler = new DefaultParameterHandler(mappedStatement, parameterObject, boundSql);
        parameterHandler.setParameters(ps);
     
    }

	public DataBaseType getDataBaseType() {
		return dataBaseType;
	}

	public void setDataBaseType(DataBaseType dataBaseType) {
		this.dataBaseType = dataBaseType;
	}


	public static void main(String[] args){
		String sql = "select MAINLOG_ID, MODULE_NAME /*orderby ORDER BY UPDATE_TIME DESC orderby*/";
		sql = sql.replaceAll(ORDERBY_BEGIN, "");
		System.out.println(sql);
		sql = sql.replaceAll(ORDERBY_END, "");
		System.out.println(sql);
	}

}
