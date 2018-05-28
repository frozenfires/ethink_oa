package com.ebring.platform.common.license;

import java.io.BufferedReader;  
import java.io.IOException;  
import java.io.InputStreamReader;  
import java.net.InetAddress;  
import java.net.NetworkInterface;  
import java.net.SocketException;  
import java.net.UnknownHostException;
import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
  
  
/** 
* @title: MacAddressUtil  
* @description：获取MAC地址 
* @author：wangjing.dc@qq.com
* @date： 2016-07-14
*/  
public class MacAddressUtil{  
      
    private static Logger log = LoggerFactory.getLogger(MacAddressUtil.class);
    
    /** 
    * @MethodName: getOSName  
    * @description : 获取当前操作系统名称. return 操作系统名称 例如:windows,Linux,Unix等 
    * @author：liming 
    * @date： 2013-5-5 下午04:43:36 
    * @return String 
    */  
    private static String getOSName() {  
        return System.getProperty("os.name").toLowerCase();  
    }  
      
    /** 
    * @MethodName: getWindowXPMACAddress  
    * @description : 获取widnowXp网卡的mac地址 
    * @author：liming 
    * @date： 2013-5-5 下午04:45:12 
    * @param execStr 
    * @return String 
    */  
    private static String getWindowXPMACAddress(String execStr) {  
        String mac = null;  
        BufferedReader bufferedReader = null;  
        Process process = null;  
        try {  
            // windows下的命令，显示信息中包含有mac地址信息  
            process = Runtime.getRuntime().exec(execStr);  
            bufferedReader = new BufferedReader(new InputStreamReader(process.getInputStream()));  
            String line = null;  
            int index = -1;  
            while ((line = bufferedReader.readLine()) != null) {  
                if(line.indexOf("本地连接") != -1)     //排除有虚拟网卡的情况  
                    continue;  
                  
                // 寻找标示字符串[physical address]  
                index = line.toLowerCase().indexOf("physical address");  
                if (index != -1) {  
                    index = line.indexOf(":");  
                    if (index != -1) {  
                        //取出mac地址并去除2边空格  
                        mac = line.substring(index + 1).trim();  
                    }  
                    break;  
                }     
            }  
        } catch (IOException e) {  
            e.printStackTrace();  
        } finally {  
            try {  
                if (bufferedReader != null) {  
                    bufferedReader.close();  
                }  
            } catch (IOException e1) {  
                e1.printStackTrace();  
            }  
            bufferedReader = null;  
            process = null;  
        }  
        return mac;  
    }  
      
    /** 
    * @MethodName: getWindow7MACAddress  
    * @description : 获取widnow7网卡的mac地址 
    * @author：liming 
    * @date： 2013-5-5 下午04:46:56 
    * @param execStr 
    * @return String 
    */  
    private static String getWindow7MACAddress() {  
        //获取本地IP对象  
        InetAddress ia = null;  
        try {  
            ia = InetAddress.getLocalHost();  
        } catch (UnknownHostException e) {  
            e.printStackTrace();  
        }  
        //获得网络接口对象（即网卡），并得到mac地址，mac地址存在于一个byte数组中。  
        byte[] mac = null;  
        try {  
            mac = NetworkInterface.getByInetAddress(ia).getHardwareAddress();  
        } catch (SocketException e) {  
            e.printStackTrace();  
        }  
        //下面代码是把mac地址拼装成String  
        StringBuffer sb = new StringBuffer();   
        for(int i=0;i<mac.length;i++){  
            if(i!=0){  
                sb.append("-");  
            }  
            //mac[i] & 0xFF 是为了把byte转化为正整数  
            String s = Integer.toHexString(mac[i] & 0xFF);  
            sb.append(s.length()==1?0+s:s);  
        }  
        //把字符串所有小写字母改为大写成为正规的mac地址并返回  
        return sb.toString().toUpperCase();  
    }  
      
    /** 
    * @MethodName: getLinuxMACAddress  
    * @description : 获取Linux网卡的mac地址 
    * @author：liming 
    * @date： 2013-5-5 下午04:49:13 
    * @return String 
    */  
    private static String getLinuxMACAddress() {  
        String mac = null;  
        BufferedReader bufferedReader = null;  
        Process process = null;  
        try {  
            // linux下的命令，一般取eth0作为本地主网卡 显示信息中包含有mac地址信息  
            process = Runtime.getRuntime().exec("ifconfig"); 
            bufferedReader = new BufferedReader(new InputStreamReader(process.getInputStream()));  
            String line = null;
            while ((line = bufferedReader.readLine()) != null) {
                int index1 = -1, index2 = -1;
                String offset1 = "硬件地址";
                String offset2 = "hwaddr";
                index1 = line.toLowerCase().indexOf(offset1);
                index2 = line.toLowerCase().indexOf(offset2);
                if (index1 != -1) {
                    // 取出mac地址并去除2边空格
                    mac = line.substring(index1 + offset1.length()).trim();
                    break;
                } else if (index2 != -1) {
                    mac = line.substring(index2 + offset2.length() + 1).trim();
                    break;
                }
            }
        } catch (IOException e) {  
            e.printStackTrace();  
        } finally {  
            try {  
                if (bufferedReader != null) {  
                    bufferedReader.close();  
                }  
            } catch (IOException e1) {  
                e1.printStackTrace();  
            }  
            bufferedReader = null;  
            process = null;  
        }  
        return mac;  
    }  
      
