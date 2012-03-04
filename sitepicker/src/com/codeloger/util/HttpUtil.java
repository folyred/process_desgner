package com.codeloger.util;

/**
 * Http链接工具类
 * @author wx
 */
public class HttpUtil {

	/**
	 * 获取资源的静态链接
	 * 如 www.abc.com/index/view 里的 ../image/a.png，组织后返回www.abc.com/index/image/a.png
	 * @param pageUrl
	 * @param resourceUrl
	 * @return
	 * String 
	 * @author wx
	 */
	public static String getResourceStaticUrl(String pageUrl, String resourceUrl){
		if(!pageUrl.endsWith("/")){
			pageUrl += "/";
		}
		String protocol = getProtocol(pageUrl);
		String host = getHost(pageUrl);
		if(resourceUrl.startsWith("http")){
			return resourceUrl;
		}else if(resourceUrl.startsWith("/")){
			//使用的绝对路径
			return protocol + host + resourceUrl;
		}else if(resourceUrl.startsWith(".")){
			//可能是../相对路径，或者./写法的同目录路径
			int parentCount = StringUtil.getCharacterCount(resourceUrl, "../");
			String domainUrl = pageUrl.replace(protocol, "");
			String[] dirs = domainUrl.replace("//", "/").split("/");
			if(parentCount > dirs.length - 1){
				return resourceUrl;
			}
			StringBuffer buffer = new StringBuffer();
			for(int i = 0; i < dirs.length - parentCount; i++){
				buffer.append(dirs[i]).append("/");
			}
			String resourceDir = resourceUrl.replace("../", "").replace("./", "");
			return protocol + buffer.toString() + resourceDir;
		}else{
			//相对路径
			return pageUrl + resourceUrl;
		}
	}
	
	/**
	 * 获取协议
	 * @param url
	 * @return
	 * @author wx
	 */
	public static String getProtocol(String url){
		return url.substring(0, url.indexOf("://") + 3);
	}
	
	/**
	 * 获取host地址
	 * @param url
	 * @return
	 * String 
	 * @author wx
	 */
	public static String getHost(String url){
		if(!url.endsWith("/")){
			url += "/";
		}
		String protocol = getProtocol(url);
		int protocalLength = protocol.length();
		return url.substring(protocalLength, url.indexOf("/", protocalLength));
	}
}
