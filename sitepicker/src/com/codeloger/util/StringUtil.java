package com.codeloger.util;


/**
 * 此类主要为为string的辅助类,一些公共的方法
 */
public class StringUtil {

	/**
	 * 是否为空
	 * @param str
	 * @return
	 * @author wx
	 */
	public static boolean notEmpty(Object str) {
		if (str != null && str.toString().trim().length() > 0) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * 获取字符串包含几个特定字符
	 * @param str
	 * @param aChar
	 * @return
	 * @author wx
	 */
	public static int getCharacterCount(String str, String aChar){
		int index = str.indexOf(aChar);
		int count = 0;
		while(index >= 0){
			count ++;
			index = str.indexOf(aChar, index + 1);
		}
		return count;
	}

}