    /** 
    * @MethodName: getUnixMACAddress  
    * @description : 获取Unix网卡的mac地址 
    * @author：liming 
    * @date： 2013-5-5 下午04:49:59 
    * @return String 
    */  
    private static String getUnixMACAddress() {  
        String mac = null;  
        BufferedReader bufferedReader = null;  
        Process process = null;  
        try {  
            // Unix下的命令，一般取eth0作为本地主网卡 显示信息中包含有mac地址信息  
            process = Runtime.getRuntime().exec("ifconfig eth0");  
            bufferedReader = new BufferedReader(new InputStreamReader(process.getInputStream()));  
            String line = null;  
            int index = -1;  
            while ((line = bufferedReader.readLine()) != null) {  
                // 寻找标示字符串[hwaddr]  
                index = line.toLowerCase().indexOf("hwaddr");  
                if (index != -1) {  
                    // 取出mac地址并去除2边空格  
                    mac = line.substring(index + "hwaddr".length() + 1).trim();  
                    break;  
                }  
            }  
        } catch (IOException e) {  
            e.printStackTrace();  
        } finally {  
            try {  
                if (bufferedReader != null) {  
                    bufferedReader.close();  
                }  
            } catch (IOException e1) {  
                e1.printStackTrace();  
            }  
            bufferedReader = null;  
            process = null;  
        }  
  
        return mac;  
    }  
    
    /**
     * 获取本机mac地址
     * @return
     */
    public static String getMacAddress(){
        // 先以NetworkInterface的方式获取mac地址
        String mac = getMacAddressByNative();
        
        if(mac == null){
            // 次而尝试以cmd方式获取mac地址
            mac = getMacAddressByCmd();
        }
        
        // 最后返回默认mac
        if(mac == null || "".equals(mac)){
            mac = "FF-FF-FF-FF-FF-FQ";
        }
        
        return mac;
    }
    
    private static String getMacAddressByNative(){
        try {
            byte[] mac = NetworkInterface.getByInetAddress(
                    InetAddress.getLocalHost()).getHardwareAddress();
//          byte[] mac = NetworkInterface.getByInetAddress(
//                  InetAddress.getByName("192.168.56.1"))  .getHardwareAddress();
            
            StringBuilder macstr = new StringBuilder();
            for (int i = 0; i < mac.length; i++) {
                String macUnit = Integer.toHexString(mac[i] & 0xff)
                        .toUpperCase();
                macUnit = macUnit.length() == 1 ? "0" + macUnit : macUnit;
                
                macstr.append(macUnit);
                if (i < mac.length - 1) {
                    macstr.append("-");
                }
            }

            return macstr.toString();
        } catch (Exception e) {
            log.error(null, e);
            return null;
        }
    }
      
    /** 
    * @MethodName: getMacAddress  
    * @description :获取MAC地址 
    * @author：liming 
    * @date： 2013-5-5 下午04:53:25 
    * @return String 
    */  
    private static String getMacAddressByCmd(){  
        String os = getOSName();
        log.debug("os=" + os);
        String execStr = getSystemRoot()+"/system32/ipconfig /all";  
        String mac = "";  
        if(os.startsWith("windows")){
            
            if(os.equals("windows xp")){//xp  
                mac = getWindowXPMACAddress(execStr);    
            }else if(os.equals("windows 2003")){//2003  
                mac = getWindowXPMACAddress(execStr);     
            }else{//win7  
                mac = getWindow7MACAddress();   
            }  
        }else if (os.startsWith("linux")) {  
            mac = getLinuxMACAddress();  
        }else{  
            mac = getUnixMACAddress();  
        }
        mac = mac==null ? "" : mac.replaceAll(":", "-");
        return mac;  
    }  
      
    /** 
    * @MethodName: getSystemRoot  
    * @description :jdk1.4获取系统命令路径 ：SystemRoot=C:\WINDOWS 
    * @author：liming 
    * @date： 2013-5-5 下午04:56:27 
    * @return String 
    */  
    private static String getSystemRoot(){  
        String cmd = null;  
        String os = null;  
        String result = null;  
        String envName = "windir";  
        os = System.getProperty("os.name").toLowerCase();  
        if(os.startsWith("windows")) {  
            cmd = "cmd /c SET";  
        }else {  
            cmd = "env";  
        }  
        try {  
            Process p = Runtime.getRuntime().exec(cmd);  
            InputStreamReader isr = new InputStreamReader(p.getInputStream());  
            BufferedReader commandResult = new BufferedReader(isr);  
            String line = null;  
            while ((line = commandResult.readLine()) != null) {  
                line=line.toLowerCase();//重要(同一操作系统不同电脑有些返回的是小写,有些是大写.因此需要统一转换成小写)  
                if (line.indexOf(envName) > -1) {  
                    result =  line.substring(line.indexOf(envName)  
                            + envName.length() + 1);  
                    return result;  
                }  
            }  
        } catch (Exception e) {  
            System.out.println("获取系统命令路径 error: " + cmd + ":" + e);  
        }  
        return null;  
    }  
      
    
    public static void main(String args[]) throws Exception{
        System.out.println(getMacAddress());
        
        
        System.out.println(
                Arrays.toString(
                NetworkInterface.getByInetAddress(
                InetAddress.getByName("172.27.3.1"))
                .getHardwareAddress()
                ));
    }
  
}  