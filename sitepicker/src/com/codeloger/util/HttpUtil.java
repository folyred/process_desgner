package com.codeloger.util;

/**
 * Http���ӹ�����
 * @author wx
 */
public class HttpUtil {

	/**
	 * ��ȡ��Դ�ľ�̬����
	 * �� www.abc.com/index/view ��� ../image/a.png����֯�󷵻�www.abc.com/index/image/a.png
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
			//ʹ�õľ���·��
			return protocol + host + resourceUrl;
		}else if(resourceUrl.startsWith(".")){
			//������../���·��������./д����ͬĿ¼·��
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
			//���·��
			return pageUrl + resourceUrl;
		}
	}
	
	/**
	 * ��ȡЭ��
	 * @param url
	 * @return
	 * @author wx
	 */
	public static String getProtocol(String url){
		return url.substring(0, url.indexOf("://") + 3);
	}
	
	/**
	 * ��ȡhost��ַ
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
